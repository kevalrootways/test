import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { Form, Head } from '@inertiajs/react';
import { LoaderCircle, Plus } from 'lucide-react';
import RoleTemplateInput from './input';

interface CreateRoleTemplateProps {
    onSuccess?: () => void;
}

const CreateRoleTemplate = ({ onSuccess }: CreateRoleTemplateProps) => {
    return (
        <>
            <Head title="Create Role Template" />
            <Form
                method="post"
                action="/admin/role-templates"
                onSuccess={onSuccess || (() => {})}
                preserveScroll
            >
                {({ processing, errors }) => (
                    <div className="p-0">
                        <div className="mb-6 rounded-lg border border-gray-200 bg-white p-6">
                            <RoleTemplateInput errors={errors} />
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

