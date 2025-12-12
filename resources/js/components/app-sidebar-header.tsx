import { SidebarTrigger } from '@/components/ui/sidebar';

export function AppSidebarHeader() {
    return (
        <header className="flex h-16 shrink-0 items-center gap-2 border-b border-gray-200 px-4 md:px-6 transition-[width,height] ease-linear bg-white">
            <div className="flex items-center gap-2">
                <SidebarTrigger className="-ml-1 text-gray-600 hover:text-gray-900" />
            </div>
        </header>
    );
}
