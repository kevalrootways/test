import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { DollarSign, Eye, EyeOff, Lock, Shield, Store } from 'lucide-react';
import { useState } from 'react';

interface UserInputProps {
    errors: Record<string, string>;
    data?: {
        name?: string;
        email?: string;
        phone?: string;
        password?: string;
        role?: string;
        status?: string;
        assignedStore?: string;
        commissionEnabled?: boolean;
        commissionRate?: number;
        permissions?: string[];
    };
    roles?: string[];
    availableAccounts?: Array<{ id: string; name: string; type: string }>;
    onRoleChange?: (role: string) => void;
}

const UserInput = ({
    errors,
    data,
    roles = [],
    availableAccounts = [],
    onRoleChange,
}: UserInputProps) => {
    const [showPassword, setShowPassword] = useState(false);
    const [selectedRole, setSelectedRole] = useState(data?.role || 'Sales');
    const [commissionEnabled, setCommissionEnabled] = useState(
        data?.commissionEnabled || false,
    );
    const [permissions, setPermissions] = useState({
        dashboard: data?.permissions?.includes('Dashboard') || false,
        products: data?.permissions?.includes('Products') || false,
        inventory: data?.permissions?.includes('Inventory') || false,
        orders: data?.permissions?.includes('Orders') || false,
        accounts: data?.permissions?.includes('Accounts') || false,
        warranty: data?.permissions?.includes('Warranty') || false,
        reports: data?.permissions?.includes('Reports') || false,
        admin: data?.permissions?.includes('Admin') || false,
    });

    const handleRoleChange = (role: string) => {
        setSelectedRole(role);
        if (onRoleChange) {
            onRoleChange(role);
        }

        // Set default permissions based on role
        let defaultPermissions = {
            dashboard: true,
            products: false,
            inventory: false,
            orders: false,
            accounts: false,
            warranty: false,
            reports: false,
            admin: false,
        };

        switch (role) {
            case 'Super Admin':
                defaultPermissions = {
                    dashboard: true,
                    products: true,
                    inventory: true,
                    orders: true,
                    accounts: true,
                    warranty: true,
                    reports: true,
                    admin: true,
                };
                break;
            case 'Manager':
                defaultPermissions = {
                    dashboard: true,
                    products: true,
                    inventory: true,
                    orders: true,
                    accounts: true,
                    warranty: true,
                    reports: true,
                    admin: false,
                };
                break;
            case 'Sales':
                defaultPermissions = {
                    dashboard: true,
                    products: true,
                    inventory: false,
                    orders: true,
                    accounts: true,
                    warranty: false,
                    reports: false,
                    admin: false,
                };
                break;
            case 'Inventory Manager':
                defaultPermissions = {
                    dashboard: true,
                    products: true,
                    inventory: true,
                    orders: true,
                    accounts: false,
                    warranty: false,
                    reports: false,
                    admin: false,
                };
                break;
            case 'Support':
                defaultPermissions = {
                    dashboard: true,
                    products: false,
                    inventory: false,
                    orders: false,
                    accounts: true,
                    warranty: true,
                    reports: false,
                    admin: false,
                };
                break;
            case 'Analyst':
                defaultPermissions = {
                    dashboard: true,
                    products: false,
                    inventory: false,
                    orders: false,
                    accounts: false,
                    warranty: false,
                    reports: true,
                    admin: false,
                };
                break;
            case 'Store User':
                defaultPermissions = {
                    dashboard: false,
                    products: false,
                    inventory: false,
                    orders: false,
                    accounts: false,
                    warranty: false,
                    reports: false,
                    admin: false,
                };
                break;
        }

        setPermissions(defaultPermissions);
    };

    const handlePermissionChange = (permission: string) => {
        setPermissions({
            ...permissions,
            [permission]: !permissions[permission as keyof typeof permissions],
        });
    };

    // Store permissions in hidden inputs
    const permissionInputs = Object.entries(permissions)
        .filter(([_, value]) => value)
        .map(([key, _]) => (
            <input
                key={key}
                type="hidden"
                name={`permissions[${key}]`}
                value="1"
            />
        ));

    return (
        <div className="space-y-6">
            {/* Basic Information */}
            <div>
                <h3 className="text-gray-900 mb-4 flex items-center gap-2">
                    <Lock className="w-4 h-4" />
                    Basic Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                        <Label className="mb-2 block text-gray-700">
                            Full Name <span className="text-red-500">*</span>
                        </Label>
                        <Input
                            type="text"
                            name="name"
                            defaultValue={data?.name ?? ''}
                            required
                            placeholder="Enter user full name"
                            className="w-full"
                        />
                        <InputError message={errors.name} />
                    </div>

                    <div>
                        <Label className="mb-2 block text-gray-700">
                            Email Address{' '}
                            <span className="text-red-500">*</span>
                        </Label>
                        <Input
                            type="email"
                            name="email"
                            defaultValue={data?.email ?? ''}
                            required
                            placeholder="user@dealership.com"
                            className="w-full"
                        />
                        <InputError message={errors.email} />
                    </div>

                    <div>
                        <Label className="mb-2 block text-gray-700">
                            Phone Number{' '}
                            <span className="text-red-500">*</span>
                        </Label>
                        <Input
                            type="tel"
                            name="phone"
                            defaultValue={data?.phone ?? ''}
                            required
                            placeholder="(555) 123-4567"
                            className="w-full"
                        />
                        <InputError message={errors.phone} />
                    </div>

                    <div>
                        <Label className="mb-2 block text-gray-700">
                            Password{' '}
                            <span className="text-red-500">*</span>
                        </Label>
                        <div className="relative">
                            <Input
                                type={showPassword ? 'text' : 'password'}
                                name="password"
                                defaultValue={data?.password ?? ''}
                                required
                                placeholder="Enter password"
                                className="w-full"
                            />
                            <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 h-8 w-8 -translate-y-1/2 transform text-gray-400 hover:text-gray-600"
                            >
                                {showPassword ? (
                                    <EyeOff className="h-5 w-5" />
                                ) : (
                                    <Eye className="h-5 w-5" />
                                )}
                            </Button>
                        </div>
                        <InputError message={errors.password} />
                    </div>

                    <div>
                        <Label className="mb-2 block text-gray-700">
                            Status
                        </Label>
                        <select
                            name="status"
                            defaultValue={data?.status ?? 'Active'}
                            className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="Active">Active</option>
                            <option value="Inactive">Inactive</option>
                            <option value="Suspended">Suspended</option>
                        </select>
                        <InputError message={errors.status} />
                    </div>
                </div>
            </div>

            {/* Role & Permissions */}
            <div>
                <h3 className="text-gray-900 mb-4 flex items-center gap-2">
                    <Shield className="w-4 h-4" />
                    Role & Permissions
                </h3>
                <div className="mb-4">
                    <Label className="mb-2 block text-gray-700">
                        User Role <span className="text-red-500">*</span>
                    </Label>
                    <select
                        name="role"
                        value={selectedRole}
                        required
                        onChange={(e) => handleRoleChange(e.target.value)}
                        className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        {roles.map((role) => (
                            <option key={role} value={role}>
                                {role}
                            </option>
                        ))}
                    </select>
                    <p className="text-sm text-gray-500 mt-2">
                        Selecting a role will automatically set default
                        permissions. You can customize them below.
                    </p>
                    <InputError message={errors.role} />
                </div>

                {/* Permissions Checkboxes */}
                <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-sm text-gray-700 mb-3">
                        Module Access Permissions:
                    </p>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {Object.entries(permissions).map(([key, value]) => (
                            <Label
                                key={key}
                                className="flex items-center gap-2 cursor-pointer"
                            >
                                <input
                                    type="checkbox"
                                    checked={value}
                                    onChange={() => handlePermissionChange(key)}
                                    className="h-4 w-4 rounded text-blue-600"
                                />
                                <span className="text-sm text-gray-700">
                                    {key.charAt(0).toUpperCase() +
                                        key.slice(1).replace(/([A-Z])/g, ' $1')}
                                </span>
                            </Label>
                        ))}
                    </div>
                    {permissionInputs}
                </div>
            </div>

            {/* Commission Settings */}
            <div className="rounded-lg border border-green-200 bg-green-50 p-4">
                <h3 className="text-gray-900 mb-4 flex items-center gap-2">
                    <DollarSign className="w-4 h-4" />
                    Commission Settings
                </h3>
                <div className="space-y-4">
                    <Label className="flex items-center gap-2 cursor-pointer">
                        <input
                            type="checkbox"
                            name="commissionEnabled"
                            checked={commissionEnabled}
                            onChange={(e) => setCommissionEnabled(e.target.checked)}
                            className="h-4 w-4 rounded text-blue-600"
                        />
                        <span className="text-gray-700">
                            Enable commissions for this user
                        </span>
                    </Label>

                    {commissionEnabled && (
                        <div>
                            <Label className="mb-2 block text-gray-700">
                                Commission Rate (%)
                            </Label>
                            <Input
                                type="number"
                                name="commissionRate"
                                defaultValue={data?.commissionRate ?? 0}
                                min="0"
                                max="100"
                                step="0.1"
                                className="w-full"
                                placeholder="e.g., 5.0"
                            />
                            <p className="text-sm text-gray-600 mt-2">
                                This user will earn this percentage of sales from
                                their assigned accounts
                            </p>
                            <InputError message={errors.commissionRate} />
                        </div>
                    )}
                </div>
            </div>

            {/* Store Assignment - Only show for Store User role */}
            {selectedRole === 'Store User' && (
                <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
                    <h3 className="text-gray-900 mb-4 flex items-center gap-2">
                        <Store className="w-4 h-4" />
                        Store Assignment
                    </h3>
                    <div>
                        <Label className="mb-2 block text-gray-700">
                            Assigned Store/Account{' '}
                            <span className="text-red-500">*</span>
                        </Label>
                        <select
                            name="assignedStore"
                            defaultValue={data?.assignedStore ?? ''}
                            required={data?.role === 'Store User'}
                            className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="">Select Store/Account</option>
                            {availableAccounts.map((account) => (
                                <option key={account.id} value={account.id}>
                                    {account.id} - {account.name} ({account.type})
                                </option>
                            ))}
                        </select>
                        <p className="text-sm text-gray-600 mt-2">
                            This user will only have access to their assigned
                            store's products and cannot access the main staff
                            portal.
                        </p>
                        <InputError message={errors.assignedStore} />
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserInput;

