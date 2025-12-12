import InputError from '@/components/input-error';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Shield } from 'lucide-react';
import { useEffect, useState } from 'react';

interface RoleTemplateInputProps {
    errors?: Record<string, string>;
    data?: {
        name?: string;
        description?: string;
        permissions?: Record<string, boolean>;
        commissionEnabled?: boolean;
        defaultCommission?: number;
    };
    availablePermissions?: string[];
}

const RoleTemplateInput = ({
    errors = {},
    data,
    availablePermissions = [],
}: RoleTemplateInputProps) => {
    const [commissionEnabled, setCommissionEnabled] = useState(
        data?.commissionEnabled || false,
    );

    useEffect(() => {
        setCommissionEnabled(data?.commissionEnabled || false);
    }, [data?.commissionEnabled]);

    return (
        <div className="space-y-6">
            {/* Basic Information */}
            <div>
                <h3 className="mb-4 text-gray-900">Basic Information</h3>
                <div className="space-y-4">
                    <div className="custom-form-field">
                        <Label
                            htmlFor="name"
                            className="mb-2 block text-gray-700"
                        >
                            Template Name{' '}
                            <span className="text-red-500">*</span>
                        </Label>
                        <Input
                            type="text"
                            id="name"
                            name="name"
                            defaultValue={data?.name || ''}
                            placeholder="e.g., Sales Representative"
                            className="w-full"
                        />
                        <InputError message={errors.name} />
                    </div>

                    <div className="custom-form-field">
                        <Label
                            htmlFor="description"
                            className="mb-2 block text-gray-700"
                        >
                            Description <span className="text-red-500">*</span>
                        </Label>
                        <textarea
                            id="description"
                            name="description"
                            defaultValue={data?.description || ''}
                            rows={3}
                            className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            placeholder="Describe the purpose and responsibilities of this role"
                        />
                        <InputError message={errors.description} />
                    </div>
                </div>
            </div>

            {/* Permissions */}
            <div>
                <h3 className="mb-4 flex items-center gap-2 text-gray-900">
                    <Shield className="h-4 w-4" />
                    Module Permissions
                </h3>
                <div className="rounded-lg bg-gray-50 p-4">
                    <div className="grid grid-cols-2 gap-3">
                        {availablePermissions.length > 0
                            ? availablePermissions.map((permission) => {
                                  const isChecked =
                                      data?.permissions?.[permission] || false;
                                  return (
                                      <div key={permission}>
                                          <input
                                              type="hidden"
                                              name={`permissions[${permission}]`}
                                              value="0"
                                          />
                                          <Label
                                              htmlFor={`permission-${permission}`}
                                              className="flex cursor-pointer items-center gap-2"
                                          >
                                              <input
                                                  type="checkbox"
                                                  id={`permission-${permission}`}
                                                  name={`permissions[${permission}]`}
                                                  defaultChecked={isChecked}
                                                  value="1"
                                                  className="h-4 w-4 rounded text-blue-600"
                                              />
                                              <span className="text-sm text-gray-700">
                                                  {permission
                                                      .charAt(0)
                                                      .toUpperCase() +
                                                      permission
                                                          .slice(1)
                                                          .replace(
                                                              /([A-Z])/g,
                                                              ' $1',
                                                          )}
                                              </span>
                                          </Label>
                                      </div>
                                  );
                              })
                            : // Fallback: use permissions from data if availablePermissions is empty
                              Object.entries(data?.permissions || {}).map(
                                  ([key, value]) => (
                                      <div key={key}>
                                          <input
                                              type="hidden"
                                              name={`permissions[${key}]`}
                                              value="0"
                                          />
                                          <Label
                                              htmlFor={`permission-${key}`}
                                              className="flex cursor-pointer items-center gap-2"
                                          >
                                              <input
                                                  type="checkbox"
                                                  id={`permission-${key}`}
                                                  name={`permissions[${key}]`}
                                                  defaultChecked={
                                                      value || false
                                                  }
                                                  value="1"
                                                  className="h-4 w-4 rounded text-blue-600"
                                              />
                                              <span className="text-sm text-gray-700">
                                                  {key.charAt(0).toUpperCase() +
                                                      key
                                                          .slice(1)
                                                          .replace(
                                                              /([A-Z])/g,
                                                              ' $1',
                                                          )}
                                              </span>
                                          </Label>
                                      </div>
                                  ),
                              )}
                    </div>
                    <InputError message={errors.permissions} />
                </div>
            </div>

            {/* Commission Settings */}
            <div>
                <h3 className="mb-4 text-gray-900">Commission Settings</h3>
                <div className="space-y-4">
                    <Label
                        htmlFor="commissionEnabled"
                        className="flex cursor-pointer items-center gap-2"
                    >
                        <input
                            type="checkbox"
                            id="commissionEnabled"
                            name="commissionEnabled"
                            defaultChecked={data?.commissionEnabled || false}
                            value="1"
                            onChange={(e) =>
                                setCommissionEnabled(e.target.checked)
                            }
                            className="h-4 w-4 rounded text-blue-600"
                        />
                        <span className="text-gray-700">
                            Enable commissions for this role
                        </span>
                    </Label>

                    {commissionEnabled && (
                        <div className="custom-form-field">
                            <Label
                                htmlFor="defaultCommission"
                                className="mb-2 block text-gray-700"
                            >
                                Default Commission Rate (%)
                            </Label>
                            <Input
                                type="number"
                                id="defaultCommission"
                                name="defaultCommission"
                                defaultValue={data?.defaultCommission || 0}
                                min="0"
                                max="100"
                                step="0.1"
                                className="w-full"
                                placeholder="e.g., 5"
                            />
                            <p className="mt-1 text-sm text-gray-500">
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
