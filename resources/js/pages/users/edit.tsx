import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { Form, Head } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import UserInput from './input';

interface Permission {
    id: string;
    name: string;
    guard_name?: string;
}

interface EditUserProps {
    user?: {
        id?: string;
        uuid?: string;
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

const EditUser = ({
    user,
    userUuid,
    roles = [],
    permissions = [],
    availableAccounts = [],
    onSuccess,
}: EditUserProps) => {
    const userData = (user as any)?.data || user;
    const userId = userData?.id || userData?.userId || userData?.uuid || userUuid || '';

    return (
        <>
            <Head title="Edit User" />
            <Form 
                method="put" 
                action={`/admin/users/${userId}`} 
                onSuccess={onSuccess}
                preserveScroll
            >
                {({ processing, errors }) => (
                    <div>
                        <UserInput
                            errors={errors}
                            data={userData}
                            roles={roles}
                            permissions={permissions}
                            availableAccounts={availableAccounts}
                        />
                        <div className="flex justify-end gap-3 border-t border-gray-200 pt-4 mt-6">
                            <Button 
                                type="button" 
                                variant="outline"
                                onClick={onSuccess}
                            >
                                Cancel
                            </Button>
                            <Button type="submit" disabled={processing}>
                                {processing && <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />}
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
