<?php

namespace Database\Seeders;

use App\Models\Role;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;
use Spatie\Permission\Models\Permission;

class RoleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Define the default roles with their permissions and commission settings
        $roles = [
            [
                'name' => 'Super Admin',
                'description' => 'Full system access. No commission.',
                'template_permissions' => ['dashboard', 'products', 'inventory', 'orders', 'accounts', 'warranty', 'reports', 'admin'],
                'commission_enabled' => false,
                'default_commission' => 0.00,
                'is_default' => true,
            ],
            [
                'name' => 'Manager',
                'description' => 'Full access except admin panel. Commission enabled.',
                'template_permissions' => ['dashboard', 'products', 'inventory', 'orders', 'accounts', 'warranty', 'reports'],
                'commission_enabled' => true,
                'default_commission' => 2.00,
                'is_default' => true,
            ],

            [
                'name' => 'Sales',
                'description' => 'Full access to sales, accounts, and orders. Commission enabled.',
                'template_permissions' => ['dashboard', 'products', 'orders', 'accounts'],
                'commission_enabled' => true,
                'default_commission' => 5.00,
                'is_default' => true,
            ],
            [
                'name' => 'Inventory Manager',
                'description' => 'inventory , products , and orders management. Commission enabled.',
                'template_permissions' => ['dashboard', 'products', 'inventory', 'orders'],
                'commission_enabled' => true,
                'default_commission' => 3.00,
                'is_default' => true,
            ],
            [
                'name' => 'Support',
                'description' => 'Customer support and warranty management. No commission.',
                'template_permissions' => ['dashboard', 'accounts', 'warranty'],
                'commission_enabled' => false,
                'default_commission' => 0.00,
                'is_default' => true,
            ],
            [
                'name' => 'Analyst',
                'description' => 'Reports Management . No commission.',
                'template_permissions' => ['dashboard', 'reports'],
                'commission_enabled' => false,
                'default_commission' => 0.00,
                'is_default' => true,
            ],
            [
                'name' => 'Dealers',
                'description' => 'Reports Management . No commission.',
                'template_permissions' => ['dashboard', 'reports'],
                'commission_enabled' => false,
                'default_commission' => 0.00,
                'is_default' => true,
            ],
            [
                'name' => 'Insurance Industry',
                'description' => 'Reports Management . No commission.',
                'template_permissions' => ['dashboard', 'reports'],
                'commission_enabled' => false,
                'default_commission' => 0.00,
                'is_default' => true,
            ],
            [
                'name' => 'Distributors',
                'description' => 'Reports Management . No commission.',
                'template_permissions' => ['dashboard', 'reports'],
                'commission_enabled' => false,
                'default_commission' => 0.00,
                'is_default' => true,
            ],
            [
                'name' => 'Store User',
                'description' => 'Reports Management . No commission.',
                'template_permissions' => ['dashboard',],
                'commission_enabled' => false,
                'default_commission' => 0.00,
                'is_default' => true,
            ],

        ];

        foreach ($roles as $roleData) {
            $role = Role::firstOrCreate(
                ['name' => $roleData['name'], 'guard_name' => 'web'],
                [
                    'uuid' => (string) Str::uuid(),
                    'description' => $roleData['description'],
                    'template_permissions' => $roleData['template_permissions'],
                    'commission_enabled' => $roleData['commission_enabled'],
                    'default_commission' => $roleData['default_commission'],
                    'is_default' => $roleData['is_default'],
                ]
            );

            // Sync permissions for the role
            $permissions = [];
            foreach ($roleData['template_permissions'] as $permissionName) {
                $permission = Permission::where('name', $permissionName)
                    ->where('guard_name', 'web')
                    ->first();

                if ($permission) {
                    $permissions[] = $permission;
                }
            }

            $role->syncPermissions($permissions);
        }
    }
}
