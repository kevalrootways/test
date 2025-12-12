import { AppContent } from '@/components/app-content';
import { AppHeader } from '@/components/app-header';
import { AppShell } from '@/components/app-shell';
import { AppSidebar } from '@/components/app-sidebar';
import { MobileMenuButton } from '@/components/mobile-menu-button';
import { type PropsWithChildren } from 'react';

export default function AppSidebarLayout({
    children,
}: PropsWithChildren) {
    return (
        <AppShell variant="sidebar">
            <AppSidebar />
            <AppContent variant="sidebar" className="overflow-x-hidden flex flex-col">
                <AppHeader />
                <div className="flex-1 overflow-y-auto">
                    {children}
                </div>
            </AppContent>
            <MobileMenuButton />
        </AppShell>
    );
}
