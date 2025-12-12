import { Button } from '@/components/ui/button';
import { usePermission } from '@/hooks/usePermission';
import AppLayout from '@/layouts/app-layout';
import { Form, Head, Link, router } from '@inertiajs/react';
import {
    Bell,
    Clock,
    Download,
    Edit,
    Eye,
    Filter,
    LoaderCircle,
    Mail,
    Package,
    Phone,
    Plus,
    Radio,
    RefreshCw,
    Search,
    Send,
    Settings,
    ShoppingCart,
    Store,
    Trash2,
    Users,
    X,
} from 'lucide-react';
import { useState } from 'react';
import AccountInput from './input';
import ColumnSettings from './column-settings';
import ManageUsers from './users/manage';
import CreateAccount from './create';
import DeviceIDSearch from './device-id-search';
import EditAccount from './edit';
import InventoryUpdater from './inventory-updater';
import SendForm from './send-form';
import ManageAccountDetails from './details/manage';

interface Account {
    id: string;
    uuid?: string;
    name: string;
    contactFirstName?: string;
    contactLastName?: string;
    email: string;
    phone: string;
    mobilePhone?: string;
    type: string;
    status: string;
    totalPurchases: number;
    totalSpent: number;
    lastPurchase: string;
    address1?: string;
    address2?: string;
    city: string;
    provinceState: string;
    postalCode?: string;
    country: string;
    salesRep: string;
    customerGroup: string;
    warrantyText?: string;
    warranty?: string;
    storeLogo?: string;
    storeProducts?: Array<{ productId: string; yearsOfService: number }>;
    inventoryCount?: number;
    lastInventoryUpdate?: string;
    allowValidationAPI?: boolean;
    validationAPIKey?: string;
    alertEmails?: string[];
}

interface ManageAccountsProps {
    accounts?: Account[];
    totalAccounts?: number;
    activeAccounts?: number;
    vipAccounts?: number;
    totalRevenue?: number;
    csrfToken?: string;
    accountTypes?: string[];
    countries?: string[];
    customerGroups?: string[];
    salesReps?: string[];
    warrantyOptions?: string[];
}

