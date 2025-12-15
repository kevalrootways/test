import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { Form, Head, usePage } from '@inertiajs/react';
import { LoaderCircle, UserPlus } from 'lucide-react';
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

const CreateUser = (props: CreateUserProps & { onSuccess?: () => void }) => {
    const { props: pageProps } = usePage();
    const inertiaProps = pageProps as any;
    const roles = props.roles || inertiaProps.roles || [];
    const permissions = props.permissions || inertiaProps.permissions || [];
    const availableAccounts =
        props.availableAccounts || inertiaProps.availableAccounts || [];
    const onSuccess = props.onSuccess;
    return (
        <>
            <Head title="Create User" />
            <Form
                method="post"
                action="/admin/users"
                onSuccess={onSuccess || (() => {})}
                preserveScroll
            >
                {({ processing, errors }) => (
                    <div className="p-0">
                        <div className="mb-6 rounded-lg border border-gray-200 bg-white p-6">
                            <UserInput
                                errors={errors}
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

CreateUser.layout = (page: React.ReactNode) => <AppLayout children={page} />;

export default CreateUser;
