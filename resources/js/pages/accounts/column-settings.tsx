import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { X } from 'lucide-react';

interface ColumnSettingsProps {
    userRole: 'admin' | 'sales' | 'manager';
    visibleColumns: {
        accountId: boolean;
        name: boolean;
        contactName: boolean;
        email: boolean;
        phone: boolean;
        location: boolean;
        type: boolean;
        salesRep: boolean;
        customerGroup: boolean;
        warranty: boolean;
        purchases: boolean;
        totalSpent: boolean;
        lastPurchase: boolean;
        inventoryCount: boolean;
        validationAPI: boolean;
        status: boolean;
    };
    onClose: () => void;
    onToggleColumn: (column: string) => void;
    onReset: () => void;
}

const ColumnSettings = ({
    userRole,
    visibleColumns,
    onClose,
    onToggleColumn,
    onReset,
}: ColumnSettingsProps) => {
    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
            onClick={onClose}
        >
            <div
                className="w-full max-w-lg rounded-lg bg-white shadow-xl"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex items-center justify-between border-b border-gray-200 p-6">
                    <div>
                        <h2 className="text-gray-900">Column Settings</h2>
                        <p className="mt-1 text-sm text-gray-600">
                            Customize which columns are visible in the table
                        </p>
                    </div>
                    <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={onClose}
                        className="h-9 w-9"
                    >
                        <X className="h-5 w-5 text-gray-600" />
                    </Button>
                </div>

                <div className="p-6">
                    {/* User Role Display */}
                    <div className="mb-4 rounded-lg bg-blue-50 p-3">
                        <p className="text-sm text-gray-700">
                            <span className="font-medium">Current Role:</span>{' '}
                            {userRole.charAt(0).toUpperCase() +
                                userRole.slice(1)}
                        </p>
                        <p className="mt-1 text-xs text-gray-600">
                            {userRole === 'admin'
                                ? 'Admins can customize all column settings'
                                : 'Default columns are set based on your role'}
                        </p>
                    </div>

                    {/* Column Toggles */}
                    <div className="max-h-96 space-y-3 overflow-y-auto">
                        <Label className="flex cursor-pointer items-center gap-3 rounded p-2 hover:bg-gray-50">
                            <input
                                type="checkbox"
                                checked={visibleColumns.accountId}
                                onChange={() => onToggleColumn('accountId')}
                                className="h-4 w-4 rounded text-blue-600"
                            />
                            <span className="text-gray-700">Account ID</span>
                        </Label>

                        <Label className="flex cursor-pointer items-center gap-3 rounded p-2 hover:bg-gray-50">
                            <input
                                type="checkbox"
                                checked={visibleColumns.name}
                                onChange={() => onToggleColumn('name')}
                                className="h-4 w-4 rounded text-blue-600"
                            />
                            <span className="text-gray-700">Name</span>
                        </Label>

                        <Label className="flex cursor-pointer items-center gap-3 rounded p-2 hover:bg-gray-50">
                            <input
                                type="checkbox"
                                checked={visibleColumns.contactName}
                                onChange={() => onToggleColumn('contactName')}
                                className="h-4 w-4 rounded text-blue-600"
                            />
                            <span className="text-gray-700">Contact Name</span>
                        </Label>

                        <Label className="flex cursor-pointer items-center gap-3 rounded p-2 hover:bg-gray-50">
                            <input
                                type="checkbox"
                                checked={visibleColumns.email}
                                onChange={() => onToggleColumn('email')}
                                className="h-4 w-4 rounded text-blue-600"
                            />
                            <span className="text-gray-700">Email</span>
                        </Label>

                        <Label className="flex cursor-pointer items-center gap-3 rounded p-2 hover:bg-gray-50">
                            <input
                                type="checkbox"
                                checked={visibleColumns.phone}
                                onChange={() => onToggleColumn('phone')}
                                className="h-4 w-4 rounded text-blue-600"
                            />
                            <span className="text-gray-700">Phone</span>
                        </Label>

                        <Label className="flex cursor-pointer items-center gap-3 rounded p-2 hover:bg-gray-50">
                            <input
                                type="checkbox"
                                checked={visibleColumns.location}
                                onChange={() => onToggleColumn('location')}
                                className="h-4 w-4 rounded text-blue-600"
                            />
                            <span className="text-gray-700">Location</span>
                        </Label>

                        <Label className="flex cursor-pointer items-center gap-3 rounded p-2 hover:bg-gray-50">
                            <input
                                type="checkbox"
                                checked={visibleColumns.type}
                                onChange={() => onToggleColumn('type')}
                                className="h-4 w-4 rounded text-blue-600"
                            />
                            <span className="text-gray-700">Account Type</span>
                        </Label>

                        <Label className="flex cursor-pointer items-center gap-3 rounded p-2 hover:bg-gray-50">
                            <input
                                type="checkbox"
                                checked={visibleColumns.salesRep}
                                onChange={() => onToggleColumn('salesRep')}
                                className="h-4 w-4 rounded text-blue-600"
                            />
                            <span className="text-gray-700">
                                Sales Representative
                            </span>
                        </Label>

                        <Label className="flex cursor-pointer items-center gap-3 rounded p-2 hover:bg-gray-50">
                            <input
                                type="checkbox"
                                checked={visibleColumns.customerGroup}
                                onChange={() =>
                                    onToggleColumn('customerGroup')
                                }
                                className="h-4 w-4 rounded text-blue-600"
                            />
                            <span className="text-gray-700">Customer Group</span>
                        </Label>

                        <Label className="flex cursor-pointer items-center gap-3 rounded p-2 hover:bg-gray-50">
                            <input
                                type="checkbox"
                                checked={visibleColumns.warranty}
                                onChange={() => onToggleColumn('warranty')}
                                className="h-4 w-4 rounded text-blue-600"
                            />
                            <span className="text-gray-700">Warranty</span>
                        </Label>

                        <Label className="flex cursor-pointer items-center gap-3 rounded p-2 hover:bg-gray-50">
                            <input
                                type="checkbox"
                                checked={visibleColumns.purchases}
                                onChange={() => onToggleColumn('purchases')}
                                className="h-4 w-4 rounded text-blue-600"
                            />
                            <span className="text-gray-700">Total Purchases</span>
                        </Label>

                        <Label className="flex cursor-pointer items-center gap-3 rounded p-2 hover:bg-gray-50">
                            <input
                                type="checkbox"
                                checked={visibleColumns.totalSpent}
                                onChange={() => onToggleColumn('totalSpent')}
                                className="h-4 w-4 rounded text-blue-600"
                            />
                            <span className="text-gray-700">Total Spent</span>
                        </Label>

                        <Label className="flex cursor-pointer items-center gap-3 rounded p-2 hover:bg-gray-50">
                            <input
                                type="checkbox"
                                checked={visibleColumns.lastPurchase}
                                onChange={() => onToggleColumn('lastPurchase')}
                                className="h-4 w-4 rounded text-blue-600"
                            />
                            <span className="text-gray-700">
                                Last Purchase Date
                            </span>
                        </Label>

                        <Label className="flex cursor-pointer items-center gap-3 rounded p-2 hover:bg-gray-50">
                            <input
                                type="checkbox"
                                checked={visibleColumns.inventoryCount}
                                onChange={() =>
                                    onToggleColumn('inventoryCount')
                                }
                                className="h-4 w-4 rounded text-blue-600"
                            />
                            <span className="text-gray-700">Inventory Count</span>
                        </Label>

                        <Label className="flex cursor-pointer items-center gap-3 rounded p-2 hover:bg-gray-50">
                            <input
                                type="checkbox"
                                checked={visibleColumns.validationAPI}
                                onChange={() => onToggleColumn('validationAPI')}
                                className="h-4 w-4 rounded text-blue-600"
                            />
                            <span className="text-gray-700">Validation API</span>
                        </Label>

                        <Label className="flex cursor-pointer items-center gap-3 rounded p-2 hover:bg-gray-50">
                            <input
                                type="checkbox"
                                checked={visibleColumns.status}
                                onChange={() => onToggleColumn('status')}
                                className="h-4 w-4 rounded text-blue-600"
                            />
                            <span className="text-gray-700">Status</span>
                        </Label>
                    </div>
                </div>

                <div className="flex items-center justify-between gap-3 border-t border-gray-200 p-6">
                    <Button
                        type="button"
                        variant="ghost"
                        onClick={onReset}
                        className="h-auto px-4 py-2 text-sm text-gray-600 hover:text-gray-800 hover:underline"
                    >
                        Reset to Role Default
                    </Button>
                    <div className="flex gap-3">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={onClose}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="button"
                            onClick={onClose}
                            className="bg-blue-600 text-white hover:bg-blue-700"
                        >
                            Apply
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ColumnSettings;