const ManageAccounts = ({
    accounts = [],
    totalAccounts = 13,
    activeAccounts = 12,
    vipAccounts = 3,
    totalRevenue = 1789250,
    csrfToken = '',
    accountTypes = [
        'Individual',
        'Business',
        'Corporate',
        'Government',
        'Partner',
    ],
    countries = [
        'Canada',
        'United States',
        'Mexico',
        'United Kingdom',
        'Other',
    ],
    customerGroups = ['BMW', 'Policaro', 'Ford', 'Toyota', 'General'],
    salesReps = [],
    warrantyOptions = [
        'Standard Warranty',
        'Extended Warranty',
        'Premium Warranty',
        'Limited Warranty',
        'No Warranty',
    ],
}: ManageAccountsProps) => {
    const { can } = usePermission();
    const [userRole, setUserRole] = useState<'admin' | 'sales' | 'manager'>(
        'admin',
    );
    const [searchTerm, setSearchTerm] = useState('');
    const [typeFilter, setTypeFilter] = useState('all');
    const [statusFilter, setStatusFilter] = useState('all');
    const [countryFilter, setCountryFilter] = useState('all');
    const [provinceStateFilter, setProvinceStateFilter] = useState('all');
    const [salesRepFilter, setSalesRepFilter] = useState('all');
    const [customerGroupFilter, setCustomerGroupFilter] = useState('all');
    const [warrantyFilter, setWarrantyFilter] = useState('all');
    const [showNotifications, setShowNotifications] = useState(false);
    const [unreadNotifications] = useState(1);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedAccount, setSelectedAccount] = useState<Account | null>(null);
    const [showSendFormModal, setShowSendFormModal] = useState(false);
    const [showColumnSettings, setShowColumnSettings] = useState(false);
    const [showDeviceIDSearch, setShowDeviceIDSearch] = useState(false);
    const [showInventoryUpdater, setShowInventoryUpdater] = useState(false);
    const [showUserManagement, setShowUserManagement] = useState(false);
    const [selectedAccountForUsers, setSelectedAccountForUsers] =
        useState<Account | null>(null);
    const [showViewModal, setShowViewModal] = useState(false);
    const [selectedAccountForView, setSelectedAccountForView] =
        useState<Account | null>(null);
    const [visibleColumns, setVisibleColumns] = useState({
        accountId: true,
        name: true,
        contactName: true,
        email: true,
        phone: true,
        location: true,
        type: true,
        salesRep: true,
        customerGroup: true,
        warranty: true,
        purchases: true,
        totalSpent: true,
        lastPurchase: true,
        inventoryCount: true,
        validationAPI: true,
        status: true,
    });

    // Permission checks
    const hasCreateAction = can('create-accounts');
    const hasEditAction = can('edit-accounts');
    const hasDeleteAction = can('delete-accounts');
    const hasViewAction = can('view-accounts');

    const handleAccountDelete = (uuid: string) => {
        if (
            window.confirm(
                'Are you sure you want to delete this account? This action cannot be undone.',
            )
        ) {
            router.delete(`/accounts/${uuid}`, {
                onSuccess: () => {
                    // Reload or update the page
                    router.reload();
                },
            });
        }
    };

    // Column Settings handlers
    const toggleColumnVisibility = (column: string) => {
        setVisibleColumns((prev) => ({
            ...prev,
            [column]: !prev[column as keyof typeof prev],
        }));
    };

    const resetToDefaultColumns = () => {
        // Reset all columns to visible
        setVisibleColumns({
            accountId: true,
            name: true,
            contactName: true,
            email: true,
            phone: true,
            location: true,
            type: true,
            salesRep: true,
            customerGroup: true,
            warranty: true,
            purchases: true,
            totalSpent: true,
            lastPurchase: true,
            inventoryCount: true,
            validationAPI: true,
            status: true,
        });
    };


    // Use salesReps from props, or fallback to default list if empty
    const availableSalesReps =
        salesReps.length > 0
            ? salesReps
            : [
                  'Sarah Sales',
                  'John Sales Manager',
                  'Emily Thompson',
                  'Michael Rodriguez',
                  'Jessica Chen',
              ];

    const getProvincesStates = () => {
        if (countryFilter === 'Canada') {
            return [
                ...new Set(
                    accounts
                        .filter((a) => a.country === 'Canada')
                        .map((a) => a.provinceState),
                ),
            ].sort();
        } else if (countryFilter === 'United States') {
            return [
                ...new Set(
                    accounts
                        .filter((a) => a.country === 'United States')
                        .map((a) => a.provinceState),
                ),
            ].sort();
        }
        return [...new Set(accounts.map((a) => a.provinceState))].sort();
    };

    const filteredAccounts = accounts.filter((account) => {
        const matchesSearch =
            account.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            account.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            account.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (account.contactFirstName &&
                account.contactFirstName
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase())) ||
            (account.contactLastName &&
                account.contactLastName
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase()));
        const matchesType =
            typeFilter === 'all' ||
            account.type.toLowerCase() === typeFilter.toLowerCase();
        const matchesStatus =
            statusFilter === 'all' ||
            account.status.toLowerCase() === statusFilter.toLowerCase();
        const matchesCountry =
            countryFilter === 'all' || account.country === countryFilter;
        const matchesProvinceState =
            provinceStateFilter === 'all' ||
            account.provinceState === provinceStateFilter;
        const matchesSalesRep =
            salesRepFilter === 'all' || account.salesRep === salesRepFilter;
        const matchesCustomerGroup =
            customerGroupFilter === 'all' ||
            account.customerGroup === customerGroupFilter;
        const matchesWarranty =
            warrantyFilter === 'all' ||
            (account.warrantyText || account.warranty) === warrantyFilter;

        return (
            matchesSearch &&
            matchesType &&
            matchesStatus &&
            matchesCountry &&
            matchesProvinceState &&
            matchesSalesRep &&
            matchesCustomerGroup &&
            matchesWarranty
        );
    });

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

    const handleExport = () => {
        // TODO: Implement export functionality
        alert('Export functionality will be implemented');
    };

    return (
        <>
            <Head title="Account Management" />
            <div className="p-4 md:p-6 lg:p-8">
                <div className="mb-6 md:mb-8">
                    <div>
                        <h1 className="mb-2 text-gray-900">
                            Account Management
                        </h1>
                        <p className="text-gray-600">
                            Manage your account relationships and history
                        </p>
                    </div>
                </div>

                {/* User Role Switcher (Demo) */}
                <div className="mb-6 rounded-lg border border-purple-200 bg-gradient-to-r from-purple-50 to-blue-50 p-4">
                    <div className="flex flex-wrap items-center justify-between gap-4">
                        <div>
                            <p className="text-sm text-gray-700">
                                <span className="font-medium">Demo Mode:</span>{' '}
                                Switch user roles to see different column views
                            </p>
                            <p className="mt-1 text-xs text-gray-600">
                                Each role has default column settings. Admin can
                                override any settings.
                            </p>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-sm text-gray-700">
                                Current Role:
                            </span>
                            <select
                                value={userRole}
                                onChange={(e) =>
                                    setUserRole(
                                        e.target.value as
                                            | 'admin'
                                            | 'sales'
                                            | 'manager',
                                    )
                                }
                                className="rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            >
                                <option value="admin">Admin</option>
                                <option value="sales">Sales</option>
                                <option value="manager">Manager</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Stats */}
                <div className="mb-6 grid grid-cols-1 gap-4 md:mb-8 md:grid-cols-4 md:gap-6">
                    <div className="rounded-lg border border-gray-200 bg-white p-6">
                        <p className="mb-1 text-sm text-gray-600">
                            Total Accounts
                        </p>
                        <p className="text-gray-900">{totalAccounts}</p>
                    </div>
                    <div className="rounded-lg border border-gray-200 bg-white p-6">
                        <p className="mb-1 text-sm text-gray-600">
                            Active Accounts
                        </p>
                        <p className="text-gray-900">{activeAccounts}</p>
                    </div>
                    <div className="rounded-lg border border-gray-200 bg-white p-6">
                        <p className="mb-1 text-sm text-gray-600">
                            VIP Accounts
                        </p>
                        <p className="text-gray-900">{vipAccounts}</p>
                    </div>
                    <div className="rounded-lg border border-gray-200 bg-white p-6">
                        <p className="mb-1 text-sm text-gray-600">
                            Total Revenue
                        </p>
                        <p className="text-gray-900">
                            ${totalRevenue.toLocaleString()}
                        </p>
                    </div>
                </div>

                {/* Filters and Actions */}
                <div className="rounded-lg border border-gray-200 bg-white p-6">
                    <div className="mb-4">
                        <div className="flex flex-wrap items-center justify-between gap-4">
                            <div className="relative max-w-md min-w-[250px] flex-1">
                                <Search className="absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 transform text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Search accounts..."
                                    value={searchTerm}
                                    onChange={(e) =>
                                        setSearchTerm(e.target.value)
                                    }
                                    className="w-full rounded-lg border border-gray-300 py-2 pr-4 pl-10 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                />
                            </div>

                            <div className="flex flex-wrap gap-3">
                                <div className="relative">
                                    <button
                                        onClick={() =>
                                            setShowNotifications(
                                                !showNotifications,
                                            )
                                        }
                                        className="relative flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-2 transition-colors hover:bg-gray-50"
                                        title="Notifications"
                                    >
                                        <Bell className="h-4 w-4" />
                                        {unreadNotifications > 0 && (
                                            <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white">
                                                {unreadNotifications}
                                            </span>
                                        )}
                                    </button>
                                </div>
                                <button 
                                    onClick={() => setShowSendFormModal(true)}
                                    className="flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-2 transition-colors hover:bg-gray-50"
                                >
                                    <Send className="h-4 w-4" />
                                    Send Form
                                </button>
                                <button
                                    onClick={() => setShowColumnSettings(true)}
                                    className="flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-2 transition-colors hover:bg-gray-50"
                                >
                                    <Settings className="h-4 w-4" />
                                    Columns
                                </button>
                                <button
                                    onClick={handleExport}
                                    className="flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-2 transition-colors hover:bg-gray-50"
                                >
                                    <Download className="h-4 w-4" />
                                    Export
                                </button>
                                <button
                                    onClick={() => setShowDeviceIDSearch(true)}
                                    className="flex items-center gap-2 rounded-lg border border-purple-300 px-4 py-2 text-purple-700 transition-colors hover:bg-purple-50"
                                >
                                    <Radio className="h-4 w-4" />
                                    Device ID Search
                                </button>
                                <button
                                    onClick={() => setShowInventoryUpdater(true)}
                                    className="flex items-center gap-2 rounded-lg border border-green-300 px-4 py-2 text-green-700 transition-colors hover:bg-green-50"
                                >
                                    <RefreshCw className="h-4 w-4" />
                                    Update Inventory
                                </button>
                                <button
                                    onClick={() => setShowAddModal(true)}
                                    className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700"
                                >
                                    <Plus className="h-4 w-4" />
                                    Add Account
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="mb-3 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Filter className="h-5 w-5 text-gray-400" />
                            <span className="text-gray-700">Filters:</span>
                            {(() => {
                                const activeFilters = [
                                    typeFilter !== 'all',
                                    countryFilter !== 'all',
                                    provinceStateFilter !== 'all',
                                    salesRepFilter !== 'all',
                                    customerGroupFilter !== 'all',
                                    warrantyFilter !== 'all',
                                ].filter(Boolean).length;

                                return activeFilters > 0 ? (
                                    <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 text-xs text-white">
                                        {activeFilters}
                                    </span>
                                ) : null;
                            })()}
                        </div>
                        <button
                            onClick={() => {
                                setTypeFilter('all');
                                setCountryFilter('all');
                                setProvinceStateFilter('all');
                                setSalesRepFilter('all');
                                setCustomerGroupFilter('all');
                                setWarrantyFilter('all');
                            }}
                            className="text-sm text-blue-600 hover:text-blue-700 hover:underline"
                        >
                            Clear All Filters
                        </button>
                    </div>

                    <div className="grid grid-cols-1 gap-3 md:grid-cols-3 lg:grid-cols-6">
                        <select
                            value={typeFilter}
                            onChange={(e) => setTypeFilter(e.target.value)}
                            className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        >
                            <option value="all">All Types</option>
                            {accountTypes.map((type) => (
                                <option
                                    key={type.toLowerCase()}
                                    value={type.toLowerCase()}
                                >
                                    {type}
                                </option>
                            ))}
                        </select>

                        <select
                            value={countryFilter}
                            onChange={(e) => {
                                setCountryFilter(e.target.value);
                                setProvinceStateFilter('all');
                            }}
                            className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        >
                            <option value="all">All Countries</option>
                            {countries.map((country) => (
                                <option key={country} value={country}>
                                    {country}
                                </option>
                            ))}
                        </select>

                        <select
                            value={provinceStateFilter}
                            onChange={(e) =>
                                setProvinceStateFilter(e.target.value)
                            }
                            className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            disabled={countryFilter === 'all'}
                        >
                            <option value="all">
                                All{' '}
                                {countryFilter === 'Canada'
                                    ? 'Provinces'
                                    : countryFilter === 'United States'
                                      ? 'States'
                                      : 'Locations'}
                            </option>
                            {getProvincesStates().map((ps) => (
                                <option key={ps} value={ps}>
                                    {ps}
                                </option>
                            ))}
                        </select>

                        <select
                            value={salesRepFilter}
                            onChange={(e) => setSalesRepFilter(e.target.value)}
                            className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        >
                            <option value="all">All Sales Reps</option>
                            {availableSalesReps.map((rep) => (
                                <option key={rep} value={rep}>
                                    {rep}
                                </option>
                            ))}
                        </select>

                        <select
                            value={customerGroupFilter}
                            onChange={(e) =>
                                setCustomerGroupFilter(e.target.value)
                            }
                            className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        >
                            <option value="all">All Groups</option>
                            {customerGroups.map((group) => (
                                <option key={group.toLowerCase()} value={group}>
                                    {group}
                                </option>
                            ))}
                        </select>

                        <select
                            value={warrantyFilter}
                            onChange={(e) => setWarrantyFilter(e.target.value)}
                            className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        >
                            <option value="all">All Warranties</option>
                            {warrantyOptions.map((warranty) => (
                                <option key={warranty} value={warranty}>
                                    {warranty}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Accounts Table */}
                <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-4 py-3 text-left text-sm text-gray-600">
                                        Store
                                    </th>
                                    <th className="px-4 py-3 text-left text-sm text-gray-600">
                                        Account ID
                                    </th>
                                    <th className="px-4 py-3 text-left text-sm text-gray-600">
                                        Name
                                    </th>
                                    <th className="px-4 py-3 text-left text-sm text-gray-600">
                                        Contact Name
                                    </th>
                                    <th className="px-4 py-3 text-left text-sm text-gray-600">
                                        Email
                                    </th>
                                    <th className="px-4 py-3 text-left text-sm text-gray-600">
                                        Phone
                                    </th>
                                    <th className="px-4 py-3 text-left text-sm text-gray-600">
                                        Location
                                    </th>
                                    <th className="px-4 py-3 text-left text-sm text-gray-600">
                                        Type
                                    </th>
                                    <th className="px-4 py-3 text-left text-sm text-gray-600">
                                        Sales Rep
                                    </th>
                                    <th className="px-4 py-3 text-left text-sm text-gray-600">
                                        Customer Group
                                    </th>
                                    <th className="px-4 py-3 text-left text-sm text-gray-600">
                                        Warranty
                                    </th>
                                    <th className="px-4 py-3 text-left text-sm text-gray-600">
                                        Purchases
                                    </th>
                                    <th className="px-4 py-3 text-left text-sm text-gray-600">
                                        Total Spent
                                    </th>
                                    <th className="px-4 py-3 text-left text-sm text-gray-600">
                                        Last Purchase
                                    </th>
                                    <th className="px-4 py-3 text-left text-sm text-gray-600">
                                        Inventory Count
                                    </th>
                                    <th className="px-4 py-3 text-left text-sm text-gray-600">
                                        Validation API
                                    </th>
                                    <th className="px-4 py-3 text-left text-sm text-gray-600">
                                        Status
                                    </th>
                                    <th className="px-4 py-3 text-left text-sm text-gray-600">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {filteredAccounts.length === 0 ? (
                                    <tr>
                                        <td
                                            colSpan={18}
                                            className="px-6 py-8 text-center text-gray-500"
                                        >
                                            No accounts found
                                        </td>
                                    </tr>
                                ) : (
                                    filteredAccounts.map((account) => (
                                        <tr
                                            key={account.id || account.uuid}
                                            className="hover:bg-gray-50"
                                        >
                                            <td className="px-4 py-4">
                                                <div className="flex items-center gap-3">
                                                    {account.storeLogo ? (
                                                        <div className="group relative">
                                                            <img
                                                                src={
                                                                    account.storeLogo
                                                                }
                                                                alt={`${account.name} store logo`}
                                                                className="h-10 w-10 rounded-lg border-2 border-blue-500 object-cover shadow-sm"
                                                            />
                                                            <div className="absolute -top-1 -right-1 rounded-full bg-blue-600 p-0.5 shadow-lg">
                                                                <Store className="h-2.5 w-2.5 text-white" />
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <Store className="h-4 w-4 text-gray-900" />
                                                    )}
                                                    {account.storeProducts &&
                                                        account.storeProducts
                                                            .length > 0 && (
                                                            <div className="flex flex-col gap-1">
                                                                <div className="flex items-center gap-1">
                                                                    <Package className="h-3 w-3 text-blue-600" />
                                                                    <span className="text-xs text-gray-600">
                                                                        {
                                                                            account
                                                                                .storeProducts
                                                                                .length
                                                                        }{' '}
                                                                        {account
                                                                            .storeProducts
                                                                            .length ===
                                                                        1
                                                                            ? 'Product'
                                                                            : 'Products'}
                                                                    </span>
                                                                </div>
                                                                <div className="flex items-center gap-1">
                                                                    <Clock className="h-3 w-3 text-green-600" />
                                                                    <span className="text-xs text-gray-600">
                                                                        {Math.max(
                                                                            ...account.storeProducts.map(
                                                                                (
                                                                                    p,
                                                                                ) =>
                                                                                    p.yearsOfService,
                                                                            ),
                                                                        )}{' '}
                                                                        yr max
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        )}
                                                </div>
                                            </td>
                                            <td className="px-4 py-4 whitespace-nowrap text-gray-900">
                                                {account.id}
                                            </td>
                                            <td className="px-4 py-4 whitespace-nowrap text-gray-900">
                                                {account.name}
                                            </td>
                                            <td className="px-4 py-4 whitespace-nowrap text-gray-900">
                                                {account.contactFirstName || ''}{' '}
                                                {account.contactLastName || ''}
                                            </td>
                                            <td className="px-4 py-4 text-sm whitespace-nowrap text-gray-600">
                                                <div className="flex items-center gap-1">
                                                    <Mail className="h-3 w-3" />
                                                    {account.email}
                                                </div>
                                            </td>
                                            <td className="px-4 py-4 text-sm whitespace-nowrap text-gray-600">
                                                <div className="flex items-center gap-1">
                                                    <Phone className="h-3 w-3" />
                                                    {account.phone}
                                                </div>
                                            </td>
                                            <td className="px-4 py-4 text-sm text-gray-600">
                                                <div className="whitespace-nowrap">
                                                    {account.city},{' '}
                                                    {account.provinceState}
                                                </div>
                                                <div className="text-xs text-gray-500">
                                                    {account.country}
                                                </div>
                                            </td>
                                            <td className="px-4 py-4 whitespace-nowrap text-gray-900">
                                                {account.type}
                                            </td>
                                            <td className="px-4 py-4 whitespace-nowrap text-gray-900">
                                                {account.salesRep || '-'}
                                            </td>
                                            <td className="px-4 py-4 whitespace-nowrap text-gray-900">
                                                {account.customerGroup || '-'}
                                            </td>
                                            <td className="px-4 py-4 text-sm whitespace-nowrap text-gray-600">
                                                {account.warrantyText ||
                                                    account.warranty ||
                                                    '-'}
                                            </td>
                                            <td className="px-4 py-4 text-center text-gray-900">
                                                {account.totalPurchases}
                                            </td>
                                            <td className="px-4 py-4 whitespace-nowrap text-gray-900">
                                                $
                                                {account.totalSpent.toLocaleString()}
                                            </td>
                                            <td className="px-4 py-4 whitespace-nowrap text-gray-600">
                                                {account.lastPurchase}
                                            </td>
                                            <td className="px-4 py-4 whitespace-nowrap">
                                                <div className="flex flex-col gap-1">
                                                    <span className="font-medium text-gray-900">
                                                        {account.inventoryCount ||
                                                            0}
                                                    </span>
                                                    {account.lastInventoryUpdate && (
                                                        <span className="text-xs text-gray-500">
                                                            {
                                                                account.lastInventoryUpdate
                                                            }
                                                        </span>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-4 py-4 whitespace-nowrap">
                                                {account.allowValidationAPI ? (
                                                    <div className="flex flex-col gap-1">
                                                        <span className="inline-flex w-fit rounded-full bg-green-100 px-2 py-1 text-xs text-green-700">
                                                            Enabled
                                                        </span>
                                                        {account.validationAPIKey && (
                                                            <span className="font-mono text-xs text-gray-600">
                                                                Key:{' '}
                                                                {
                                                                    account.validationAPIKey
                                                                }
                                                            </span>
                                                        )}
                                                    </div>
                                                ) : (
                                                    <span className="inline-flex rounded-full bg-gray-100 px-2 py-1 text-xs text-gray-700">
                                                        Disabled
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-4 py-4">
                                                <span
                                                    className={`inline-flex rounded-full px-2 py-1 text-xs ${getStatusColor(account.status)}`}
                                                >
                                                    {account.status}
                                                </span>
                                            </td>
                                            <td className="px-4 py-4">
                                                <div className="flex items-center gap-2">
                                                    <button
                                                        className="p-1 hover:bg-gray-100 rounded transition-colors"
                                                        title="Manage Users"
                                                        onClick={() => {
                                                            setSelectedAccountForUsers(account);
                                                            setShowUserManagement(true);
                                                        }}
                                                    >
                                                        <Users className="w-4 h-4 text-blue-600" />
                                                    </button>
                                                    <button
                                                        className="p-1 hover:bg-gray-100 rounded transition-colors"
                                                        title="View Orders"
                                                        onClick={() => {
                                                            // Handle view orders action
                                                            alert(`View orders for ${account.name}`);
                                                        }}
                                                    >
                                                        <ShoppingCart className="w-4 h-4 text-gray-600" />
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            setSelectedAccountForView(account);
                                                            setShowViewModal(true);
                                                        }}
                                                        className="p-1 hover:bg-gray-100 rounded transition-colors"
                                                        title="View"
                                                    >
                                                        <Eye className="w-4 h-4 text-gray-600" />
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            setSelectedAccount(account);
                                                            setShowEditModal(true);
                                                        }}
                                                        className="p-1 hover:bg-gray-100 rounded transition-colors"
                                                        title="Edit"
                                                    >
                                                        <Edit className="w-4 h-4 text-gray-600" />
                                                    </button>
                                                    <button
                                                        onClick={() =>
                                                            handleAccountDelete(
                                                                account.uuid ||
                                                                    account.id,
                                                            )
                                                        }
                                                        className="p-1 hover:bg-gray-100 rounded transition-colors"
                                                        title="Delete"
                                                    >
                                                        <Trash2 className="w-4 h-4 text-red-600" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Add Account Modal */}
            {showAddModal && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
                    onClick={() => setShowAddModal(false)}
                >
                    <div
                        className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-lg bg-white shadow-xl"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex items-center justify-between border-b border-gray-200 p-6">
                            <h2 className="text-md text-gray-900">
                                Add New Account
                            </h2>
                            <button
                                type="button"
                                className="rounded-lg p-2 transition-colors hover:bg-gray-100"
                                onClick={() => setShowAddModal(false)}
                            >
                                <X className="h-5 w-5 text-gray-600" />
                            </button>
                        </div>

                        <div className="p-6">
                            <CreateAccount
                                accountTypes={accountTypes}
                                countries={countries}
                                customerGroups={customerGroups}
                                salesReps={salesReps}
                                warrantyOptions={warrantyOptions}
                                onSuccess={() => setShowAddModal(false)}
                            />
                        </div>
                    </div>
                </div>
            )}

            {/* Edit Account Modal */}
            {showEditModal && selectedAccount && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
                    onClick={() => {
                        setShowEditModal(false);
                        setSelectedAccount(null);
                    }}
                >
                    <div
                        className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-lg bg-white shadow-xl"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex items-center justify-between border-b border-gray-200 p-6">
                            <h2 className="text-md text-gray-900">
                                Edit Account
                            </h2>
                            <button
                                type="button"
                                className="rounded-lg p-2 transition-colors hover:bg-gray-100"
                                onClick={() => {
                                    setShowEditModal(false);
                                    setSelectedAccount(null);
                                }}
                            >
                                <X className="h-5 w-5 text-gray-600" />
                            </button>
                        </div>

                        <div className="p-6">
                            <EditAccount
                                account={selectedAccount}
                                accountTypes={accountTypes}
                                countries={countries}
                                customerGroups={customerGroups}
                                salesReps={salesReps}
                                warrantyOptions={warrantyOptions}
                                onSuccess={() => {
                                    setShowEditModal(false);
                                    setSelectedAccount(null);
                                }}
                            />
                        </div>
                    </div>
                </div>
            )}

            {/* Send Form to Customer Modal */}
            {showSendFormModal && (
                <SendForm
                    onClose={() => setShowSendFormModal(false)}
                    onSuccess={() => {
                        // Optional: Add any success handling here
                    }}
                />
            )}

            {/* Column Settings Modal */}
            {showColumnSettings && (
                <ColumnSettings
                    userRole={userRole}
                    visibleColumns={visibleColumns}
                    onClose={() => setShowColumnSettings(false)}
                    onToggleColumn={toggleColumnVisibility}
                    onReset={resetToDefaultColumns}
                />
            )}

            {/* Device ID Search Modal */}
            {showDeviceIDSearch && (
                <DeviceIDSearch
                    onClose={() => setShowDeviceIDSearch(false)}
                />
            )}

            {/* Inventory Updater Modal */}
            {showInventoryUpdater && (
                <InventoryUpdater
                    accounts={accounts.map((acc) => ({
                        id: acc.id,
                        name: acc.name,
                        inventoryCount: acc.inventoryCount,
                        lastInventoryUpdate: acc.lastInventoryUpdate,
                        inventoryStatus: acc.inventoryStatus,
                    }))}
                    onClose={() => setShowInventoryUpdater(false)}
                    onInventoryUpdate={(updates) => {
                        // Handle inventory updates
                        console.log('Inventory updates:', updates);
                        // You can add logic here to update the accounts state
                    }}
                />
            )}

            {/* Account User Management Modal */}
            {showUserManagement && selectedAccountForUsers && (
                <ManageUsers
                    accountId={selectedAccountForUsers.id}
                    accountName={selectedAccountForUsers.name}
                    onClose={() => {
                        setShowUserManagement(false);
                        setSelectedAccountForUsers(null);
                    }}
                />
            )}

            {/* Account Details View Modal */}
            {showViewModal && selectedAccountForView && (
                <ManageAccountDetails
                    account={selectedAccountForView}
                    onClose={() => {
                        setShowViewModal(false);
                        setSelectedAccountForView(null);
                    }}
                    onEdit={() => {
                        setShowViewModal(false);
                        setSelectedAccount(selectedAccountForView);
                        setShowEditModal(true);
                        setSelectedAccountForView(null);
                    }}
                />
            )}
        </>
    );
};

ManageAccounts.layout = (page: React.ReactNode) => (
    <AppLayout children={page} />
);

export default ManageAccounts;
