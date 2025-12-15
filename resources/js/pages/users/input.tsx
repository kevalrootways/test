import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { DollarSign, Eye, EyeOff, Lock, Shield, Store } from 'lucide-react';
import { useState } from 'react';

interface Permission {
    id: string;
    name: string;
    guard_name?: string;
}

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
    roles?: Array<string | { uuid?: string; name: string }>;
    permissions?: Permission[];
    availableAccounts?: Array<{ id: string; name: string; type: string }>;
    onRoleChange?: (role: string) => void;
}

const UserInput = ({
    errors,
    data,
    roles = [],
    permissions: availablePermissions = [],
    availableAccounts = [],
    onRoleChange,
}: UserInputProps) => {
    const rolesArray = Array.isArray(roles) ? roles : roles?.data || [];

    const [showPassword, setShowPassword] = useState(false);
    const [selectedRole, setSelectedRole] = useState(data?.role || 'Sales');
    const [commissionEnabled, setCommissionEnabled] = useState(
        data?.commissionEnabled || false,
    );
    const normalizedAvailablePermissions = Array.isArray(availablePermissions)
        ? availablePermissions
        : (availablePermissions as any)?.data || [];
    const initializePermissions = () => {
        const initialPermissions: Record<string, boolean> = {};
        if (normalizedAvailablePermissions.length > 0) {
            normalizedAvailablePermissions.forEach((perm: Permission) => {
                const permName = perm.name || perm;
                initialPermissions[permName] =
                    data?.permissions?.includes(permName) || false;
            });
        }
        return initialPermissions;
    };

    const [permissions, setPermissions] = useState(initializePermissions());
    const handleRoleChange = (role: string) => {
        setSelectedRole(role);
        if (onRoleChange) {
            onRoleChange(role);
        }
        const roleObj = rolesArray.find((r) => {
            const roleName = typeof r === 'string' ? r : r.name;
            return roleName === role;
        });
        const defaultPermissions: Record<string, boolean> = {};
        if (normalizedAvailablePermissions.length > 0) {
            normalizedAvailablePermissions.forEach((perm: Permission) => {
                const permName = perm.name || perm;
                defaultPermissions[permName] = false;
            });
            if (
                roleObj &&
                typeof roleObj !== 'string' &&
                (roleObj as any).permissions
            ) {
                const rolePermissions = (roleObj as any).permissions.map(
                    (p: any) => p.name || p,
                );
                normalizedAvailablePermissions.forEach((perm: Permission) => {
                    const permName = perm.name || perm;
                    defaultPermissions[permName] =
                        rolePermissions.includes(permName);
                });
            }
        }

        setPermissions(defaultPermissions);
    };

    const handlePermissionChange = (permission: string) => {
        setPermissions({
            ...permissions,
            [permission]: !(permissions[permission] || false),
        });
    };
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
    const getPermissionDisplayName = (permissionName: string): string => {
        return permissionName
            .split('_')
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
    };

    return (
        <div className="space-y-6">
            {/* Basic Information */}
            <div className="mb-6">
                <h3 className="mb-4 flex items-center gap-2 text-gray-900">
                    <Lock className="h-4 w-4" />
                    Basic Information
                </h3>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div className="custom-form-field md:col-span-2">
                        <Label className="mb-2 block text-gray-700">
                            Full Name <span className="text-red-500">*</span>
                        </Label>
                        <Input
                            type="text"
                            name="name"
                            defaultValue={data?.name ?? ''}
                            required
                            placeholder="Enter user full name"
                        />
                        <InputError message={errors.name} />
                    </div>

                    <div className="custom-form-field">
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
                        />
                        <InputError message={errors.email} />
                    </div>

                    <div className="custom-form-field">
                        <Label className="mb-2 block text-gray-700">
                            Phone Number <span className="text-red-500">*</span>
                        </Label>
                        <Input
                            type="tel"
                            name="phone"
                            defaultValue={data?.phone ?? ''}
                            required
                            placeholder="(555) 123-4567"
                        />
                        <InputError message={errors.phone} />
                    </div>

                    <div className="custom-form-field">
                        <Label className="mb-2 block text-gray-700">
                            Password {!data?.id && !data?.uuid && <span className="text-red-500">*</span>}
                        </Label>
                        <div className="relative">
                            <Input
                                type={showPassword ? 'text' : 'password'}
                                name="password"
                                defaultValue={data?.password ?? ''}
                                required={!data?.id && !data?.uuid}
                                placeholder={data?.id || data?.uuid ? "Leave blank to keep current password" : "Enter password"}
                            />
                            <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute top-1/2 right-3 h-8 w-8 -translate-y-1/2 transform text-gray-400 hover:text-gray-600"
                            >
                                {showPassword ? (
                                    <EyeOff className="h-5 w-5" />
                                ) : (
                                    <Eye className="h-5 w-5" />
                                )}
                            </Button>
                        </div>
                        {data?.id || data?.uuid ? (
                            <p className="mt-2 text-sm text-gray-500">
                                Leave blank to keep the current password
                            </p>
                        ) : null}
                        <InputError message={errors.password} />
                    </div>

                    <div className="custom-form-field">
                        <Label className="mb-2 block text-gray-700">
                            Status
                        </Label>
                        <select
                            name="status"
                            defaultValue={data?.status ?? 'Active'}
                            className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
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
            <div className="mb-6">
                <h3 className="mb-4 flex items-center gap-2 text-gray-900">
                    <Shield className="h-4 w-4" />
                    Role & Permissions
                </h3>
                <div className="mb-4">
                    <Label className="mb-2 block text-gray-700">
                        User Role <span className="text-red-500">*</span>
                    </Label>
                    <select
                        name="role"
                        value={selectedRole}
                        onChange={(e) => handleRoleChange(e.target.value)}
                        className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    >
                        {rolesArray.map((role) => {
                            const roleName =
                                typeof role === 'string' ? role : role.name;
                            const roleValue =
                                typeof role === 'string' ? role : role.name;
                            return (
                                <option key={roleValue} value={roleValue}>
                                    {roleName}
                                </option>
                            );
                        })}
                    </select>
                    <p className="mt-2 text-sm text-gray-500">
                        Selecting a role will automatically set default
                        permissions. You can customize them below.
                    </p>
                    <InputError message={errors.role} />
                </div>

                {/* Permissions Checkboxes */}
                <div className="rounded-lg bg-gray-50 p-4">
                    <p className="mb-3 text-sm text-gray-700">
                        Module Access Permissions:
                    </p>
                    {normalizedAvailablePermissions.length > 0 ? (
                        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                            {normalizedAvailablePermissions.map(
                                (perm: Permission) => {
                                    const permName = perm.name || perm;
                                    const permId = (perm as any).id || permName;
                                    const isChecked =
                                        permissions[permName] || false;
                                    return (
                                        <Label
                                            key={permId}
                                            className="flex cursor-pointer items-center gap-2"
                                        >
                                            <input
                                                type="checkbox"
                                                checked={isChecked}
                                                onChange={() =>
                                                    handlePermissionChange(
                                                        permName,
                                                    )
                                                }
                                                className="h-4 w-4 rounded text-blue-600"
                                            />
                                            <span className="text-sm text-gray-700">
                                                {getPermissionDisplayName(
                                                    permName,
                                                )}
                                            </span>
                                        </Label>
                                    );
                                },
                            )}
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                            {Object.entries(permissions).map(([key, value]) => (
                                <Label
                                    key={key}
                                    className="flex cursor-pointer items-center gap-2"
                                >
                                    <input
                                        type="checkbox"
                                        checked={value}
                                        onChange={() =>
                                            handlePermissionChange(key)
                                        }
                                        className="h-4 w-4 rounded text-blue-600"
                                    />
                                    <span className="text-sm text-gray-700">
                                        {getPermissionDisplayName(key)}
                                    </span>
                                </Label>
                            ))}
                        </div>
                    )}
                    {permissionInputs}
                </div>
            </div>

            {/* Commission Settings */}
            <div className="rounded-lg border border-green-200 bg-green-50 p-4">
                <h3 className="mb-4 flex items-center gap-2 text-gray-900">
                    <DollarSign className="h-4 w-4" />
                    Commission Settings
                </h3>
                <div className="space-y-4">
                    <input type="hidden" name="commissionEnabled" value="0" />
                    <Label className="flex cursor-pointer items-center gap-2">
                        <input
                            type="checkbox"
                            name="commissionEnabled"
                            value="1"
                            checked={commissionEnabled}
                            onChange={(e) =>
                                setCommissionEnabled(e.target.checked)
                            }
                            className="h-4 w-4 rounded text-blue-600"
                        />
                        <span className="text-gray-700">
                            Enable commissions for this user
                        </span>
                    </Label>

                    {commissionEnabled && (
                        <div className="custom-form-field">
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
                                placeholder="e.g., 5.0"
                            />
                            <p className="mt-2 text-sm text-gray-600">
                                This user will earn this percentage of sales
                                from their assigned accounts
                            </p>
                            <InputError message={errors.commissionRate} />
                        </div>
                    )}
                </div>
            </div>

            {/* Store Assignment - Only show for Store User role */}
            {selectedRole === 'Store User' && (
                <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
                    <h3 className="mb-4 flex items-center gap-2 text-gray-900">
                        <Store className="h-4 w-4" />
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
                            className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        >
                            <option value="">Select Store/Account</option>
                            {availableAccounts.map((account) => (
                                <option key={account.id} value={account.id}>
                                    {account.id} - {account.name} (
                                    {account.type})
                                </option>
                            ))}
                        </select>
                        <p className="mt-2 text-sm text-gray-600">
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
