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
        permission: 'accounts',
    },
    {
        title: 'Orders',
        href: '/orders',
        icon: ShoppingCart,
        permission: 'orders',
    },
    {
        title: 'Inventory',
        href: '/inventory',
        icon: Package,
        permission: 'inventory',
    },
    {
        title: 'Warranty',
        href: '/warranty',
        icon: Shield,
        permission: 'warranty',
    },
    {
        title: 'Reports',
        href: '/reports',
        icon: BarChart3,
        permission: 'reports',
    },
    {
        title: 'Administration',
        icon: Settings,
        permission: 'admin',
        items: [
            {
                title: 'Users & Roles',
                icon: Users,
                permission: 'admin',
                items: [
                    {
                        title: 'User Management',
                        href: '/admin/users',
                        icon: Users,
                        permission: 'admin',
                    },
                    {
                        title: 'Role Templates',
                        href: '/admin/role-templates',
                        icon: UserCheck,
                        permission: 'admin',
                    },
                    {
                        title: 'Sales Teams',
                        href: '/admin/sales-teams',
                        icon: Users,
                        permission: 'admin',
                    },
                    {
                        title: 'Commission Reports',
                        href: '/admin/commissions',
                        icon: BarChart3,
                        permission: 'admin',
                    },
                ],
            },
            {
                title: 'API Setups',
                icon: Settings,
                permission: 'admin',
                items: [
                    {
                        title: 'Device ID Search',
                        href: '/admin/api/device-search',
                        icon: Search,
                        permission: 'admin',
                    },
                    {
                        title: 'Update Inventory',
                        href: '/admin/api/inventory-update',
                        icon: Database,
                        permission: 'admin',
                    },
                    {
                        title: 'API Reports',
                        href: '/admin/api/reports',
                        icon: FileText,
                        permission: 'admin',
                    },
                ],
            },
            {
                title: 'Setup',
                icon: Wrench,
                permission: 'admin',
                items: [
                    {
                        title: 'Login Page',
                        href: '/admin/setup/login-page',
                        icon: Settings,
                        permission: 'admin',
                    },
                    {
                        title: 'Customer Groups',
                        href: '/admin/setup/customer-groups',
                        icon: Users,
                        permission: 'admin',
                    },
                    {
                        title: 'Products',
                        href: '/admin/setup/products',
                        icon: Package,
                        permission: 'admin',
                    },
                    {
                        title: 'Warranty',
                        href: '/admin/setup/warranty',
                        icon: Shield,
                        permission: 'admin',
                    },
                    {
                        title: 'Featured Products',
                        href: '/admin/setup/storefront-products',
                        icon: Package,
                        permission: 'admin',
                    },
                    {
                        title: 'Stores',
                        href: '/admin/setup/stores',
                        icon: Store,
                        permission: 'admin',
                    },
                    {
                        title: 'KYCS News',
                        href: '/admin/setup/kycs-news',
                        icon: FileText,
                        permission: 'admin',
                    },
                    {
                        title: 'Dashboard Customization',
                        href: '/admin/setup/dashboard-customization',
                        icon: LayoutDashboard,
                        permission: 'admin',
                    },
                    {
                        title: 'System Flow',
                        href: '/admin/setup/flow-diagram',
                        icon: Settings,
                        permission: 'admin',
                    },
                    {
                        title: 'Account Types',
                        href: '/admin/setup/account-types',
                        icon: Users,
                        permission: 'admin',
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
