import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { Form, Head } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import UserInput from './input';

interface EditUserProps {
    user?: {
        id?: string;
        name?: string;
        email?: string;
        phone?: string;
        password?: string;
        role?: string;
        status?: string;
    };
    accountId: string;
    accountName: string;
    onSuccess?: () => void;
}

const EditUser = ({
    user,
    accountId,
    accountName,
    onSuccess,
}: EditUserProps) => {
    const userData = (user as any)?.data || user;
    const userId = userData?.id || '';

    return (
        <>
            <Head title="Edit User" />
            <Form
                method="put"
                action={`/accounts/users/${userId}`}
                onSuccess={onSuccess || (() => {})}
                preserveScroll
                data={{
                    accountId,
                }}
            >
                {({ processing, errors }) => (
                    <div className="p-0">
                        <div className="mb-6 rounded-lg border border-amber-200 bg-amber-50 p-4">
                            <p className="text-sm text-amber-900">
                                <strong>User ID:</strong> {userId} •{' '}
                                <strong>Account:</strong> {accountName}
                            </p>
                        </div>
                        <div className="mb-6 rounded-lg border border-gray-200 bg-white p-6">
                            <UserInput errors={errors} data={userData} />
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

EditUser.layout = (page: React.ReactNode) => (
    <AppLayout children={page} />
);

export default EditUser;

