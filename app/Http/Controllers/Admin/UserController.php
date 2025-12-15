<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Resources\PermissionResource;
use App\Http\Resources\RoleResource;
use App\Http\Resources\UserResource;
use App\Models\Role;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;
use Spatie\Permission\Models\Permission;
use Yajra\DataTables\Facades\DataTables;

class UserController extends Controller
{
    public function index(): Response
    {
        $users = User::with('roles')->get();
        $roles = Role::all();
        $permissions = Permission::where('guard_name', 'web')->get();

        return Inertia::render('users/manage', [
            'users' => UserResource::collection($users),
            'totalUsers' => $users->count(),
            'activeUsers' => $users->where('status', 'Active')->count(),
            'adminUsers' => $users->filter(function ($user) {
                $roleNames = $user->roles->pluck('name')->toArray();
                return in_array('Super Admin', $roleNames) || in_array('Manager', $roleNames);
            })->count(),
            'roles' => RoleResource::collection($roles),
            'permissions' => PermissionResource::collection($permissions),
            'csrfToken' => csrf_token(),
        ]);
    }

    public function create(): Response
    {
        $roles = Role::all();
        $permissions = Permission::where('guard_name', 'web')->get();

        return Inertia::render('users/create', [
            'roles' => RoleResource::collection($roles),
            'permissions' => PermissionResource::collection($permissions),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255|unique:users,email',
            'phone' => 'nullable|string|max:255',
            'password' => 'required|string|min:8',
            'role' => 'required|string',
            'status' => 'required|string|in:Active,Inactive,Suspended',
            'assignedStore' => 'nullable|string',
            'commissionEnabled' => 'nullable|boolean',
            'commissionRate' => 'nullable|numeric|min:0|max:100',
            'permissions' => 'nullable|array',
            'permissions.*' => 'nullable|string',
        ]);

        DB::beginTransaction();
        try {
            $user = User::create([
                'uuid' => (string) Str::uuid(),
                'user_id' => 'USR-' . strtoupper(Str::random(8)),
                'name' => $validated['name'],
                'email' => $validated['email'],
                'phone' => $validated['phone'] ?? null,
                'password' => bcrypt($validated['password']),
                'status' => $validated['status'],
                'assigned_store' => $validated['assignedStore'] ?? null,
                'commission_enabled' => $validated['commissionEnabled'] ?? false,
                'commission_rate' => $validated['commissionRate'] ?? 0,
            ]);

            // Assign role
            if (isset($validated['role'])) {
                $role = Role::where('name', $validated['role'])->first();
                if ($role) {
                    $user->assignRole($role);
                }
            }

            // Assign permissions if provided
            if (isset($validated['permissions']) && is_array($validated['permissions'])) {
                $permissionNames = array_keys(array_filter($validated['permissions']));
                if (!empty($permissionNames)) {
                    $permissions = Permission::whereIn('name', $permissionNames)->get();
                    $user->syncPermissions($permissions);
                } else {
                    $user->syncPermissions([]);
                }
            }

            DB::commit();
            return redirect()->route('admin.users.index')->with('success', 'User created successfully');
        } catch (\Throwable $th) {
            logError('UserController@store', $th);
            DB::rollBack();
            return back()->withErrors(['error' => 'Failed to create user'])->withInput();
        }
    }

    public function show($id): Response
    {
        $user = User::where('uuid', $id)
            ->orWhere('id', $id)
            ->with('roles')
            ->firstOrFail();

        return Inertia::render('users/show', [
            'user' => new UserResource($user),
        ]);
    }

    public function edit($id): Response|JsonResponse
    {
        $user = User::where('uuid', $id)
            ->orWhere('id', $id)
            ->with('roles', 'permissions')
            ->firstOrFail();

        $roles = Role::all();
        $permissions = Permission::where('guard_name', 'web')->get();

        // Return JSON if it's an AJAX request (for modal)
        if (request()->wantsJson() || request()->ajax() || request()->header('X-Requested-With') === 'XMLHttpRequest') {
            return response()->json([
                'user' => new UserResource($user),
                'roles' => RoleResource::collection($roles),
                'permissions' => PermissionResource::collection($permissions),
            ]);
        }

        return Inertia::render('users/edit', [
            'user' => new UserResource($user),
            'roles' => RoleResource::collection($roles),
            'permissions' => PermissionResource::collection($permissions),
        ]);
    }

    public function update(Request $request, $id): RedirectResponse
    {
        $user = User::where('uuid', $id)
            ->orWhere('id', $id)
            ->firstOrFail();

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255|unique:users,email,' . $user->id,
            'phone' => 'nullable|string|max:255',
            'password' => 'nullable|string|min:8',
            'role' => 'required|string',
            'status' => 'required|string|in:Active,Inactive,Suspended',
            'assignedStore' => 'nullable|string',
            'commissionEnabled' => 'nullable|boolean',
            'commissionRate' => 'nullable|numeric|min:0|max:100',
            'permissions' => 'nullable|array',
            'permissions.*' => 'nullable|string',
        ]);

        DB::beginTransaction();
        try {
            $updateData = [
                'name' => $validated['name'],
                'email' => $validated['email'],
                'phone' => $validated['phone'] ?? null,
                'status' => $validated['status'],
                'assigned_store' => $validated['assignedStore'] ?? null,
                'commission_enabled' => $validated['commissionEnabled'] ?? false,
                'commission_rate' => $validated['commissionRate'] ?? 0,
            ];

            if (!empty($validated['password'])) {
                $updateData['password'] = bcrypt($validated['password']);
            }

            $user->update($updateData);

            // Sync role
            if (isset($validated['role'])) {
                $role = Role::where('name', $validated['role'])->first();
                if ($role) {
                    $user->syncRoles([$role]);
                }
            }

            // Sync permissions if provided
            if (isset($validated['permissions']) && is_array($validated['permissions'])) {
                $permissionNames = array_keys(array_filter($validated['permissions']));
                if (!empty($permissionNames)) {
                    $permissions = Permission::whereIn('name', $permissionNames)->get();
                    $user->syncPermissions($permissions);
                } else {
                    $user->syncPermissions([]);
                }
            }

            DB::commit();
            return redirect()->route('admin.users.index')->with('success', 'User updated successfully');
        } catch (\Throwable $th) {
            logError('UserController@update', $th);
            DB::rollBack();
            return back()->withErrors(['error' => 'Failed to update user'])->withInput();
        }
    }

    public function destroy($id): RedirectResponse
    {
        try {
            $user = User::where('uuid', $id)
                ->orWhere('id', $id)
                ->firstOrFail();

            $user->delete();

            return redirect()->route('admin.users.index')->with('success', 'User deleted successfully');
        } catch (\Throwable $th) {
            logError('UserController@destroy', $th);
            return back()->withErrors(['error' => 'Failed to delete user']);
        }
    }

    public function table()
    {
        $users = User::with('roles')->get()->map(function ($user) {
            return [
                'uuid' => $user->uuid ?? $user->id,
                'user_id' => $user->user_id ?? $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'phone' => $user->phone ?? '-',
                'role_name' => $user->roles->pluck('name')->implode(', ') ?: 'No Role',
                'status' => $user->status ?? 'Active',
                'last_login' => $user->last_login ? $user->last_login->format('Y-m-d') : '-',
            ];
        });

        return DataTables::of($users)->make(true);
    }
}
