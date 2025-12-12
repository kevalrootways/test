import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { Form, Head } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import RoleTemplateInput from './input';

interface EditRoleTemplateProps {
    template?: {
        id?: string;
        name?: string;
        description?: string;
        permissions?: {
            dashboard?: boolean;
            products?: boolean;
            inventory?: boolean;
            orders?: boolean;
            accounts?: boolean;
            warranty?: boolean;
            reports?: boolean;
            admin?: boolean;
        };
        commissionEnabled?: boolean;
        defaultCommission?: number;
        isDefault?: boolean;
        createdDate?: string;
    };
    onSuccess?: () => void;
}

const EditRoleTemplate = ({
    template,
    onSuccess,
}: EditRoleTemplateProps) => {
    const templateData = (template as any)?.data || template;
    const templateId = templateData?.id || '';

    return (
        <>
            <Head title="Edit Role Template" />
            <Form
                method="put"
                action={`/admin/role-templates/${templateId}`}
                onSuccess={onSuccess || (() => {})}
                preserveScroll
            >
                {({ processing, errors }) => (
                    <div className="p-0">
                        <div className="mb-6 rounded-lg border border-gray-200 bg-white p-6">
                            <RoleTemplateInput
                                errors={errors}
                                data={templateData}
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

