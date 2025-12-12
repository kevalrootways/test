import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { DollarSign, Shield } from 'lucide-react';
import { useState } from 'react';

interface RoleTemplateInputProps {
    errors: Record<string, string>;
    data?: {
        name?: string;
        description?: string;
        permissions?: {
            dashboard?: boolean;
            products?: boolean;
            inventory?: boolean;
            orders?: boolean;
            accounts?: boolean;
            warranty?: boolean;
            reports?: boolean;
            admin?: boolean;
        };
        commissionEnabled?: boolean;
        defaultCommission?: number;
    };
}

const RoleTemplateInput = ({ errors, data }: RoleTemplateInputProps) => {
    const [permissions, setPermissions] = useState({
        dashboard: data?.permissions?.dashboard || true,
        products: data?.permissions?.products || false,
        inventory: data?.permissions?.inventory || false,
        orders: data?.permissions?.orders || false,
        accounts: data?.permissions?.accounts || false,
        warranty: data?.permissions?.warranty || false,
        reports: data?.permissions?.reports || false,
        admin: data?.permissions?.admin || false,
    });

    const [commissionEnabled, setCommissionEnabled] = useState(
        data?.commissionEnabled || false,
    );

    const handlePermissionChange = (permission: string) => {
        setPermissions({
            ...permissions,
            [permission]: !permissions[permission as keyof typeof permissions],
        });
    };

    // Store permissions in hidden inputs
    const permissionInputs = Object.entries(permissions).map(([key, value]) => (
        <input
            key={key}
            type="hidden"
            name={`permissions[${key}]`}
            value={value ? '1' : '0'}
        />
    ));

    return (
        <div className="space-y-6">
            {/* Basic Information */}
            <div>
                <h3 className="text-gray-900 mb-4">Basic Information</h3>
                <div className="space-y-4">
                    <div>
                        <Label className="mb-2 block text-gray-700">
                            Template Name{' '}
                            <span className="text-red-500">*</span>
                        </Label>
                        <Input
                            type="text"
                            name="name"
                            defaultValue={data?.name ?? ''}
                            required
                            placeholder="e.g., Sales Representative"
                            className="w-full"
                        />
                        <InputError message={errors.name} />
                    </div>

                    <div>
                        <Label className="mb-2 block text-gray-700">
                            Description{' '}
                            <span className="text-red-500">*</span>
                        </Label>
                        <textarea
                            name="description"
                            defaultValue={data?.description ?? ''}
                            required
                            rows={3}
                            className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Describe the purpose and responsibilities of this role"
                        />
                        <InputError message={errors.description} />
                    </div>
                </div>
            </div>

            {/* Permissions */}
            <div>
                <h3 className="text-gray-900 mb-4 flex items-center gap-2">
                    <Shield className="w-4 h-4" />
                    Module Permissions
                </h3>
                <div className="bg-gray-50 rounded-lg p-4">
                    <div className="grid grid-cols-2 gap-3">
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
            <div>
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
                            Enable commissions for this role
                        </span>
                    </Label>

                    {commissionEnabled && (
                        <div>
                            <Label className="mb-2 block text-gray-700">
                                Default Commission Rate (%)
                            </Label>
                            <Input
                                type="number"
                                name="defaultCommission"
                                defaultValue={data?.defaultCommission ?? 0}
                                min="0"
                                max="100"
                                step="0.1"
                                className="w-full"
                                placeholder="e.g., 5"
                            />
                            <p className="text-sm text-gray-500 mt-1">
                                Users with this template will default to this
                                commission rate (can be customized per user)
                            </p>
                            <InputError message={errors.defaultCommission} />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default RoleTemplateInput;

