import { Link } from '@inertiajs/react';
import { ChevronDown, Edit, Eye, Trash } from 'lucide-react';
import React, { useState } from 'react';
import { Button } from '../ui/button';
import { DeleteConfirmationDialog } from '../ui/delete-confirmation-dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../ui/dropdown-menu';

const ActionLinks = ({
    view_props,
    edit_props,
    delete_props,
    children = null,
}: {
    view_props: object | null;
    edit_props: object | null;
    delete_props: object | null;
    children?: React.ReactNode | null;
}) => {
    const [open, setOpen] = useState(false);
    const [alertOpen, setAlertOpen] = useState(false);

    const handleDeleteConfirm = (e: React.MouseEvent) => {
        // Call the original onClick if it exists
        if (delete_props?.onClick) {
            delete_props.onClick(e);
        }
        // Close both dialogs after the action
        setAlertOpen(false);
        setOpen(false);
    };

    return (
        <DropdownMenu open={open} onOpenChange={setOpen}>
            <DropdownMenuTrigger asChild>
                <Button className="h-8 w-8 p-0">
                    <span className="sr-only">Open menu</span>
                    <ChevronDown className="h-4 w-4" />
                </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end">
                {/* View link */}
                {view_props && (
                    <DropdownMenuItem asChild className="hover:cursor-pointer hover:bg-gray-100">
                        <Link {...view_props} onClick={() => setOpen(false)}>
                            <Eye size={16} className="me-2" />
                            View
                        </Link>
                    </DropdownMenuItem>
                )}
                {/* Edit link */}
                {edit_props && (
                    <DropdownMenuItem 
                        className="hover:cursor-pointer hover:bg-gray-100 p-0"
                        onSelect={(e) => {
                            // Prevent default dropdown behavior
                            e.preventDefault();
                        }}
                    >
                        {(edit_props as any).href ? (
                            <Link 
                                {...edit_props} 
                                onClick={(e) => {
                                    setOpen(false);
                                    if ((edit_props as any).onClick) {
                                        (edit_props as any).onClick(e);
                                    }
                                }}
                                className="flex w-full items-center px-2 py-1.5"
                            >
                                <Edit size={16} className="me-2" />
                                Edit
                            </Link>
                        ) : (
                            <button
                                type="button"
                                onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    setOpen(false);
                                    if ((edit_props as any).onClick) {
                                        (edit_props as any).onClick(e);
                                    }
                                }}
                                className="flex w-full items-center px-2 py-1.5 text-left"
                            >
                                <Edit size={16} className="me-2" />
                                Edit
                            </button>
                        )}
                    </DropdownMenuItem>
                )}
                {/* Delete link */}
                {delete_props && (
                    <DeleteConfirmationDialog
                        open={alertOpen}
                        onOpenChange={setAlertOpen}
                        onConfirm={handleDeleteConfirm}
                        description="This action cannot be undone. This will permanently delete this record from the system."
                        trigger={
                            <DropdownMenuItem
                                onSelect={(e) => {
                                    e.preventDefault();
                                    setAlertOpen(true);
                                }}
                                className="hover:cursor-pointer hover:bg-gray-100"
                            >
                                <Trash size={16} className="me-2" />
                                Delete
                            </DropdownMenuItem>
                        }
                    />
                )}
                {children}
            </DropdownMenuContent>
        </DropdownMenu>
    );
};

export default ActionLinks;

