'use client';

import { OrigamiSidebar } from '@/components/ui/origami/origami-sidebar';
import { ShatterBackground } from '@/components/ui/shatter-background';
import { usePathname } from 'next/navigation';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();

    // Check if we are on an event detail page (but not the list page)
    // pattern: /dashboard/events/[slug] (and sub-routes like roadmap)
    // list page is: /dashboard/events
    const isEventDetailPage = pathname?.includes('/dashboard/events/') && pathname !== '/dashboard/events';

    return (
        <div className="min-h-screen text-[#E8EAED] font-sans relative bg-[#202124]">

            {/* Animated Background Layer */}
            <ShatterBackground />

            {/* Hide Sidebar on Event Detail Pages */}
            {!isEventDetailPage && <OrigamiSidebar />}

            {/* Main Content Area - Remove padding if full screen */}
            <main className={`relative z-10 px-6 py-10 min-h-screen ${!isEventDetailPage ? 'md:pl-[332px]' : ''}`}>
                <div className={`${!isEventDetailPage ? 'max-w-7xl mx-auto' : ''}`}>
                    {children}
                </div>
            </main>
        </div>
    );
}
