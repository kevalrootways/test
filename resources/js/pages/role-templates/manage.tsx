import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { Head, router } from '@inertiajs/react';
import {
    Check,
    Copy,
    Edit,
    Plus,
    Shield,
    Trash2,
    X,
} from 'lucide-react';
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
    templates?: RoleTemplate[];
    totalTemplates?: number;
    defaultTemplates?: number;
    customTemplates?: number;
}

const ManageRoleTemplates = ({
    templates = [],
    totalTemplates = 0,
    defaultTemplates = 0,
    customTemplates = 0,
}: ManageRoleTemplatesProps) => {
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedTemplate, setSelectedTemplate] =
        useState<RoleTemplate | null>(null);

    const getPermissionCount = (template: RoleTemplate) => {
        return Object.values(template.permissions).filter(Boolean).length;
    };

    const handleDuplicateTemplate = (template: RoleTemplate) => {
        // Navigate to create page with template data
        router.visit('/admin/role-templates/create', {
            data: {
                name: `${template.name} (Copy)`,
                description: template.description,
                permissions: template.permissions,
                commissionEnabled: template.commissionEnabled,
                defaultCommission: template.defaultCommission,
            },
        });
    };

    const handleDeleteTemplate = (templateId: string, isDefault: boolean) => {
        if (isDefault) {
            alert('Cannot delete default templates. You can edit them instead.');
            return;
        }

        if (
            !confirm(
                'Are you sure you want to delete this role template? This action cannot be undone.',
            )
        ) {
            return;
        }

        router.delete(`/admin/role-templates/${templateId}`, {
            preserveScroll: true,
            onSuccess: () => {
                // Template will be refreshed from server
            },
        });
    };

    return (
        <>
            <Head title="Role Templates" />
            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto rounded-xl p-4 md:p-6">
                {/* Header */}
                <div className="mb-6">
                    <h1 className="text-gray-900 mb-2">Role Templates</h1>
                    <p className="text-gray-600">
                        Create and manage reusable role templates with
                        pre-configured permissions and commission settings
                    </p>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white rounded-lg border border-gray-200 p-6">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                                <Shield className="w-6 h-6 text-blue-600" />
                            </div>
                            <div>
                                <p className="text-gray-600 text-sm mb-1">
                                    Total Templates
                                </p>
                                <p className="text-gray-900">{totalTemplates}</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-lg border border-gray-200 p-6">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                                <Shield className="w-6 h-6 text-purple-600" />
                            </div>
                            <div>
                                <p className="text-gray-600 text-sm mb-1">
                                    Default Templates
                                </p>
                                <p className="text-gray-900">
                                    {defaultTemplates}
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-lg border border-gray-200 p-6">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                                <Shield className="w-6 h-6 text-green-600" />
                            </div>
                            <div>
                                <p className="text-gray-600 text-sm mb-1">
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
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                    <div className="flex items-center justify-between">
                        <p className="text-gray-700">
                            Role templates provide pre-configured permission sets
                            that can be assigned to users. Users can use
                            templates as-is or customize permissions after
                            assignment.
                        </p>
                        <Button
                            onClick={() => setShowAddModal(true)}
                            className="bg-blue-600 text-white hover:bg-blue-700 whitespace-nowrap ml-4"
                        >
                            <Plus className="w-4 h-4 mr-2" />
                            Create Template
                        </Button>
                    </div>
                </div>

                {/* Templates Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {templates.length === 0 ? (
                        <div className="col-span-full text-center py-12 text-gray-500">
                            No templates found
                        </div>
                    ) : (
                        templates.map((template) => (
                            <div
                                key={template.id}
                                className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow"
                            >
                                {/* Header */}
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-1">
                                            <h3 className="text-gray-900">
                                                {template.name}
                                            </h3>
                                            {template.isDefault && (
                                                <span className="px-2 py-0.5 bg-purple-100 text-purple-700 rounded text-xs">
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
                                    <p className="text-sm text-gray-600 mb-2">
                                        Permissions:{' '}
                                        {getPermissionCount(template)} of 8
                                        modules
                                    </p>
                                    <div className="flex flex-wrap gap-1">
                                        {Object.entries(template.permissions).map(
                                            ([key, value]) =>
                                                value && (
                                                    <span
                                                        key={key}
                                                        className="inline-flex items-center gap-1 px-2 py-0.5 bg-green-100 text-green-700 rounded text-xs"
                                                    >
                                                        <Check className="w-3 h-3" />
                                                        {key.charAt(0).toUpperCase() +
                                                            key.slice(1)}
                                                    </span>
                                                ),
                                        )}
                                    </div>
                                </div>

                                {/* Commission Info */}
                                <div className="mb-4 p-3 bg-gray-50 rounded-lg">
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
                                        <Edit className="w-4 h-4 mr-2" />
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
                                        <Copy className="w-4 h-4" />
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
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    )}
                                </div>

                                {/* Template ID & Date */}
                                <div className="mt-4 pt-4 border-t border-gray-200 flex items-center justify-between text-xs text-gray-500">
                                    <span>{template.id}</span>
                                    <span>
                                        Created: {template.createdDate}
                                    </span>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* Add Template Modal */}
            {showAddModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between p-6 border-b border-gray-200">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                    <Shield className="w-5 h-5 text-blue-600" />
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
                                <X className="w-5 h-5 text-gray-600" />
                            </Button>
                        </div>

                        <div className="p-6">
                            <CreateRoleTemplate
                                onSuccess={() => setShowAddModal(false)}
                            />
                        </div>
                    </div>
                </div>
            )}

            {/* Edit Template Modal */}
            {showEditModal && selectedTemplate && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between p-6 border-b border-gray-200">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                    <Shield className="w-5 h-5 text-blue-600" />
                                </div>
                                <div>
                                    <h2 className="text-gray-900">
                                        Edit Role Template
                                    </h2>
                                    <p className="text-sm text-gray-600">
                                        {selectedTemplate.id}
                                    </p>
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
                                <X className="w-5 h-5 text-gray-600" />
                            </Button>
                        </div>

                        <div className="p-6">
                            <EditRoleTemplate
                                template={selectedTemplate}
                                onSuccess={() => {
                                    setShowEditModal(false);
                                    setSelectedTemplate(null);
                                }}
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

