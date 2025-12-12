import { Button } from '@/components/ui/button';
import {
    Clock,
    Package,
    Store,
    User,
    Users,
    X,
} from 'lucide-react';
import { useState } from 'react';
import ManageTeamAssignment from '../team-assignment/manage';

interface Account {
    id: string;
    uuid?: string;
    name: string;
    email: string;
    phone: string;
    type: string;
    status: string;
    city: string;
    provinceState: string;
    country: string;
    salesRep: string;
    customerGroup: string;
    warrantyText?: string;
    warranty?: string;
    allowValidationAPI?: boolean;
    validationAPIKey?: string;
    storeLogo?: string;
    storeProducts?: Array<{ productId: string; yearsOfService: number }>;
    totalPurchases?: number;
    totalSpent?: number;
    lastPurchase?: string;
}

interface ManageAccountDetailsProps {
    account: Account;
    onClose: () => void;
    onEdit?: () => void;
}

const ManageAccountDetails = ({
    account,
    onClose,
    onEdit,
}: ManageAccountDetailsProps) => {
    const [showTeamAssignment, setShowTeamAssignment] = useState(false);

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Active':
                return 'bg-green-100 text-green-700';
            case 'VIP':
                return 'bg-purple-100 text-purple-700';
            case 'Inactive':
                return 'bg-gray-100 text-gray-700';
            default:
                return 'bg-gray-100 text-gray-700';
        }
    };

    const mockProducts = [
        { id: 'SKU-001', name: 'KYCS Locate XT', basePrice: 349.0, sku: 'SKU-001' },
        { id: 'SKU-002', name: '2024 Toyota RAV4 XLE', basePrice: 32900, sku: 'SKU-002' },
        { id: 'SKU-003', name: '2024 Ford F-150 Lariat', basePrice: 45200, sku: 'SKU-003' },
        { id: 'SKU-004', name: '2024 Honda CR-V EX-L', basePrice: 34200, sku: 'SKU-004' },
        { id: 'SKU-005', name: '2024 BMW X5 xDrive40i', basePrice: 58900, sku: 'SKU-005' },
    ];

    return (
        <>
            <div
                className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
                onClick={onClose}
            >
                <div
                    className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Header */}
                    <div className="flex items-center justify-between p-6 border-b border-gray-200">
                        <h2 className="text-gray-900">
                            Account Details - {account.id}
                        </h2>
                        <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={onClose}
                            className="h-9 w-9"
                        >
                            <X className="w-5 h-5 text-gray-600" />
                        </Button>
                    </div>

                    {/* Content */}
                    <div className="p-6">
                        {/* Summary Stats */}
                        <div className="grid grid-cols-3 gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
                            <div>
                                <p className="text-gray-600 text-sm mb-1">
                                    Total Purchases
                                </p>
                                <p className="text-gray-900">
                                    {account.totalPurchases || 0}
                                </p>
                            </div>
                            <div>
                                <p className="text-gray-600 text-sm mb-1">
                                    Total Spent
                                </p>
                                <p className="text-gray-900">
                                    ${(account.totalSpent || 0).toLocaleString()}
                                </p>
                            </div>
                            <div>
                                <p className="text-gray-600 text-sm mb-1">
                                    Last Purchase
                                </p>
                                <p className="text-gray-900">
                                    {account.lastPurchase || '-'}
                                </p>
                            </div>
                        </div>

                        {/* Store Information Section */}
                        <div className="mb-6">
                            <h3 className="text-gray-900 mb-4 flex items-center gap-2">
                                <Store className="w-4 h-4" />
                                Store Information
                            </h3>
                            <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg p-6 border-2 border-blue-200">
                                <div className="flex items-start gap-4 mb-4">
                                    {account.storeLogo ? (
                                        <div className="relative">
                                            <img
                                                src={account.storeLogo}
                                                alt={`${account.name} store logo`}
                                                className="w-24 h-24 rounded-lg object-cover border-2 border-white shadow-lg"
                                            />
                                            <div className="absolute -top-2 -right-2 bg-blue-600 rounded-full p-2 shadow-lg">
                                                <Store className="w-4 h-4 text-white" />
                                            </div>
                                        </div>
                                    ) : (
                                        <Store className="w-24 h-24 text-gray-400" />
                                    )}
                                    <div className="flex-1">
                                        <h4 className="text-gray-900 mb-2">
                                            {account.name}
                                        </h4>
                                        <p className="text-sm text-gray-600 mb-3">
                                            Custom Store Portal
                                        </p>
                                        <Button
                                            type="button"
                                            className="flex items-center gap-2 bg-blue-600 text-white hover:bg-blue-700"
                                        >
                                            <Store className="w-4 h-4" />
                                            Preview Store
                                        </Button>
                                    </div>
                                </div>

                                {account.storeProducts &&
                                account.storeProducts.length > 0 ? (
                                    <div>
                                        <h5 className="text-gray-900 mb-3 flex items-center gap-2">
                                            <Package className="w-4 h-4" />
                                            Store Products (
                                            {account.storeProducts.length})
                                        </h5>
                                        <div className="space-y-2">
                                            {account.storeProducts.map(
                                                (item, index) => {
                                                    const product =
                                                        mockProducts.find(
                                                            (p) =>
                                                                p.id ===
                                                                item.productId,
                                                        );
                                                    return product ? (
                                                        <div
                                                            key={index}
                                                            className="bg-white rounded-lg p-3 border border-blue-200 flex items-center justify-between"
                                                        >
                                                            <div className="flex items-center gap-3">
                                                                <Package className="w-10 h-10 text-gray-600" />
                                                                <div>
                                                                    <p className="text-gray-900 text-sm">
                                                                        {
                                                                            product.name
                                                                        }
                                                                    </p>
                                                                    <p className="text-xs text-gray-600">
                                                                        {
                                                                            product.sku
                                                                        }
                                                                    </p>
                                                                </div>
                                                            </div>
                                                            <div className="flex items-center gap-4">
                                                                <div className="text-right">
                                                                    <p className="text-gray-900">
                                                                        $
                                                                        {product.basePrice.toLocaleString()}
                                                                    </p>
                                                                </div>
                                                                <div className="flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 rounded-full">
                                                                    <Clock className="w-3 h-3" />
                                                                    <span className="text-xs">
                                                                        {
                                                                            item.yearsOfService
                                                                        }{' '}
                                                                        {item.yearsOfService ===
                                                                        1
                                                                            ? 'Year'
                                                                            : 'Years'}
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ) : null;
                                                },
                                            )}
                                        </div>
                                    </div>
                                ) : (
                                    <div className="bg-white rounded-lg p-4 border border-blue-200 text-center">
                                        <Package className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                                        <p className="text-gray-600 text-sm mb-2">
                                            No products assigned to this store
                                            yet
                                        </p>
                                        <button
                                            onClick={() => {
                                                onClose();
                                                if (onEdit) onEdit();
                                            }}
                                            className="text-blue-600 hover:text-blue-700 text-sm hover:underline"
                                        >
                                            Add Products
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Basic Information Section */}
                        <div className="mb-6">
                            <h3 className="text-gray-900 mb-4 flex items-center gap-2">
                                <User className="w-4 h-4" />
                                Basic Information
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="md:col-span-2">
                                    <label className="block text-gray-600 text-sm mb-1">
                                        Account ID
                                    </label>
                                    <p className="text-gray-900">{account.id}</p>
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-gray-600 text-sm mb-1">
                                        Account/Business Name
                                    </label>
                                    <p className="text-gray-900">
                                        {account.name}
                                    </p>
                                </div>
                                <div>
                                    <label className="block text-gray-600 text-sm mb-1">
                                        Email Address
                                    </label>
                                    <p className="text-gray-900">
                                        {account.email}
                                    </p>
                                </div>
                                <div>
                                    <label className="block text-gray-600 text-sm mb-1">
                                        Phone Number
                                    </label>
                                    <p className="text-gray-900">
                                        {account.phone}
                                    </p>
                                </div>
                                <div>
                                    <label className="block text-gray-600 text-sm mb-1">
                                        Account Type
                                    </label>
                                    <p className="text-gray-900">
                                        {account.type}
                                    </p>
                                </div>
                                <div>
                                    <label className="block text-gray-600 text-sm mb-1">
                                        Status
                                    </label>
                                    <span
                                        className={`inline-flex px-2 py-1 rounded-full text-xs ${getStatusColor(
                                            account.status,
                                        )}`}
                                    >
                                        {account.status}
                                    </span>
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-gray-600 text-sm mb-1">
                                        Location
                                    </label>
                                    <p className="text-gray-900">
                                        {account.city}, {account.provinceState},{' '}
                                        {account.country}
                                    </p>
                                </div>
                                <div>
                                    <label className="block text-gray-600 text-sm mb-1">
                                        Sales Representative
                                    </label>
                                    <p className="text-gray-900">
                                        {account.salesRep}
                                    </p>
                                </div>
                                <div>
                                    <label className="block text-gray-600 text-sm mb-1">
                                        Customer Group
                                    </label>
                                    <p className="text-gray-900">
                                        {account.customerGroup}
                                    </p>
                                </div>
                                <div>
                                    <label className="block text-gray-600 text-sm mb-1">
                                        Warranty
                                    </label>
                                    <p className="text-gray-900">
                                        {account.warrantyText || account.warranty || '-'}
                                    </p>
                                </div>
                                <div>
                                    <label className="block text-gray-600 text-sm mb-1">
                                        Validation API
                                    </label>
                                    {account.allowValidationAPI ? (
                                        <div className="flex flex-col gap-1">
                                            <span className="inline-flex px-2 py-1 rounded-full text-xs bg-green-100 text-green-700 w-fit">
                                                Enabled
                                            </span>
                                            {account.validationAPIKey && (
                                                <span className="text-sm text-gray-900 font-mono">
                                                    Key:{' '}
                                                    {account.validationAPIKey}
                                                </span>
                                            )}
                                        </div>
                                    ) : (
                                        <span className="inline-flex px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-700 w-fit">
                                            Disabled
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Sales Team Assignment */}
                        <div className="mb-6">
                            <div className="rounded-lg border border-gray-200 bg-white p-6">
                                <div className="mb-4 flex items-center justify-between">
                                    <div>
                                        <h3 className="flex items-center gap-2 text-gray-900">
                                            <Users className="h-5 w-5" />
                                            Sales Team Assignment
                                        </h3>
                                        <p className="mt-1 text-sm text-gray-600">
                                            Assign users to this account and set
                                            commission splits
                                        </p>
                                    </div>
                                    <Button
                                        type="button"
                                        onClick={() => setShowTeamAssignment(true)}
                                        className="bg-blue-600 text-white hover:bg-blue-700"
                                    >
                                        <Users className="mr-2 h-4 w-4" />
                                        Manage Team
                                    </Button>
                                </div>
                                <div className="rounded-lg bg-gray-50 py-12 text-center">
                                    <Users className="mx-auto mb-3 h-12 w-12 text-gray-400" />
                                    <p className="text-gray-600">
                                        No team members assigned
                                    </p>
                                    <p className="mt-1 text-sm text-gray-500">
                                        Click "Manage Team" to assign users to
                                        this account
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={onClose}
                            >
                                Close
                            </Button>
                            <Button
                                type="button"
                                onClick={() => {
                                    onClose();
                                    if (onEdit) onEdit();
                                }}
                                className="bg-blue-600 text-white hover:bg-blue-700"
                            >
                                Edit Account
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Team Assignment Modal */}
            {showTeamAssignment && (
                <ManageTeamAssignment
                    accountId={account.id}
                    accountName={account.name}
                    onClose={() => setShowTeamAssignment(false)}
                />
            )}
        </>
    );
};

export default ManageAccountDetails;

