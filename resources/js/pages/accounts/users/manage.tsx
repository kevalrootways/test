import { Button } from '@/components/ui/button';
import { Edit, Mail, Phone, Shield, Trash2, UserPlus, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import CreateUser from './create';
import EditUser from './edit';

interface AccountUser {
    id: string;
    name: string;
    email: string;
    phone: string;
    password: string;
    role: string;
    status: string;
    assignedStore: string;
    userType: string;
    permissions: string[];
    lastLogin?: string;
}

interface ManageUsersProps {
    accountId: string;
    accountName: string;
    onClose: () => void;
}

const ManageUsers = ({ accountId, accountName, onClose }: ManageUsersProps) => {
    const [accountUsers, setAccountUsers] = useState<AccountUser[]>([]);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState<AccountUser | null>(null);

    // Load users for this account
    useEffect(() => {
        loadAccountUsers();
    }, [accountId]);

    const loadAccountUsers = () => {
        const savedUsers = localStorage.getItem('systemUsers');
        if (savedUsers) {
            try {
                const allUsers = JSON.parse(savedUsers);
                // Filter users assigned to this account
                const filtered = allUsers.filter(
                    (u: AccountUser) => u.assignedStore === accountId,
                );
                setAccountUsers(filtered);
            } catch (error) {
                console.error('Failed to load users:', error);
            }
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

        // Load all users
        const savedUsers = localStorage.getItem('systemUsers');
        if (!savedUsers) return;

        let allUsers = JSON.parse(savedUsers);

        // Remove the user
        allUsers = allUsers.filter((u: AccountUser) => u.id !== userId);

        localStorage.setItem('systemUsers', JSON.stringify(allUsers));

        // Reload account users
        loadAccountUsers();
    };

    const openEditModal = (user: AccountUser) => {
        setSelectedUser(user);
        setShowEditModal(true);
    };

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

    return (
        <>
            <div
                className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
                onClick={onClose}
            >
                <div
                    className="flex max-h-[90vh] w-full max-w-5xl flex-col overflow-hidden rounded-lg bg-white shadow-xl"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Header */}
                    <div className="flex items-center justify-between border-b border-gray-200 p-6">
                        <div>
                            <h2 className="mb-1 text-gray-900">
                                User Access Management
                            </h2>
                            <p className="text-sm text-gray-600">
                                {accountName} ({accountId})
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

                    {/* Content */}
                    <div className="flex-1 overflow-y-auto p-6">
                        {/* Summary */}
                        <div className="mb-6 rounded-lg border border-blue-200 bg-blue-50 p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="mb-1 text-gray-900">
                                        {accountUsers.length} user
                                        {accountUsers.length !== 1
                                            ? 's'
                                            : ''}{' '}
                                        with access
                                    </p>
                                    <p className="text-sm text-gray-600">
                                        {
                                            accountUsers.filter(
                                                (u) => u.status === 'Active',
                                            ).length
                                        }{' '}
                                        active
                                    </p>
                                </div>
                                <Button
                                    type="button"
                                    onClick={() => setShowAddModal(true)}
                                    className="bg-blue-600 text-white hover:bg-blue-700"
                                >
                                    <UserPlus className="h-4 w-4" />
                                    Add User
                                </Button>
                            </div>
                        </div>

                        {/* Users List */}
                        {accountUsers.length === 0 ? (
                            <div className="py-12 text-center">
                                <Shield className="mx-auto mb-4 h-16 w-16 text-gray-400" />
                                <h3 className="mb-2 text-gray-900">
                                    No Users Yet
                                </h3>
                                <p className="mb-4 text-gray-600">
                                    No users have been assigned to this account
                                    yet.
                                </p>
                                <Button
                                    type="button"
                                    onClick={() => setShowAddModal(true)}
                                    className="bg-blue-600 text-white hover:bg-blue-700"
                                >
                                    <UserPlus className="h-4 w-4" />
                                    Add First User
                                </Button>
                            </div>
                        ) : (
                            <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
                                <table className="w-full">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-sm text-gray-600">
                                                User
                                            </th>
                                            <th className="px-6 py-3 text-left text-sm text-gray-600">
                                                Contact
                                            </th>
                                            <th className="px-6 py-3 text-left text-sm text-gray-600">
                                                Role
                                            </th>
                                            <th className="px-6 py-3 text-left text-sm text-gray-600">
                                                Status
                                            </th>
                                            <th className="px-6 py-3 text-left text-sm text-gray-600">
                                                Last Login
                                            </th>
                                            <th className="px-6 py-3 text-left text-sm text-gray-600">
                                                Actions
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200">
                                        {accountUsers.map((user) => (
                                            <tr
                                                key={user.id}
                                                className="hover:bg-gray-50"
                                            >
                                                <td className="px-6 py-4">
                                                    <div>
                                                        <p className="text-gray-900">
                                                            {user.name}
                                                        </p>
                                                        <p className="text-sm text-gray-600">
                                                            {user.id}
                                                        </p>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="space-y-1">
                                                        <div className="flex items-center gap-2 text-sm text-gray-600">
                                                            <Mail className="h-3 w-3" />
                                                            {user.email}
                                                        </div>
                                                        <div className="flex items-center gap-2 text-sm text-gray-600">
                                                            <Phone className="h-3 w-3" />
                                                            {user.phone}
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className="text-sm text-gray-900">
                                                        {user.role}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span
                                                        className={`inline-flex rounded-full px-2 py-1 text-xs ${getStatusColor(user.status)}`}
                                                    >
                                                        {user.status}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-sm text-gray-600">
                                                    {user.lastLogin || '-'}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-2">
                                                        <Button
                                                            type="button"
                                                            variant="ghost"
                                                            size="icon"
                                                            onClick={() =>
                                                                openEditModal(
                                                                    user,
                                                                )
                                                            }
                                                            className="h-8 w-8"
                                                            title="Edit User"
                                                        >
                                                            <Edit className="h-4 w-4 text-gray-600" />
                                                        </Button>
                                                        <Button
                                                            type="button"
                                                            variant="ghost"
                                                            size="icon"
                                                            onClick={() =>
                                                                handleDeleteUser(
                                                                    user.id,
                                                                )
                                                            }
                                                            className="h-8 w-8"
                                                            title="Delete User"
                                                        >
                                                            <Trash2 className="h-4 w-4 text-red-600" />
                                                        </Button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>

                    {/* Footer */}
                    <div className="border-t border-gray-200 p-6">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={onClose}
                            className="w-full"
                        >
                            Close
                        </Button>
                    </div>
                </div>
            </div>

            {/* Add User Modal */}
            {showAddModal && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 p-4">
                    <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-lg bg-white shadow-xl">
                        <div className="flex items-center justify-between border-b border-gray-200 p-6">
                            <h3 className="text-gray-900">Add New User</h3>
                            <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                onClick={() => setShowAddModal(false)}
                                className="h-9 w-9"
                            >
                                <X className="h-5 w-5 text-gray-600" />
                            </Button>
                        </div>
                        <div className="p-6">
                            <CreateUser
                                accountId={accountId}
                                accountName={accountName}
                                onSuccess={() => {
                                    setShowAddModal(false);
                                    loadAccountUsers();
                                }}
                            />
                        </div>
                    </div>
                </div>
            )}

            {/* Edit User Modal */}
            {showEditModal && selectedUser && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 p-4">
                    <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-lg bg-white shadow-xl">
                        <div className="flex items-center justify-between border-b border-gray-200 p-6">
                            <h3 className="text-gray-900">Edit User</h3>
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
                                <X className="h-5 w-5 text-gray-600" />
                            </Button>
                        </div>
                        <div className="p-6">
                            <EditUser
                                user={selectedUser}
                                accountId={accountId}
                                accountName={accountName}
                                onSuccess={() => {
                                    setShowEditModal(false);
                                    setSelectedUser(null);
                                    loadAccountUsers();
                                }}
                            />
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default ManageUsers;
