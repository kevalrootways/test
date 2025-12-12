import { usePermission } from '@/hooks/usePermission';
import { resolveUrl } from '@/lib/utils';
import { type NavItem } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import React, { useMemo, useState } from 'react';

export function NavMain({ items = [], groups = [] }: { items?: NavItem[]; groups?: { title: string; items: NavItem[] }[] }) {
    const page = usePage();
    const [openItems, setOpenItems] = useState<string[]>([]);
    const { can } = usePermission();

    // Filter items based on permissions
    const filteredItems = useMemo(() => {
        const pageProps = usePage().props as any;
        const auth = pageProps.auth as { permissions?: string[] } | undefined;
        const hasPermissions = auth?.permissions && Array.isArray(auth.permissions) && auth.permissions.length > 0;

        const filterItemsByPermission = (items: NavItem[]): NavItem[] => {
            return items
                .map((item) => {
                    // If item has permission, check if user has that permission
                    if (item.permission) {
                        // If user has no permissions array, show all items (for development)
                        if (!hasPermissions) {
                            // Development mode: show all items
                        } else if (!can(item.permission)) {
                            return null;
                        }
                    }

                    // If item has sub-items, filter them and only show parent if at least one sub-item is visible
                    if (item.items && item.items.length > 0) {
                        const filteredSubItems = filterItemsByPermission(item.items);
                        return filteredSubItems.length > 0 ? { ...item, items: filteredSubItems } : null;
                    }

                    // If no permission required, show the item
                    return item;
                })
                .filter((item): item is NavItem => item !== null);
        };

        return filterItemsByPermission(items);
    }, [items, can]);

    // Initialize open items based on active children
    React.useEffect(() => {
        const getOpenItems = (items: NavItem[]): string[] => {
            const open: string[] = [];
            items.forEach((item) => {
                if (item.items && item.items.some((subItem) => isItemActive(subItem))) {
                    open.push(item.title);
                }
            });
            return open;
        };

        const initiallyOpen = getOpenItems(filteredItems);
        if (initiallyOpen.length > 0) {
            setOpenItems(initiallyOpen);
        }
    }, [filteredItems, page.url]);

    const toggleItem = (title: string) => {
        setOpenItems((prev) => (prev.includes(title) ? prev.filter((item) => item !== title) : [...prev, title]));
    };

    const isItemActive = (item: NavItem): boolean => {
        if (item.href) {
            return page.url.startsWith(typeof item.href === 'string' ? item.href : resolveUrl(item.href));
        }
        if (item.items) {
            return item.items.some((subItem) => isItemActive(subItem));
        }
        return false;
    };

    const renderNavItem = (item: NavItem, level: number = 0) => {
        const paddingLeft = level === 0 ? 'pl-4' : level === 1 ? 'pl-10' : 'pl-16';
        
        if (item.items && item.items.length > 0) {
            const isOpen = openItems.includes(item.title);
            const hasActiveChild = item.items.some((subItem) => isItemActive(subItem));
            const isActive = hasActiveChild;

    return (
                <div key={item.title}>
                    <button
                        onClick={() => toggleItem(item.title)}
                        className={`w-full flex items-center justify-between ${paddingLeft} pr-4 py-3 transition-colors ${
                            isActive 
                                ? 'bg-blue-50 text-blue-600 border-r-4 border-blue-600' 
                                : 'text-gray-700 hover:bg-gray-50'
                        }`}
                    >
                        <div className="flex items-center gap-3 min-w-0">
                            {item.icon && <item.icon className={`flex-shrink-0 ${level === 2 ? 'w-4 h-4' : 'w-5 h-5'}`} />}
                            <span className={`truncate ${level === 2 ? 'text-xs' : 'text-sm'} font-medium`}>{item.title}</span>
                        </div>
                        {isOpen ? (
                            <ChevronDown className="w-4 h-4 flex-shrink-0" />
                        ) : (
                            <ChevronRight className="w-4 h-4 flex-shrink-0" />
                        )}
                    </button>
                    
                    {/* Child items */}
                    {isOpen && (
                        <div className={level === 0 ? 'bg-gray-50' : 'bg-gray-100'}>
                            {item.items.map((subItem) => renderNavItem(subItem, level + 1))}
                        </div>
                    )}
                </div>
            );
        }

        const isActive = isItemActive(item);
        return (
            <div key={item.title}>
                {item.href ? (
                    <Link
                        href={item.href}
                        className={`w-full flex items-center ${paddingLeft} pr-4 py-3 transition-colors ${
                            isActive 
                                ? 'bg-blue-50 text-blue-600 border-r-4 border-blue-600' 
                                : 'text-gray-700 hover:bg-gray-50'
                        }`}
                    >
                        {item.icon && <item.icon className={`flex-shrink-0 ${level === 2 ? 'w-4 h-4' : 'w-5 h-5'}`} />}
                        <span className={`truncate ${level === 0 ? 'ml-3' : 'ml-3'} ${level === 2 ? 'text-xs' : 'text-sm'} font-medium`}>{item.title}</span>
                            </Link>
                ) : (
                    <div className={`w-full flex items-center ${paddingLeft} pr-4 py-3 text-gray-700`}>
                        {item.icon && <item.icon className={`flex-shrink-0 ${level === 2 ? 'w-4 h-4' : 'w-5 h-5'}`} />}
                        <span className={`truncate ml-3 ${level === 2 ? 'text-xs' : 'text-sm'} font-medium`}>{item.title}</span>
                    </div>
                )}
            </div>
        );
    };

    // If groups are provided, render them; otherwise render single group
    if (groups.length > 0) {
        return (
            <>
                {groups.map((group, index) => {
                    const filteredGroupItems = useMemo(() => {
                        const pageProps = usePage().props as any;
                        const auth = pageProps.auth as { permissions?: string[] } | undefined;
                        const hasPermissions = auth?.permissions && Array.isArray(auth.permissions) && auth.permissions.length > 0;

                        const filterItemsByPermission = (items: NavItem[]): NavItem[] => {
                            return items
                                .map((item) => {
                                    // If item has permission, check if user has that permission
                                    if (item.permission) {
                                        // If user has no permissions array, show all items (for development)
                                        if (!hasPermissions) {
                                            // Development mode: show all items
                                        } else if (!can(item.permission)) {
                                            return null;
                                        }
                                    }

                                    // If item has sub-items, filter them and only show parent if at least one sub-item is visible
                                    if (item.items && item.items.length > 0) {
                                        const filteredSubItems = filterItemsByPermission(item.items);
                                        return filteredSubItems.length > 0 ? { ...item, items: filteredSubItems } : null;
                                    }

                                    // If no permission required, show the item
                                    return item;
                                })
                                .filter((item): item is NavItem => item !== null);
                        };

                        // If no permissions, show all items for development
                        if (!hasPermissions) {
                            return group.items;
                        }
                        return filterItemsByPermission(group.items);
                    }, [group.items, can]);

                    return (
                        <nav key={index} className="flex flex-col">
                            {filteredGroupItems.map((item) => renderNavItem(item))}
                        </nav>
                    );
                })}
            </>
        );
    }

    return (
        <nav className="flex flex-col">
            {filteredItems.map((item) => renderNavItem(item))}
        </nav>
    );
}
