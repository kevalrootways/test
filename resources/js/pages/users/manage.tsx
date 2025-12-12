import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { Head, router } from '@inertiajs/react';
import {
    Edit,
    Eye,
    Mail,
    Phone,
    Plus,
    Search,
    Shield,
    Trash2,
    X,
} from 'lucide-react';
import { useState } from 'react';
import CreateUser from './create';
import EditUser from './edit';

interface User {
    id: string;
    name: string;
    email: string;
    phone: string;
    role: string;
    status: string;
    lastLogin?: string;
    permissions?: string[];
    assignedStore?: string;
    commissionEnabled?: boolean;
    commissionRate?: number;
}

interface ManageUsersProps {
    users?: User[];
    totalUsers?: number;
    activeUsers?: number;
    adminUsers?: number;
    roles?: string[];
    availableAccounts?: Array<{ id: string; name: string; type: string }>;
}

const ManageUsers = ({
    users = [],
    totalUsers = 0,
    activeUsers = 0,
    adminUsers = 0,
    roles = [],
    availableAccounts = [],
}: ManageUsersProps) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [roleFilter, setRoleFilter] = useState('all');
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);

    const filteredUsers = users.filter((user) => {
        const matchesSearch =
            user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.id.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesRole =
            roleFilter === 'all' ||
            user.role.toLowerCase().includes(roleFilter.toLowerCase());
        return matchesSearch && matchesRole;
    });

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Active':
                return 'bg-green-100 text-green-700';
            case 'Inactive':
                return 'bg-gray-100 text-gray-700';
            case 'Suspended':
                return 'bg-red-100 text-red-700';
            default:
                return 'bg-gray-100 text-gray-700';
        }
    };

    const getRoleColor = (role: string) => {
        switch (role) {
            case 'Super Admin':
                return 'bg-purple-100 text-purple-700';
            case 'Manager':
                return 'bg-blue-100 text-blue-700';
            case 'Sales':
                return 'bg-green-100 text-green-700';
            case 'Inventory Manager':
                return 'bg-orange-100 text-orange-700';
            case 'Support':
                return 'bg-cyan-100 text-cyan-700';
            case 'Analyst':
                return 'bg-indigo-100 text-indigo-700';
            default:
                return 'bg-gray-100 text-gray-700';
        }
    };

    const handleDeleteUser = (userId: string) => {
        if (
            !confirm(
                'Are you sure you want to delete this user? This action cannot be undone.',
            )
        ) {
            return;
        }

        router.delete(`/admin/users/${userId}`, {
            preserveScroll: true,
            onSuccess: () => {
                // User will be refreshed from server
            },
        });
    };

    return (
        <>
            <Head title="User Management" />
            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto rounded-xl p-4 md:p-6">
                <div className="mb-8">
                    <h1 className="text-gray-900 mb-2">Admin Panel</h1>
                    <p className="text-gray-600">
                        Manage system users, permissions, and company branding
                    </p>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white rounded-lg border border-gray-200 p-6">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                                <Shield className="w-6 h-6 text-blue-600" />
                            </div>
                            <div>
                                <p className="text-gray-600 text-sm mb-1">
                                    Total Users
                                </p>
                                <p className="text-gray-900">{totalUsers}</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-lg border border-gray-200 p-6">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                                <Shield className="w-6 h-6 text-green-600" />
                            </div>
                            <div>
                                <p className="text-gray-600 text-sm mb-1">
                                    Active Users
                                </p>
                                <p className="text-gray-900">{activeUsers}</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-lg border border-gray-200 p-6">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                                <Shield className="w-6 h-6 text-purple-600" />
                            </div>
                            <div>
                                <p className="text-gray-600 text-sm mb-1">
                                    Admins
                                </p>
                                <p className="text-gray-900">{adminUsers}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Filters and Actions */}
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                    <div className="flex flex-wrap gap-4 items-center justify-between">
                        <div className="flex flex-wrap gap-4 flex-1">
                            <div className="relative flex-1 min-w-[200px] max-w-md">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <input
                                    type="text"
                                    placeholder="Search users..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                            <select
                                value={roleFilter}
                                onChange={(e) => setRoleFilter(e.target.value)}
                                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="all">All Roles</option>
                                <option value="super admin">Super Admin</option>
                                <option value="manager">Manager</option>
                                <option value="sales">Sales</option>
                                <option value="inventory">Inventory Manager</option>
                                <option value="support">Support</option>
                                <option value="analyst">Analyst</option>
                                <option value="dealers">Dealers</option>
                                <option value="insurance">Insurance Industry</option>
                                <option value="distributors">Distributors</option>
                                <option value="store user">Store User</option>
                            </select>
                        </div>

                        <Button
                            onClick={() => setShowAddModal(true)}
                            className="bg-blue-600 text-white hover:bg-blue-700"
                        >
                            <Plus className="w-4 h-4 mr-2" />
                            Add User
                        </Button>
                    </div>
                </div>

                {/* Users Table */}
                <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-gray-600 text-sm">
                                        User ID
                                    </th>
                                    <th className="px-6 py-3 text-left text-gray-600 text-sm">
                                        Name
                                    </th>
                                    <th className="px-6 py-3 text-left text-gray-600 text-sm">
                                        Contact
                                    </th>
                                    <th className="px-6 py-3 text-left text-gray-600 text-sm">
                                        Role
                                    </th>
                                    <th className="px-6 py-3 text-left text-gray-600 text-sm">
                                        Permissions
                                    </th>
                                    <th className="px-6 py-3 text-left text-gray-600 text-sm">
                                        Last Login
                                    </th>
                                    <th className="px-6 py-3 text-left text-gray-600 text-sm">
                                        Status
                                    </th>
                                    <th className="px-6 py-3 text-left text-gray-600 text-sm">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {filteredUsers.length === 0 ? (
                                    <tr>
                                        <td
                                            colSpan={8}
                                            className="px-6 py-12 text-center text-gray-500"
                                        >
                                            No users found
                                        </td>
                                    </tr>
                                ) : (
                                    filteredUsers.map((user) => (
                                        <tr key={user.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 text-gray-900">
                                                {user.id}
                                            </td>
                                            <td className="px-6 py-4 text-gray-900">
                                                {user.name}
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="space-y-1">
                                                    <div className="flex items-center gap-2 text-gray-600 text-sm">
                                                        <Mail className="w-3 h-3" />
                                                        {user.email}
                                                    </div>
                                                    <div className="flex items-center gap-2 text-gray-600 text-sm">
                                                        <Phone className="w-3 h-3" />
                                                        {user.phone}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span
                                                    className={`inline-flex px-2 py-1 rounded-full text-xs ${getRoleColor(
                                                        user.role,
                                                    )}`}
                                                >
                                                    {user.role}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex flex-wrap gap-1 max-w-xs">
                                                    {user.permissions
                                                        ?.slice(0, 3)
                                                        .map((perm, idx) => (
                                                            <span
                                                                key={idx}
                                                                className="inline-flex px-2 py-0.5 bg-gray-100 text-gray-700 rounded text-xs"
                                                            >
                                                                {perm}
                                                            </span>
                                                        ))}
                                                    {(user.permissions?.length || 0) > 3 && (
                                                        <span className="inline-flex px-2 py-0.5 bg-gray-100 text-gray-700 rounded text-xs">
                                                            +
                                                            {(user.permissions?.length || 0) - 3}
                                                        </span>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-gray-600">
                                                {user.lastLogin || '-'}
                                            </td>
                                            <td className="px-6 py-4">
                                                <span
                                                    className={`inline-flex px-2 py-1 rounded-full text-xs ${getStatusColor(
                                                        user.status,
                                                    )}`}
                                                >
                                                    {user.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2">
                                                    <button
                                                        className="p-1 hover:bg-gray-100 rounded transition-colors"
                                                        title="View"
                                                    >
                                                        <Eye className="w-4 h-4 text-gray-600" />
                                                    </button>
                                                    <button
                                                        className="p-1 hover:bg-gray-100 rounded transition-colors"
                                                        title="Edit"
                                                        onClick={() => {
                                                            setSelectedUser(user);
                                                            setShowEditModal(true);
                                                        }}
                                                    >
                                                        <Edit className="w-4 h-4 text-gray-600" />
                                                    </button>
                                                    <button
                                                        className="p-1 hover:bg-gray-100 rounded transition-colors"
                                                        title="Delete"
                                                        onClick={() =>
                                                            handleDeleteUser(user.id)
                                                        }
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

                    {/* Pagination */}
                    <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
                        <p className="text-sm text-gray-600">
                            Showing {filteredUsers.length} of {users.length}{' '}
                            users
                        </p>
                        <div className="flex gap-2">
                            <Button variant="outline" size="sm">
                                Previous
                            </Button>
                            <Button size="sm" className="bg-blue-600 text-white">
                                1
                            </Button>
                            <Button variant="outline" size="sm">
                                Next
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Add User Modal */}
            {showAddModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between p-6 border-b border-gray-200">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                    <Shield className="w-5 h-5 text-blue-600" />
                                </div>
                                <h2 className="text-gray-900">Add New User</h2>
                            </div>
                            <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                onClick={() => setShowAddModal(false)}
                                className="h-9 w-9"
                            >
                                <X className="w-5 h-5 text-gray-600" />
                            </Button>
                        </div>

                        <div className="p-6">
                            <CreateUser
                                roles={roles}
                                availableAccounts={availableAccounts}
                                onSuccess={() => setShowAddModal(false)}
                            />
                        </div>
                    </div>
                </div>
            )}

            {/* Edit User Modal */}
            {showEditModal && selectedUser && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between p-6 border-b border-gray-200">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                    <Shield className="w-5 h-5 text-blue-600" />
                                </div>
                                <h2 className="text-gray-900">Edit User</h2>
                            </div>
                            <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                onClick={() => {
                                    setShowEditModal(false);
                                    setSelectedUser(null);
                                }}
                                className="h-9 w-9"
                            >
                                <X className="w-5 h-5 text-gray-600" />
                            </Button>
                        </div>

                        <div className="p-6">
                            <EditUser
                                user={selectedUser}
                                roles={roles}
                                availableAccounts={availableAccounts}
                                onSuccess={() => {
                                    setShowEditModal(false);
                                    setSelectedUser(null);
                                }}
                            />
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

ManageUsers.layout = (page: React.ReactNode) => (
    <AppLayout children={page} />
);

export default ManageUsers;

