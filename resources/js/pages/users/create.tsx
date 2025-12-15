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

interface CreateUserProps {
    roles?: string[];
    permissions?: Permission[];
    availableAccounts?: Array<{ id: string; name: string; type: string }>;
    onSuccess?: () => void;
}

const CreateUser = ({
    roles = [],
    permissions = [],
    availableAccounts = [],
    onSuccess,
}: CreateUserProps) => {
    return (
        <>
            <Head title="Create User" />
            <Form 
                method="post" 
                action="/admin/users" 
                onSuccess={onSuccess}
                preserveScroll
            >
                {({ processing, errors }) => (
                    <div>
                        <UserInput
                            errors={errors}
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
                                Create User
                            </Button>
                        </div>
                    </div>
                )}
            </Form>
        </>
    );
};

CreateUser.layout = (page: React.ReactNode) => <AppLayout children={page} />;

export default CreateUser;
