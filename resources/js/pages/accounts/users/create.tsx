import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { Form, Head } from '@inertiajs/react';
import { LoaderCircle, UserPlus } from 'lucide-react';
import UserInput from './input';

interface CreateUserProps {
    accountId: string;
    accountName: string;
    onSuccess?: () => void;
}

const CreateUser = ({
    accountId,
    accountName,
    onSuccess,
}: CreateUserProps) => {
    return (
        <>
            <Head title="Create User" />
            <Form
                method="post"
                action="/accounts/users"
                onSuccess={onSuccess || (() => {})}
                preserveScroll
                data={{
                    accountId,
                }}
            >
                {({ processing, errors }) => (
                    <div className="p-0">
                        <div className="mb-6 rounded-lg border border-gray-200 bg-white p-6">
                            <UserInput errors={errors} />
                        </div>
                        <div className="mb-6 rounded-lg border border-blue-200 bg-blue-50 p-4">
                            <p className="text-sm text-blue-900">
                                <strong>Note:</strong> This user will be
                                automatically assigned to{' '}
                                <strong>{accountName}</strong> and will have
                                access to the customer portal only.
                            </p>
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
                                <UserPlus className="mr-2 h-4 w-4" />
                                Create User
                            </Button>
                        </div>
                    </div>
                )}
            </Form>
        </>
    );
};

CreateUser.layout = (page: React.ReactNode) => (
    <AppLayout children={page} />
);

export default CreateUser;

