<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $superAdminRole = Role::where('name', 'Super Admin')
            ->where('guard_name', 'web')
            ->first();
        $allPermissions = Permission::where('guard_name', 'web')->get();
        $existingUser = User::where('email', 'peter@rootways.com')->first();
        if ($existingUser) {
            $this->command->info('Super Admin user already exists. Skipping creation.');
            return;
        }

        $user = User::create([
            'uuid' => (string) Str::uuid(),
            'user_id' => 'USR-' . strtoupper(Str::random(8)),
            'name' => 'Super Admin',
            'email' => 'peter@rootways.com',
            'password' => Hash::make('T236aD43V6V9yya@'),
            'email_verified_at' => now(),
            'phone' => '1234567890',
            'status' => 'Active',
            'assigned_store' => null,
            'commission_enabled' => false,
            'commission_rate' => 0,
        ]);

        $user->assignRole($superAdminRole);
        $user->syncPermissions($allPermissions);
    }
}
