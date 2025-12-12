import { NavMain } from '@/components/nav-main';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarTrigger,
} from '@/components/ui/sidebar';
import { dashboard } from '@/routes';
import { type NavItem } from '@/types';
import { Link } from '@inertiajs/react';
import {
    BarChart3,
    Database,
    FileText,
    LayoutDashboard,
    Menu,
    Package,
    Search,
    Settings,
    Shield,
    ShoppingCart,
    Store,
    UserCheck,
    Users,
    Wrench,
} from 'lucide-react';
import AppLogo from './app-logo';

const mainNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: dashboard(),
        icon: LayoutDashboard,
    },
    {
        title: 'Accounts',
        href: '/accounts',
        icon: Users,
        permission: 'view-accounts',
    },
    {
        title: 'Orders',
        href: '/orders',
        icon: ShoppingCart,
        permission: 'view-orders',
    },
    {
        title: 'Inventory',
        href: '/inventory',
        icon: Package,
        permission: 'view-inventory',
    },
    {
        title: 'Warranty',
        href: '/warranty',
        icon: Shield,
        permission: 'view-warranty',
    },
    {
        title: 'Reports',
        href: '/reports',
        icon: BarChart3,
        permission: 'view-reports',
    },
    {
        title: 'Administration',
        icon: Settings,
        permission: 'view-admin',
        items: [
            {
                title: 'Users & Roles',
                icon: Users,
                permission: 'view-admin',
                items: [
                    {
                        title: 'User Management',
                        href: '/admin/users',
                        icon: Users,
                        permission: 'view-users',
                    },
                    {
                        title: 'Role Templates',
                        href: '/admin/role-templates',
                        icon: UserCheck,
                        permission: 'view-roles',
                    },
                    {
                        title: 'Sales Teams',
                        href: '/admin/sales-teams',
                        icon: Users,
                        permission: 'view-sales-teams',
                    },
                    {
                        title: 'Commission Reports',
                        href: '/admin/commissions',
                        icon: BarChart3,
                        permission: 'view-commissions',
                    },
                ],
            },
            {
                title: 'API Setups',
                icon: Settings,
                permission: 'view-admin',
                items: [
                    {
                        title: 'Device ID Search',
                        href: '/admin/api/device-search',
                        icon: Search,
                        permission: 'view-api',
                    },
                    {
                        title: 'Update Inventory',
                        href: '/admin/api/inventory-update',
                        icon: Database,
                        permission: 'view-api',
                    },
                    {
                        title: 'API Reports',
                        href: '/admin/api/reports',
                        icon: FileText,
                        permission: 'view-api',
                    },
                ],
            },
            {
                title: 'Setup',
                icon: Wrench,
                permission: 'view-admin',
                items: [
                    {
                        title: 'Login Page',
                        href: '/admin/setup/login-page',
                        icon: Settings,
                        permission: 'view-setup',
                    },
                    {
                        title: 'Customer Groups',
                        href: '/admin/setup/customer-groups',
                        icon: Users,
                        permission: 'view-setup',
                    },
                    {
                        title: 'Products',
                        href: '/admin/setup/products',
                        icon: Package,
                        permission: 'view-setup',
                    },
                    {
                        title: 'Warranty',
                        href: '/admin/setup/warranty',
                        icon: Shield,
                        permission: 'view-setup',
                    },
                    {
                        title: 'Featured Products',
                        href: '/admin/setup/storefront-products',
                        icon: Package,
                        permission: 'view-setup',
                    },
                    {
                        title: 'Stores',
                        href: '/admin/setup/stores',
                        icon: Store,
                        permission: 'view-setup',
                    },
                    {
                        title: 'KYCS News',
                        href: '/admin/setup/kycs-news',
                        icon: FileText,
                        permission: 'view-setup',
                    },
                    {
                        title: 'Dashboard Customization',
                        href: '/admin/setup/dashboard-customization',
                        icon: LayoutDashboard,
                        permission: 'view-setup',
                    },
                    {
                        title: 'System Flow',
                        href: '/admin/setup/flow-diagram',
                        icon: Settings,
                        permission: 'view-setup',
                    },
                    {
                        title: 'Account Types',
                        href: '/admin/setup/account-types',
                        icon: Users,
                        permission: 'view-setup',
                    },
                ],
            },
        ],
    },
];

const footerNavItems: NavItem[] = [];

export function AppSidebar() {
    return (
        <Sidebar
            collapsible="icon"
            variant="inset"
            className="border-r border-gray-200 bg-white"
        >
            <SidebarHeader className="border-b border-gray-200 p-6">
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild className="p-0">
                            <Link href={dashboard()} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent className="py-4">
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter className="border-t border-gray-200 p-3">
                {/* Collapse Toggle Button */}
                <SidebarTrigger className="flex w-full items-center justify-center rounded-lg p-2 text-gray-600 transition-colors hover:bg-gray-50">
                    <Menu className="h-5 w-5" />
                </SidebarTrigger>
            </SidebarFooter>
        </Sidebar>
    );
}
