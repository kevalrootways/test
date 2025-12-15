import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { Form, Head, router, usePage } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import { useEffect, useState } from 'react';
import UserInput from './input';

interface Permission {
    id: string;
    name: string;
    guard_name?: string;
}

interface EditUserProps {
    user?: {
        id?: string;
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
        lastLogin?: string;
    };
    userUuid?: string;
    roles?: string[];
    permissions?: Permission[];
    availableAccounts?: Array<{ id: string; name: string; type: string }>;
    onSuccess?: () => void;
}

const EditUser = (props: EditUserProps & { onSuccess?: () => void }) => {
    const { props: pageProps } = usePage();
    const inertiaProps = pageProps as any;
    const [userData, setUserData] = useState<any>(null);
    const [loading, setLoading] = useState(false);

    const user = props.user || inertiaProps.user;
    const userUuid = props.userUuid;
    const roles = props.roles || inertiaProps.roles || [];
    const permissions = props.permissions || inertiaProps.permissions || [];
    const availableAccounts =
        props.availableAccounts || inertiaProps.availableAccounts || [];
    const onSuccess = props.onSuccess;

    // Fetch user data if userUuid is provided - using fetch to avoid navigation
    useEffect(() => {
        if (userUuid && !user) {
            setLoading(true);
            // Use fetch API instead of router.get to avoid navigation
            fetch(`/admin/users/${userUuid}/edit`, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest',
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                },
                credentials: 'same-origin',
            })
                .then(async (response) => {
                    if (!response.ok) {
                        throw new Error(`Failed to fetch user data: ${response.status}`);
                    }
                    const contentType = response.headers.get('content-type');
                    if (contentType && contentType.includes('application/json')) {
                        return response.json();
                    } else {
                        const text = await response.text();
                        throw new Error('Server returned non-JSON response');
                    }
                })
                .then((data) => {
                    // Extract user data from JSON response
                    // The controller returns: { user: {...}, roles: [...], permissions: [...] }
                    const fetchedUser = data.user || data.props?.user || null;
                    if (fetchedUser) {
                        // Map the user data to match the expected format
                        const mappedUser = {
                            id: fetchedUser.id || fetchedUser.userId || userUuid,
                            userId: fetchedUser.userId || fetchedUser.id,
                            name: fetchedUser.name,
                            email: fetchedUser.email,
                            phone: fetchedUser.phone,
                            role: fetchedUser.role,
                            status: fetchedUser.status,
                            permissions: fetchedUser.permissions || [],
                            assignedStore: fetchedUser.assignedStore,
                            commissionEnabled: fetchedUser.commissionEnabled,
                            commissionRate: fetchedUser.commissionRate,
                            lastLogin: fetchedUser.lastLogin,
                        };
                        setUserData(mappedUser);
                    }
                    setLoading(false);
                })
                .catch(() => {
                    setLoading(false);
                });
        } else if (user) {
            const data = (user as any)?.data || user;
            setUserData(data);
        }
    }, [userUuid, user]);

    // Get user ID - UserResource returns 'id' as uuid
    const userId = userData?.id || userData?.userId || userUuid || '';

    if (loading) {
        return (
            <div className="flex items-center justify-center p-8">
                <LoaderCircle className="h-8 w-8 animate-spin text-blue-600" />
            </div>
        );
    }

    if (!userData && !user) {
        return (
            <div className="p-8 text-center text-gray-600">
                User not found
            </div>
        );
    }

    return (
        <>
            <Head title="Edit User" />
            <Form
                method="put"
                action={`/admin/users/${userId}`}
                onSuccess={onSuccess || (() => {})}
                preserveScroll
            >
                {({ processing, errors }) => (
                    <div className="p-0">
                        <div className="mb-6 rounded-lg border border-gray-200 bg-white p-6">
                            <UserInput
                                errors={errors}
                                data={userData}
                                roles={roles}
                                permissions={permissions}
                                availableAccounts={availableAccounts}
                            />
                        </div>
                        <div className="flex justify-end gap-3 border-t border-gray-200 pt-4">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={onSuccess}
                            >
                                Cancel
                            </Button>
                            <Button type="submit" disabled={processing}>
                                {processing && (
                                    <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                                )}
                                Update User
                            </Button>
                        </div>
                    </div>
                )}
            </Form>
        </>
    );
};

EditUser.layout = (page: React.ReactNode) => <AppLayout children={page} />;

export default EditUser;
