import RoleTemplateController from '@/actions/App/Http/Controllers/Admin/RoleTemplateController';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { Form, Head, router } from '@inertiajs/react';
import { LoaderCircle, Plus } from 'lucide-react';
import RoleTemplateInput from './input';

interface CreateRoleTemplateProps {
    availablePermissions?: string[];
    onSuccess?: () => void;
}

const CreateRoleTemplate = ({ availablePermissions = [], onSuccess }: CreateRoleTemplateProps) => {
    // Build initial permissions object dynamically
    const initialPermissions: Record<string, boolean> = {};
    availablePermissions.forEach((perm) => {
        // Dashboard is enabled by default, others are false
        initialPermissions[perm] = perm === 'dashboard';
    });

    return (
        <>
            <Head title="Create Role Template" />
            <Form
                {...RoleTemplateController.store.form()}
                data={{
                    name: '',
                    description: '',
                    permissions: initialPermissions,
                    commissionEnabled: false,
                    defaultCommission: 0,
                }}
                onSuccess={() => {
                    if (onSuccess) {
                        onSuccess();
                    } else {
                        router.visit(RoleTemplateController.index().url);
                    }
                }}
            >
                {({ processing, errors }) => (
                    <div className="p-0">
                        <div className="mb-6 rounded-lg border border-gray-200 bg-white p-6">
                            <RoleTemplateInput 
                                errors={errors} 
                                availablePermissions={availablePermissions}
                            />
                        </div>
                        <div className="flex justify-end gap-3 border-t border-gray-200 pt-4">
                            {onSuccess && (
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={onSuccess}
                                >
                                    Cancel
                                </Button>
                            )}
                            <Button type="submit" disabled={processing} className="bg-blue-600 text-white hover:bg-blue-700">
                                {processing && <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />}
                                <Plus className="mr-2 h-4 w-4" />
                                Create Template
                            </Button>
                        </div>
                    </div>
                )}
            </Form>
        </>
    );
};

CreateRoleTemplate.layout = (page: React.ReactNode) => (
    <AppLayout children={page} />
);

export default CreateRoleTemplate;
