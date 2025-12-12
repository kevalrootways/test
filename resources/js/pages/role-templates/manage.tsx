import RoleTemplateController from '@/actions/App/Http/Controllers/Admin/RoleTemplateController';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { Head, router } from '@inertiajs/react';
import { Check, Copy, Edit, Plus, Shield, Trash2, X } from 'lucide-react';
import { useState } from 'react';
import CreateRoleTemplate from './create';
import EditRoleTemplate from './edit';

interface RoleTemplate {
    id: string;
    name: string;
    description: string;
    permissions: {
        dashboard: boolean;
        products: boolean;
        inventory: boolean;
        orders: boolean;
        accounts: boolean;
        warranty: boolean;
        reports: boolean;
        admin: boolean;
    };
    commissionEnabled: boolean;
    defaultCommission: number;
    isDefault: boolean;
    createdDate: string;
}

interface ManageRoleTemplatesProps {
    templates?: RoleTemplate[] | { data?: RoleTemplate[] };
    totalTemplates?: number;
    defaultTemplates?: number;
    customTemplates?: number;
    availablePermissions?: string[];
}

const ManageRoleTemplates = ({
    templates = [],
    totalTemplates = 0,
    defaultTemplates = 0,
    customTemplates = 0,
    availablePermissions = [],
}: ManageRoleTemplatesProps) => {
    const templatesArray = Array.isArray(templates)
        ? templates
        : templates?.data || [];
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedTemplate, setSelectedTemplate] =
        useState<RoleTemplate | null>(null);

    const getPermissionCount = (template: RoleTemplate) => {
        return Object.values(template.permissions).filter(Boolean).length;
    };

    const handleDuplicateTemplate = (template: RoleTemplate) => {
        // Build permissions object for form submission
        const permissions: Record<string, string> = {};
        Object.keys(template.permissions).forEach((key) => {
            permissions[key] = template.permissions[
                key as keyof typeof template.permissions
            ]
                ? '1'
                : '0';
        });

        // Directly create duplicate record
        router.post(
            RoleTemplateController.store().url,
            {
                name: `${template.name} (Copy)`,
                description: template.description,
                permissions: permissions,
                commissionEnabled: template.commissionEnabled ? '1' : '0',
                defaultCommission: template.defaultCommission || 0,
            },
            {
                preserveScroll: true,
                onSuccess: () => {
                    // Reload to refresh the templates list
                    router.visit(RoleTemplateController.index().url, {
                        only: [
                            'templates',
                            'totalTemplates',
                            'defaultTemplates',
                            'customTemplates',
                        ],
                        preserveScroll: true,
                    });
                },
            },
        );
    };

    const handleDeleteTemplate = (templateId: string, isDefault: boolean) => {
        if (isDefault) {
            alert(
                'Cannot delete default templates. You can edit them instead.',
            );
            return;
        }

        if (
            !confirm(
                'Are you sure you want to delete this role template? This action cannot be undone.',
            )
        ) {
            return;
        }

        router.delete(RoleTemplateController.destroy(templateId).url, {
            preserveScroll: true,
            onSuccess: () => {
                // Reload to refresh the templates list
                router.visit(RoleTemplateController.index().url, {
                    only: [
                        'templates',
                        'totalTemplates',
                        'defaultTemplates',
                        'customTemplates',
                    ],
                    preserveScroll: true,
                });
            },
        });
    };

    const handleCreateSuccess = () => {
        setShowAddModal(false);
        router.reload({
            only: [
                'templates',
                'totalTemplates',
                'defaultTemplates',
                'customTemplates',
            ],
        });
    };

    const handleEditSuccess = () => {
        setShowEditModal(false);
        setSelectedTemplate(null);
        router.reload({
            only: [
                'templates',
                'totalTemplates',
                'defaultTemplates',
                'customTemplates',
            ],
        });
    };

    return (
        <>
            <Head title="Role Templates" />
            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto rounded-xl p-4 md:p-6">
                {/* Header */}
                <div className="mb-6">
                    <h1 className="mb-2 text-gray-900">Role Templates</h1>
                    <p className="text-gray-600">
                        Create and manage reusable role templates with
                        pre-configured permissions and commission settings
                    </p>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                    <div className="rounded-lg border border-gray-200 bg-white p-6">
                        <div className="flex items-center gap-3">
                            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100">
                                <Shield className="h-6 w-6 text-blue-600" />
                            </div>
                            <div>
                                <p className="mb-1 text-sm text-gray-600">
                                    Total Templates
                                </p>
                                <p className="text-gray-900">
                                    {totalTemplates}
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="rounded-lg border border-gray-200 bg-white p-6">
                        <div className="flex items-center gap-3">
                            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-purple-100">
                                <Shield className="h-6 w-6 text-purple-600" />
                            </div>
                            <div>
                                <p className="mb-1 text-sm text-gray-600">
                                    Default Templates
                                </p>
                                <p className="text-gray-900">
                                    {defaultTemplates}
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="rounded-lg border border-gray-200 bg-white p-6">
                        <div className="flex items-center gap-3">
                            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-100">
                                <Shield className="h-6 w-6 text-green-600" />
                            </div>
                            <div>
                                <p className="mb-1 text-sm text-gray-600">
                                    Custom Templates
                                </p>
                                <p className="text-gray-900">
                                    {customTemplates}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Actions */}
                <div className="rounded-lg border border-gray-200 bg-white p-6">
                    <div className="flex items-center justify-between">
                        <p className="text-gray-700">
                            Role templates provide pre-configured permission
                            sets that can be assigned to users. Users can use
                            templates as-is or customize permissions after
                            assignment.
                        </p>
                        <Button
                            onClick={() => setShowAddModal(true)}
                            className="ml-4 bg-blue-600 whitespace-nowrap text-white hover:bg-blue-700"
                        >
                            <Plus className="mr-2 h-4 w-4" />
                            Create Template
                        </Button>
                    </div>
                </div>

                {/* Templates Grid */}
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {templatesArray.length === 0 ? (
                        <div className="col-span-full py-12 text-center text-gray-500">
                            No templates found
                        </div>
                    ) : (
                        templatesArray.map((template) => (
                            <div
                                key={template.id}
                                className="rounded-lg border border-gray-200 bg-white p-6 transition-shadow hover:shadow-md"
                            >
                                {/* Header */}
                                <div className="mb-4 flex items-start justify-between">
                                    <div className="flex-1">
                                        <div className="mb-1 flex items-center gap-2">
                                            <h3 className="text-gray-900">
                                                {template.name}
                                            </h3>
                                            {template.isDefault && (
                                                <span className="rounded bg-purple-100 px-2 py-0.5 text-xs text-purple-700">
                                                    Default
                                                </span>
                                            )}
                                        </div>
                                        <p className="text-sm text-gray-600">
                                            {template.description}
                                        </p>
                                    </div>
                                </div>

                                {/* Permissions Summary */}
                                <div className="mb-4">
                                    <p className="mb-2 text-sm text-gray-600">
                                        Permissions:{' '}
                                        {getPermissionCount(template)} of 8
                                        modules
                                    </p>
                                    <div className="flex flex-wrap gap-1">
                                        {Object.entries(
                                            template.permissions,
                                        ).map(
                                            ([key, value]) =>
                                                value && (
                                                    <span
                                                        key={key}
                                                        className="inline-flex items-center gap-1 rounded bg-green-100 px-2 py-0.5 text-xs text-green-700"
                                                    >
                                                        <Check className="h-3 w-3" />
                                                        {key
                                                            .charAt(0)
                                                            .toUpperCase() +
                                                            key.slice(1)}
                                                    </span>
                                                ),
                                        )}
                                    </div>
                                </div>

                                {/* Commission Info */}
                                <div className="mb-4 rounded-lg bg-gray-50 p-3">
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-gray-600">
                                            Commission:
                                        </span>
                                        <span className="text-gray-900">
                                            {template.commissionEnabled
                                                ? `${template.defaultCommission}%`
                                                : 'Disabled'}
                                        </span>
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="flex items-center gap-2">
                                    <Button
                                        variant="outline"
                                        onClick={() => {
                                            setSelectedTemplate(template);
                                            setShowEditModal(true);
                                        }}
                                        className="flex-1"
                                    >
                                        <Edit className="mr-2 h-4 w-4" />
                                        Edit
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="icon"
                                        onClick={() =>
                                            handleDuplicateTemplate(template)
                                        }
                                        title="Duplicate"
                                    >
                                        <Copy className="h-4 w-4" />
                                    </Button>
                                    {!template.isDefault && (
                                        <Button
                                            variant="outline"
                                            size="icon"
                                            onClick={() =>
                                                handleDeleteTemplate(
                                                    template.id,
                                                    template.isDefault,
                                                )
                                            }
                                            title="Delete"
                                            className="border-red-300 text-red-600 hover:bg-red-50"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    )}
                                </div>

                                {/* Template ID & Date */}
                                <div className="mt-4 flex items-center justify-between border-t border-gray-200 pt-4 text-xs text-gray-500">
                                    <span>{template.id}</span>
                                    <span>Created: {template.createdDate}</span>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* Add Template Modal */}
            {showAddModal && (
                <div className="bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
                    <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-lg bg-white shadow-xl">
                        <div className="flex items-center justify-between border-b border-gray-200 p-6">
                            <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100">
                                    <Shield className="h-5 w-5 text-blue-600" />
                                </div>
                                <h2 className="text-gray-900">
                                    Create Role Template
                                </h2>
                            </div>
                            <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                onClick={() => setShowAddModal(false)}
                                className="h-9 w-9"
                            >
                                <X className="h-5 w-5 text-gray-600" />
                            </Button>
                        </div>

                        <div className="p-6">
                            <CreateRoleTemplate
                                availablePermissions={availablePermissions}
                                onSuccess={handleCreateSuccess}
                            />
                        </div>
                    </div>
                </div>
            )}

            {/* Edit Template Modal */}
            {showEditModal && selectedTemplate && (
                <div className="bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
                    <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-lg bg-white shadow-xl">
                        <div className="flex items-center justify-between border-b border-gray-200 p-6">
                            <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100">
                                    <Shield className="h-5 w-5 text-blue-600" />
                                </div>
                                <div>
                                    <h2 className="text-gray-900">
                                        Edit Role Template
                                    </h2>
                                </div>
                            </div>
                            <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                onClick={() => {
                                    setShowEditModal(false);
                                    setSelectedTemplate(null);
                                }}
                                className="h-9 w-9"
                            >
                                <X className="h-5 w-5 text-gray-600" />
                            </Button>
                        </div>

                        <div className="p-6">
                            <EditRoleTemplate
                                template={selectedTemplate}
                                availablePermissions={availablePermissions}
                                onSuccess={handleEditSuccess}
                            />
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

ManageRoleTemplates.layout = (page: React.ReactNode) => (
    <AppLayout children={page} />
);

export default ManageRoleTemplates;
