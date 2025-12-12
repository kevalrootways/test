<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Inertia\Inertia;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class RoleTemplateController extends Controller
{
    public function index()
    {
        // Sample data matching the design
        $templates = [
            [
                'id' => 'TPL-001',
                'name' => 'Sales Representative',
                'description' => 'Full access to sales, accounts, and orders. Commission enabled.',
                'permissions' => [
                    'dashboard' => true,
                    'products' => true,
                    'inventory' => false,
                    'orders' => true,
                    'accounts' => true,
                    'warranty' => false,
                    'reports' => false,
                    'admin' => false,
                ],
                'commissionEnabled' => true,
                'defaultCommission' => 5,
                'isDefault' => true,
                'createdDate' => '2024-01-15',
            ],
            [
                'id' => 'TPL-002',
                'name' => 'Account Manager',
                'description' => 'Account and customer relationship management. Commission enabled.',
                'permissions' => [
                    'dashboard' => true,
                    'products' => true,
                    'inventory' => false,
                    'orders' => true,
                    'accounts' => true,
                    'warranty' => true,
                    'reports' => true,
                    'admin' => false,
                ],
                'commissionEnabled' => true,
                'defaultCommission' => 3,
                'isDefault' => true,
                'createdDate' => '2024-01-15',
            ],
            [
                'id' => 'TPL-003',
                'name' => 'Support Staff',
                'description' => 'Customer support and warranty management. No commission.',
                'permissions' => [
                    'dashboard' => true,
                    'products' => false,
                    'inventory' => false,
                    'orders' => false,
                    'accounts' => true,
                    'warranty' => true,
                    'reports' => false,
                    'admin' => false,
                ],
                'commissionEnabled' => false,
                'defaultCommission' => 0,
                'isDefault' => true,
                'createdDate' => '2024-01-15',
            ],
            [
                'id' => 'TPL-004',
                'name' => 'Inventory Manager',
                'description' => 'Manage products and inventory. No commission.',
                'permissions' => [
                    'dashboard' => true,
                    'products' => true,
                    'inventory' => true,
                    'orders' => true,
                    'accounts' => false,
                    'warranty' => false,
                    'reports' => false,
                    'admin' => false,
                ],
                'commissionEnabled' => false,
                'defaultCommission' => 0,
                'isDefault' => true,
                'createdDate' => '2024-01-15',
            ],
            [
                'id' => 'TPL-005',
                'name' => 'Manager',
                'description' => 'Full access except admin panel. Commission enabled.',
                'permissions' => [
                    'dashboard' => true,
                    'products' => true,
                    'inventory' => true,
                    'orders' => true,
                    'accounts' => true,
                    'warranty' => true,
                    'reports' => true,
                    'admin' => false,
                ],
                'commissionEnabled' => true,
                'defaultCommission' => 2,
                'isDefault' => true,
                'createdDate' => '2024-01-15',
            ],
            [
                'id' => 'TPL-006',
                'name' => 'Super Admin',
                'description' => 'Full system access. No commission.',
                'permissions' => [
                    'dashboard' => true,
                    'products' => true,
                    'inventory' => true,
                    'orders' => true,
                    'accounts' => true,
                    'warranty' => true,
                    'reports' => true,
                    'admin' => true,
                ],
                'commissionEnabled' => false,
                'defaultCommission' => 0,
                'isDefault' => true,
                'createdDate' => '2024-01-15',
            ],
        ];

        return Inertia::render('role-templates/manage', [
            'templates' => $templates,
            'totalTemplates' => count($templates),
            'defaultTemplates' => count(array_filter($templates, fn($t) => $t['isDefault'])),
            'customTemplates' => count(array_filter($templates, fn($t) => !$t['isDefault'])),
        ]);
    }

    public function create()
    {
        return Inertia::render('role-templates/create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'required|string|max:500',
            'permissions' => 'required|array',
            'permissions.dashboard' => 'boolean',
            'permissions.products' => 'boolean',
            'permissions.inventory' => 'boolean',
            'permissions.orders' => 'boolean',
            'permissions.accounts' => 'boolean',
            'permissions.warranty' => 'boolean',
            'permissions.reports' => 'boolean',
            'permissions.admin' => 'boolean',
            'commissionEnabled' => 'boolean',
            'defaultCommission' => 'nullable|numeric|min:0|max:100',
        ]);

        DB::beginTransaction();
        try {
            // TODO: Create role template in database when RoleTemplate model is ready
            // $template = RoleTemplate::create($validated);

            DB::commit();
            return redirect()->route('admin.role-templates.index')->with('success', 'Role template created successfully');
        } catch (\Throwable $th) {
            DB::rollBack();
            return back()->withErrors(['error' => 'Failed to create role template'])->withInput();
        }
    }

    public function show($id)
    {
        // TODO: Load template from database when RoleTemplate model is ready
        // $template = RoleTemplate::findOrFail($id);

        $template = null;

        return Inertia::render('role-templates/show', [
            'template' => $template,
        ]);
    }

    public function edit($id)
    {
        // TODO: Load template from database when RoleTemplate model is ready
        // $template = RoleTemplate::findOrFail($id);

        $template = null;

        return Inertia::render('role-templates/edit', [
            'template' => $template,
        ]);
    }

    public function update(Request $request, $id)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'required|string|max:500',
            'permissions' => 'required|array',
            'permissions.dashboard' => 'boolean',
            'permissions.products' => 'boolean',
            'permissions.inventory' => 'boolean',
            'permissions.orders' => 'boolean',
            'permissions.accounts' => 'boolean',
            'permissions.warranty' => 'boolean',
            'permissions.reports' => 'boolean',
            'permissions.admin' => 'boolean',
            'commissionEnabled' => 'boolean',
            'defaultCommission' => 'nullable|numeric|min:0|max:100',
        ]);

        DB::beginTransaction();
        try {
            // TODO: Update template in database when RoleTemplate model is ready
            // $template = RoleTemplate::findOrFail($id);
            // $template->update($validated);

            DB::commit();
            return redirect()->route('admin.role-templates.index')->with('success', 'Role template updated successfully');
        } catch (\Throwable $th) {
            DB::rollBack();
            return back()->withErrors(['error' => 'Failed to update role template'])->withInput();
        }
    }

    public function destroy($id)
    {
        try {
            // TODO: Delete template from database when RoleTemplate model is ready
            // $template = RoleTemplate::findOrFail($id);
            // if ($template->isDefault) {
            //     return back()->withErrors(['error' => 'Cannot delete default templates']);
            // }
            // $template->delete();

            return redirect()->route('admin.role-templates.index')->with('success', 'Role template deleted successfully');
        } catch (\Throwable $th) {
            return back()->withErrors(['error' => 'Failed to delete role template']);
        }
    }
}

