import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { AdminLayoutClient } from './admin-layout-client';
import { ShieldAlert } from 'lucide-react';
import Link from 'next/link';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
    const session = await auth();
    const userRole = session?.user?.role;
    const adminRoles = ['convener', 'deputy_convener', 'core_member'];

    if (!userRole || !adminRoles.includes(userRole)) {
        // If the user thinks they should be here, let's show them why they aren't.
        return (
            <div className="min-h-screen bg-[#202124] flex items-center justify-center p-4 font-sans text-[#E8EAED]">
                <div className="max-w-md w-full border-4 border-shatter-pink bg-[#303134] p-8 shadow-[8px_8px_0px_#FF2E63] text-center space-y-6">
                    <ShieldAlert className="size-20 text-shatter-pink mx-auto animate-pulse" />

                    <div>
                        <h1 className="text-3xl font-black uppercase italic tracking-tighter mb-2">Access Denied</h1>
                        <p className="text-gray-400 font-bold uppercase tracking-widest">Insufficient Privileges</p>
                    </div>

                    <div className="bg-black/30 p-4 border border-white/10 text-left space-y-2 font-mono text-sm">
                        <div className="flex justify-between">
                            <span className="text-gray-500">User ID:</span>
                            <span className="text-white truncate max-w-[150px]">{session?.user?.id || 'Not Signed In'}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-500">Current Role:</span>
                            <span className="text-shatter-yellow">{userRole || 'NULL'}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-500">Required:</span>
                            <span className="text-green-400">ADMIN_TIER</span>
                        </div>
                    </div>

                    <Link href="/dashboard" className="block w-full py-4 bg-white text-black font-black uppercase tracking-widest hover:bg-shatter-yellow transition-colors border-2 border-transparent hover:border-black">
                        Return to Safety
                    </Link>
                </div>
            </div>
        );
    }

    return <AdminLayoutClient>{children}</AdminLayoutClient>;
}
