import UserController from '@/actions/App/Http/Controllers/Admin/UserController';
import ActionLinks from '@/components/Datatable/ActionLinks';
import CustomDataTable from '@/components/Datatable/CustomDataTable';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { Head, router } from '@inertiajs/react';
import { DataTableRef } from 'datatables.net-react';
import { Plus, Shield, X } from 'lucide-react';
import { useRef, useState } from 'react';
import CreateUser from './create';
import EditUser from './edit';

interface Permission {
    id: string;
    name: string;
    guard_name?: string;
}

interface ManageUsersProps {
    users?: Array<{
        id: string;
        userId: string;
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
    }>;
    totalUsers?: number;
    activeUsers?: number;
    adminUsers?: number;
    roles?: Array<{ uuid: string; name: string }>;
    permissions?: Permission[];
    csrfToken?: string;
}

const ManageUsers = ({
    users = [],
    totalUsers = 0,
    activeUsers = 0,
    adminUsers = 0,
    roles = [],
    permissions = [],
    csrfToken = '',
}: ManageUsersProps) => {
    const tableAPI = useRef<DataTableRef>(null);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState<string | null>(null);

    const handleUserDelete = (uuid: string) => {
        router.delete(UserController.destroy(uuid).url, {
            onSuccess: () => {
                tableAPI.current?.dt()?.ajax.reload(undefined, false);
            },
        });
    };

    const handleEditUser = (uuid: string) => {
        setSelectedUser(uuid);
        setShowEditModal(true);
    };

    const handleEditSuccess = () => {
        setShowEditModal(false);
        setSelectedUser(null);
        tableAPI.current?.dt()?.ajax.reload(undefined, false);
    };

    const slots = {
        7: (uuid: string) => {
            const editProps = {
                onClick: (e: React.MouseEvent<HTMLButtonElement>) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleEditUser(uuid);
                },
            };

            const deleteProps = {
                onClick: (e: React.MouseEvent<HTMLButtonElement>) => {
                    e.preventDefault();
                    e.stopPropagation();
                    if (
                        confirm(
                            'Are you sure you want to delete this user? This action cannot be undone.',
                        )
                    ) {
                        handleUserDelete(uuid);
                    }
                },
            };

            return (
                <ActionLinks
                    edit_props={editProps}
                    delete_props={deleteProps}
                />
            );
        },
    };

    const datatableColumns = [
        { data: 'user_id' },
        { data: 'name' },
        { data: 'email' },
        { data: 'phone' },
        { data: 'role_name' },
        { data: 'status' },
        { data: 'last_login' },
        {
            data: 'uuid',
            orderable: false,
        },
    ];

    const handleCreateSuccess = () => {
        setShowAddModal(false);
        tableAPI.current?.dt()?.ajax.reload(undefined, false);
    };

    return (
        <>
            <Head title="User Management" />
            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto rounded-xl p-4 md:p-6">
                <div className="mb-6">
                    <h1 className="mb-2 text-gray-900">Admin Panel</h1>
                    <p className="text-gray-600">
                        Manage system users, permissions, and company branding
                    </p>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                    <div className="rounded-lg border border-gray-200 bg-white p-6">
                        <div className="flex items-center gap-3">
                            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100">
                                <Shield className="h-6 w-6 text-blue-600" />
                            </div>
                            <div>
                                <p className="mb-1 text-sm text-gray-600">
                                    Total Users
                                </p>
                                <p className="text-gray-900">{totalUsers}</p>
                            </div>
                        </div>
                    </div>
                    <div className="rounded-lg border border-gray-200 bg-white p-6">
                        <div className="flex items-center gap-3">
                            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-100">
                                <Shield className="h-6 w-6 text-green-600" />
                            </div>
                            <div>
                                <p className="mb-1 text-sm text-gray-600">
                                    Active Users
                                </p>
                                <p className="text-gray-900">{activeUsers}</p>
                            </div>
                        </div>
                    </div>
                    <div className="rounded-lg border border-gray-200 bg-white p-6">
                        <div className="flex items-center gap-3">
                            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-purple-100">
                                <Shield className="h-6 w-6 text-purple-600" />
                            </div>
                            <div>
                                <p className="mb-1 text-sm text-gray-600">
                                    Admins
                                </p>
                                <p className="text-gray-900">{adminUsers}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-end">
                    <Button
                        onClick={() => setShowAddModal(true)}
                        className="bg-blue-600 text-white hover:bg-blue-700"
                    >
                        <Plus className="mr-2 h-4 w-4" />
                        Add User
                    </Button>
                </div>

                {/* CustomDataTable */}
                <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
                    <CustomDataTable
                        options={{
                            ajax: {
                                url: UserController.table().url,
                                type: 'post',
                                headers: {
                                    'X-CSRF-TOKEN': csrfToken,
                                },
                            },
                            columns: datatableColumns,
                            ref: tableAPI,
                            slots: slots,
                        }}
                        sorting={[[1, 'asc']]}
                    >
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-sm text-gray-600">
                                    User ID
                                </th>
                                <th className="px-6 py-3 text-left text-sm text-gray-600">
                                    Name
                                </th>
                                <th className="px-6 py-3 text-left text-sm text-gray-600">
                                    Email
                                </th>
                                <th className="px-6 py-3 text-left text-sm text-gray-600">
                                    Phone
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
                    </CustomDataTable>
                </div>
            </div>

            {/* Add User Modal */}
            {showAddModal && (
                <div className="bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
                    <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-lg bg-white shadow-xl">
                        <div className="flex items-center justify-between border-b border-gray-200 p-6">
                            <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100">
                                    <Shield className="h-5 w-5 text-blue-600" />
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
                                <X className="h-5 w-5 text-gray-600" />
                            </Button>
                        </div>

                        <div className="p-6">
                            <CreateUser
                                roles={roles}
                                permissions={permissions}
                                onSuccess={handleCreateSuccess}
                            />
                        </div>
                    </div>
                </div>
            )}

            {/* Edit User Modal */}
            {showEditModal && selectedUser && (
                <div className="bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
                    <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-lg bg-white shadow-xl">
                        <div className="flex items-center justify-between border-b border-gray-200 p-6">
                            <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100">
                                    <Shield className="h-5 w-5 text-blue-600" />
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
                                <X className="h-5 w-5 text-gray-600" />
                            </Button>
                        </div>

                        <div className="p-6">
                            <EditUser
                                userUuid={selectedUser}
                                roles={roles}
                                permissions={permissions}
                                onSuccess={handleEditSuccess}
                            />
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

ManageUsers.layout = (page: React.ReactNode) => <AppLayout children={page} />;

export default ManageUsers;
