<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreRoleTemplateRequest;
use App\Http\Requests\UpdateRoleTemplateRequest;
use App\Http\Resources\RoleTemplateResource;
use App\Models\Role;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;
use Spatie\Permission\Models\Permission;

class RoleTemplateController extends Controller
{
    public function index(): Response
    {
        $templates = Role::with('permissions')
            ->orderBy('is_default', 'desc')
            ->orderBy('created_at', 'desc')
            ->get();

        $permissions = Permission::where('guard_name', 'web')
            ->orderBy('name')
            ->pluck('name')
            ->toArray();

        return Inertia::render('role-templates/manage', [
            'templates' => RoleTemplateResource::collection($templates),
            'totalTemplates' => $templates->count(),
            'defaultTemplates' => $templates->where('is_default', true)->count(),
            'customTemplates' => $templates->where('is_default', false)->count(),
            'availablePermissions' => $permissions,
            'csrfToken' => csrf_token(),
        ]);
    }

    public function create(): Response
    {
        $permissions = Permission::where('guard_name', 'web')
            ->orderBy('name')
            ->pluck('name')
            ->toArray();

        return Inertia::render('role-templates/create', [
            'availablePermissions' => $permissions,
        ]);
    }

    public function store(StoreRoleTemplateRequest $request): RedirectResponse
    {
        $validatedData = $request->validated();

        DB::beginTransaction();
        try {
            $permissions = $validatedData['permissions'] ?? [];
            
            $role = Role::create([
                'uuid' => (string) Str::uuid(),
                'name' => $validatedData['name'],
                'guard_name' => 'web',
                'description' => $validatedData['description'],
                'template_permissions' => $permissions,
                'commission_enabled' => $validatedData['commissionEnabled'] ?? false,
                'default_commission' => $validatedData['defaultCommission'] ?? 0,
                'is_default' => false,
            ]);

            $permissionNames = array_keys(array_filter($permissions, fn($value) => $value === true || $value === '1' || $value === 1));
            if (!empty($permissionNames)) {
                $permissionIds = Permission::whereIn('name', $permissionNames)
                    ->where('guard_name', 'web')
                    ->pluck('id')
                    ->toArray();
                $role->syncPermissions($permissionIds);
            } else {
                $role->syncPermissions([]);
            }

            DB::commit();
            return redirect()->route('admin.role-templates.index')->with('success', 'Role template created successfully');
        } catch (\Throwable $th) {
            logError('RoleTemplateController@store', $th);
            DB::rollBack();
            return back()->with('error', 'Failed to create role template')->withInput();
        }
    }

    public function show($id): Response
    {
        try {
            $role = Role::where('uuid', $id)
                ->orWhere('id', $id)
                ->with('permissions')
                ->firstOrFail();

            return Inertia::render('role-templates/show', [
                'template' => new RoleTemplateResource($role),
            ]);
        } catch (\Throwable $th) {
            abort(404, 'Template not found');
        }
    }

    public function edit($id): Response
    {
        try {
            $role = Role::where('uuid', $id)
                ->orWhere('id', $id)
                ->with('permissions')
                ->firstOrFail();

            $permissions = Permission::where('guard_name', 'web')
                ->orderBy('name')
                ->pluck('name')
                ->toArray();

            return Inertia::render('role-templates/edit', [
                'template' => new RoleTemplateResource($role),
                'availablePermissions' => $permissions,
            ]);
        } catch (\Throwable $th) {
            abort(404, 'Template not found');
        }
    }

    public function update(UpdateRoleTemplateRequest $request, $id): RedirectResponse
    {
        $validatedData = $request->validated();

        DB::beginTransaction();
        try {
            $role = Role::where('uuid', $id)
                ->orWhere('id', $id)
                ->firstOrFail();

            if ($role->is_default) {
                $validatedData['isDefault'] = true;
            }

            $permissions = $validatedData['permissions'] ?? [];

            $role->update([
                'name' => $validatedData['name'],
                'description' => $validatedData['description'],
                'template_permissions' => $permissions,
                'commission_enabled' => $validatedData['commissionEnabled'] ?? false,
                'default_commission' => $validatedData['defaultCommission'] ?? 0,
                'is_default' => $validatedData['isDefault'] ?? $role->is_default,
            ]);

            $permissionNames = array_keys(array_filter($permissions, fn($value) => $value === true || $value === '1' || $value === 1));
            if (!empty($permissionNames)) {
                $permissionIds = Permission::whereIn('name', $permissionNames)
                    ->where('guard_name', 'web')
                    ->pluck('id')
                    ->toArray();
                $role->syncPermissions($permissionIds);
            } else {
                $role->syncPermissions([]);
            }

            DB::commit();
            return redirect()->route('admin.role-templates.index')->with('success', 'Role template updated successfully');
        } catch (\Throwable $th) {
            logError('RoleTemplateController@update', $th);
            DB::rollBack();
            return back()->with('error', 'Failed to update role template')->withInput();
        }
    }

    public function destroy($id): RedirectResponse
    {
        DB::beginTransaction();
        try {
            $role = Role::where('uuid', $id)
                ->orWhere('id', $id)
                ->firstOrFail();

            if ($role->is_default) {
                return back()->with('error', 'Cannot delete default templates. You can edit them instead.');
            }

            $role->permissions()->detach();
            $role->delete();

            DB::commit();
            return redirect()->route('admin.role-templates.index')->with('success', 'Role template deleted successfully');
        } catch (\Throwable $th) {
            logError('RoleTemplateController@destroy', $th);
            DB::rollBack();
            return back()->with('error', 'Failed to delete role template');
        }
    }
}
