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
        try {
            $templates = Role::with('permissions')
                ->orderBy('is_default', 'desc')
                ->orderBy('created_at', 'desc')
                ->get();

            $templatesData = RoleTemplateResource::collection($templates)->resolve();

            return Inertia::render('role-templates/manage', [
                'templates' => $templatesData,
                'totalTemplates' => $templates->count(),
                'defaultTemplates' => $templates->where('is_default', true)->count(),
                'customTemplates' => $templates->where('is_default', false)->count(),
            ]);
        } catch (\Throwable $th) {
            return Inertia::render('role-templates/manage', [
                'templates' => [],
                'totalTemplates' => 0,
                'defaultTemplates' => 0,
                'customTemplates' => 0,
            ]);
        }
    }

    public function create(): Response
    {
        return Inertia::render('role-templates/create');
    }

    public function store(StoreRoleTemplateRequest $request): RedirectResponse
    {
        $validatedData = $request->validated();

        DB::beginTransaction();
        try {
            // Convert permissions from form format to proper array
            $permissions = [];
            if (isset($validatedData['permissions']) && is_array($validatedData['permissions'])) {
                foreach ($validatedData['permissions'] as $key => $value) {
                    // Handle both boolean and string '1'/'0' values
                    $permissions[$key] = filter_var($value, FILTER_VALIDATE_BOOLEAN, FILTER_NULL_ON_FAILURE) ?? false;
                }
            }

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

            $permissionNames = array_keys(array_filter($permissions));
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
            DB::rollBack();
            return back()->withErrors(['error' => 'Failed to create role template: ' . $th->getMessage()])->withInput();
        }
    }

    public function show($id): Response
    {
        try {
            $role = Role::where('uuid', $id)
                ->orWhere('id', $id)
                ->with('permissions')
                ->firstOrFail();

            $templateData = (new RoleTemplateResource($role))->resolve();

            return Inertia::render('role-templates/show', [
                'template' => $templateData,
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

            $templateData = (new RoleTemplateResource($role))->resolve();

            return Inertia::render('role-templates/edit', [
                'template' => $templateData,
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

            // Convert permissions from form format to proper array
            $permissions = [];
            if (isset($validatedData['permissions']) && is_array($validatedData['permissions'])) {
                foreach ($validatedData['permissions'] as $key => $value) {
                    // Handle both boolean and string '1'/'0' values
                    $permissions[$key] = filter_var($value, FILTER_VALIDATE_BOOLEAN, FILTER_NULL_ON_FAILURE) ?? false;
                }
            }

            $role->update([
                'name' => $validatedData['name'],
                'description' => $validatedData['description'],
                'template_permissions' => $permissions,
                'commission_enabled' => $validatedData['commissionEnabled'] ?? false,
                'default_commission' => $validatedData['defaultCommission'] ?? 0,
                'is_default' => $validatedData['isDefault'] ?? $role->is_default,
            ]);

            $permissionNames = array_keys(array_filter($permissions));
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
            DB::rollBack();
            return back()->withErrors(['error' => 'Failed to update role template: ' . $th->getMessage()])->withInput();
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
                return back()->withErrors(['error' => 'Cannot delete default templates. You can edit them instead.']);
            }

            $role->permissions()->detach();
            $role->delete();

            DB::commit();
            return redirect()->route('admin.role-templates.index')->with('success', 'Role template deleted successfully');
        } catch (\Throwable $th) {
            DB::rollBack();
            return back()->withErrors(['error' => 'Failed to delete role template: ' . $th->getMessage()]);
        }
    }
}

