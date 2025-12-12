<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Inertia\Inertia;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class UserController extends Controller
{
    public function index()
    {
        // Sample data matching the design
        $users = [
            [
                'id' => 'USR-001',
                'name' => 'Admin User',
                'email' => 'admin@dealership.com',
                'phone' => '(555) 111-1111',
                'role' => 'Super Admin',
                'status' => 'Active',
                'lastLogin' => '2024-11-26',
                'permissions' => ['Dashboard', 'Products', 'Inventory', 'Orders', 'Accounts', 'Warranty', 'Reports', 'Admin'],
                'assignedStore' => null,
                'commissionEnabled' => false,
                'commissionRate' => 0,
            ],
            [
                'id' => 'USR-002',
                'name' => 'John Manager',
                'email' => 'john.manager@dealership.com',
                'phone' => '(555) 222-2222',
                'role' => 'Manager',
                'status' => 'Active',
                'lastLogin' => '2024-11-26',
                'permissions' => ['Dashboard', 'Products', 'Inventory', 'Orders', 'Accounts', 'Warranty', 'Reports'],
                'assignedStore' => null,
                'commissionEnabled' => false,
                'commissionRate' => 0,
            ],
            [
                'id' => 'USR-003',
                'name' => 'Sarah Sales',
                'email' => 'sarah.sales@dealership.com',
                'phone' => '(555) 333-3333',
                'role' => 'Sales',
                'status' => 'Active',
                'lastLogin' => '2024-11-25',
                'permissions' => ['Dashboard', 'Orders', 'Accounts', 'Products'],
                'assignedStore' => null,
                'commissionEnabled' => true,
                'commissionRate' => 5.0,
            ],
            [
                'id' => 'USR-004',
                'name' => 'Mike Inventory',
                'email' => 'mike.inv@dealership.com',
                'phone' => '(555) 444-4444',
                'role' => 'Inventory Manager',
                'status' => 'Active',
                'lastLogin' => '2024-11-25',
                'permissions' => ['Dashboard', 'Inventory', 'Products', 'Orders'],
                'assignedStore' => null,
                'commissionEnabled' => false,
                'commissionRate' => 0,
            ],
            [
                'id' => 'USR-005',
                'name' => 'Lisa Support',
                'email' => 'lisa.support@dealership.com',
                'phone' => '(555) 555-5555',
                'role' => 'Support',
                'status' => 'Active',
                'lastLogin' => '2024-11-24',
                'permissions' => ['Dashboard', 'Warranty', 'Accounts'],
                'assignedStore' => null,
                'commissionEnabled' => false,
                'commissionRate' => 0,
            ],
            [
                'id' => 'USR-006',
                'name' => 'David Reports',
                'email' => 'david.reports@dealership.com',
                'phone' => '(555) 666-6666',
                'role' => 'Analyst',
                'status' => 'Active',
                'lastLogin' => '2024-11-23',
                'permissions' => ['Dashboard', 'Reports'],
                'assignedStore' => null,
                'commissionEnabled' => false,
                'commissionRate' => 0,
            ],
            [
                'id' => 'USR-007',
                'name' => 'Tom Former',
                'email' => 'tom.former@dealership.com',
                'phone' => '(555) 777-7777',
                'role' => 'Sales',
                'status' => 'Inactive',
                'lastLogin' => '2024-10-15',
                'permissions' => ['Dashboard', 'Orders'],
                'assignedStore' => null,
                'commissionEnabled' => false,
                'commissionRate' => 0,
            ],
        ];

        return Inertia::render('users/manage', [
            'users' => $users,
            'totalUsers' => count($users),
            'activeUsers' => count(array_filter($users, fn($u) => $u['status'] === 'Active')),
            'adminUsers' => count(array_filter($users, fn($u) => in_array($u['role'], ['Super Admin', 'Manager']))),
            'roles' => [
                'Sales',
                'Manager',
                'Super Admin',
                'Inventory Manager',
                'Support',
                'Analyst',
                'Dealers',
                'Insurance Industry',
                'Distributors',
                'Store User',
            ],
            'availableAccounts' => [
                ['id' => 'ACC-001', 'name' => 'John Smith', 'type' => 'Individual'],
                ['id' => 'ACC-002', 'name' => 'Sarah Johnson', 'type' => 'Individual'],
                ['id' => 'ACC-005', 'name' => 'ABC Fleet Services', 'type' => 'Business'],
                ['id' => 'ACC-009', 'name' => 'XYZ Logistics', 'type' => 'Business'],
                ['id' => 'ACC-011', 'name' => 'Global Motors USA', 'type' => 'Corporate'],
                ['id' => 'ACC-012', 'name' => 'Texas Fleet Co', 'type' => 'Business'],
            ],
        ]);
    }

    public function create()
    {
        return Inertia::render('users/create', [
            'roles' => [
                'Sales',
                'Manager',
                'Super Admin',
                'Inventory Manager',
                'Support',
                'Analyst',
                'Dealers',
                'Insurance Industry',
                'Distributors',
                'Store User',
            ],
            'availableAccounts' => [
                ['id' => 'ACC-001', 'name' => 'John Smith', 'type' => 'Individual'],
                ['id' => 'ACC-002', 'name' => 'Sarah Johnson', 'type' => 'Individual'],
                ['id' => 'ACC-005', 'name' => 'ABC Fleet Services', 'type' => 'Business'],
                ['id' => 'ACC-009', 'name' => 'XYZ Logistics', 'type' => 'Business'],
                ['id' => 'ACC-011', 'name' => 'Global Motors USA', 'type' => 'Corporate'],
                ['id' => 'ACC-012', 'name' => 'Texas Fleet Co', 'type' => 'Business'],
            ],
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255|unique:users,email',
            'phone' => 'required|string|max:255',
            'password' => 'required|string|min:8',
            'role' => 'required|string',
            'status' => 'required|string|in:Active,Inactive,Suspended',
            'assignedStore' => 'nullable|string',
            'commissionEnabled' => 'boolean',
            'commissionRate' => 'nullable|numeric|min:0|max:100',
        ]);

        DB::beginTransaction();
        try {
            // TODO: Create user in database when User model is ready
            // $user = User::create($validated);

            DB::commit();
            return redirect()->route('admin.users.index')->with('success', 'User created successfully');
        } catch (\Throwable $th) {
            DB::rollBack();
            return back()->withErrors(['error' => 'Failed to create user'])->withInput();
        }
    }

    public function show($id)
    {
        // TODO: Load user from database when User model is ready
        // $user = User::findOrFail($id);

        $user = null;

        return Inertia::render('users/show', [
            'user' => $user,
        ]);
    }

    public function edit($id)
    {
        // TODO: Load user from database when User model is ready
        // $user = User::findOrFail($id);

        $user = null;

        return Inertia::render('users/edit', [
            'user' => $user,
            'roles' => [
                'Sales',
                'Manager',
                'Super Admin',
                'Inventory Manager',
                'Support',
                'Analyst',
                'Dealers',
                'Insurance Industry',
                'Distributors',
                'Store User',
            ],
            'availableAccounts' => [
                ['id' => 'ACC-001', 'name' => 'John Smith', 'type' => 'Individual'],
                ['id' => 'ACC-002', 'name' => 'Sarah Johnson', 'type' => 'Individual'],
                ['id' => 'ACC-005', 'name' => 'ABC Fleet Services', 'type' => 'Business'],
                ['id' => 'ACC-009', 'name' => 'XYZ Logistics', 'type' => 'Business'],
                ['id' => 'ACC-011', 'name' => 'Global Motors USA', 'type' => 'Corporate'],
                ['id' => 'ACC-012', 'name' => 'Texas Fleet Co', 'type' => 'Business'],
            ],
        ]);
    }

    public function update(Request $request, $id)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'phone' => 'required|string|max:255',
            'password' => 'nullable|string|min:8',
            'role' => 'required|string',
            'status' => 'required|string|in:Active,Inactive,Suspended',
            'assignedStore' => 'nullable|string',
            'commissionEnabled' => 'boolean',
            'commissionRate' => 'nullable|numeric|min:0|max:100',
        ]);

        DB::beginTransaction();
        try {
            // TODO: Update user in database when User model is ready
            // $user = User::findOrFail($id);
            // $user->update($validated);

            DB::commit();
            return redirect()->route('admin.users.index')->with('success', 'User updated successfully');
        } catch (\Throwable $th) {
            DB::rollBack();
            return back()->withErrors(['error' => 'Failed to update user'])->withInput();
        }
    }

    public function destroy($id)
    {
        try {
            // TODO: Delete user from database when User model is ready
            // $user = User::findOrFail($id);
            // $user->delete();

            return redirect()->route('admin.users.index')->with('success', 'User deleted successfully');
        } catch (\Throwable $th) {
            return back()->withErrors(['error' => 'Failed to delete user']);
        }
    }
}

