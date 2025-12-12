import RoleTemplateController from '@/actions/App/Http/Controllers/Admin/RoleTemplateController';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { Form, Head, router } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import RoleTemplateInput from './input';

interface EditRoleTemplateProps {
    template?: {
        id?: string;
        name?: string;
        description?: string;
        permissions?: Record<string, boolean>;
        commissionEnabled?: boolean;
        defaultCommission?: number;
        isDefault?: boolean;
        createdDate?: string;
    };
    availablePermissions?: string[];
    onSuccess?: () => void;
}

const EditRoleTemplate = ({
    template,
    availablePermissions = [],
    onSuccess,
}: EditRoleTemplateProps) => {
    const templateData = template;
    const templateId = templateData?.id || '';
    const initialPermissions: Record<string, boolean> = {};
    availablePermissions.forEach((perm) => {
        initialPermissions[perm] =
            templateData?.permissions?.[perm] ?? perm === 'dashboard';
    });

    return (
        <>
            <Head title="Edit Role Template" />
            <Form
                {...RoleTemplateController.update.form({ template: templateId })}
                data={{
                    name: templateData?.name || '',
                    description: templateData?.description || '',
                    permissions: initialPermissions,
                    commissionEnabled: templateData?.commissionEnabled || false,
                    defaultCommission: templateData?.defaultCommission || 0,
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
                                data={templateData}
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
                                {processing && (
                                    <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                                )}
                                Update Template
                            </Button>
                        </div>
                    </div>
                )}
            </Form>
        </>
    );
};

EditRoleTemplate.layout = (page: React.ReactNode) => (
    <AppLayout children={page} />
);

export default EditRoleTemplate;
