import { useSidebar } from '@/components/ui/sidebar';
import { useIsMobile } from '@/hooks/use-mobile';
import { Menu } from 'lucide-react';

export function MobileMenuButton() {
    const { setOpenMobile } = useSidebar();
    const isMobile = useIsMobile();

    if (!isMobile) {
        return null;
    }

    return (
        <button
            onClick={() => setOpenMobile(true)}
            className="md:hidden fixed bottom-6 right-6 z-50 w-14 h-14 bg-blue-600 text-white rounded-full shadow-lg flex items-center justify-center hover:bg-blue-700 transition-colors"
            aria-label="Open menu"
        >
            <Menu className="w-6 h-6" />
        </button>
    );
}

