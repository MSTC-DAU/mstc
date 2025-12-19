import { getAdminStats } from "@/lib/data-fetching";
import { FoldCard } from "@/components/ui/origami/fold-card";
import { Users, Calendar, Trophy, Activity, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export const dynamic = 'force-dynamic';

export default async function AdminDashboard() {
    const session = await auth();
    console.log("AdminDashboard Session:", JSON.stringify(session, null, 2));

    const userRole = session?.user?.role;
    const adminRoles = ['convener', 'deputy_convener', 'core_member'];

    console.log("AdminDashboard Check:", { userRole, adminRoles, allowed: userRole && adminRoles.includes(userRole) });

    if (!userRole || !adminRoles.includes(userRole)) {
        console.log("AdminDashboard: Access Denied. Redirecting to /dashboard");
        redirect('/dashboard');
    }

    const stats = await getAdminStats();

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 font-sans">
            {/* Header */}
            <div className="flex items-end justify-between pb-6 border-b-4 border-black bg-[#303134]/50 backdrop-blur-sm p-6">
                <div>
                    <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter text-[#E8EAED] italic leading-none mb-2">
                        System <span className="text-shatter-yellow">Overview</span>
                    </h1>
                    <p className="text-[#9AA0A6] font-mono text-sm font-bold uppercase tracking-widest">
                        Global control center // <span className="text-green-400">ONLINE</span>
                    </p>
                </div>
                <div className="hidden md:block">
                    <div className="bg-black text-white px-4 py-2 font-black transform skew-x-[-12deg] border-2 border-white/20">
                        ADMIN_MODE_ACTIVE
                    </div>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <AdminStatCard title="Total Users" value={stats.totalUsers.toString()} icon={Users} accent="blue" />
                <AdminStatCard title="Active Events" value={stats.activeEvents.toString()} icon={Activity} accent="flame" />
                <AdminStatCard title="Total Registrations" value={stats.totalRegistrations.toString()} icon={Calendar} accent="void" />
                <AdminStatCard title="Pending Approvals" value={stats.pendingApprovals.toString()} icon={AlertCircle} accent="flame" />
            </div>

            {/* Charts Placeholder - Future Expansion */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="border-4 border-black bg-[#303134] h-96 p-8 flex items-center justify-center relative overflow-hidden group">
                    <div className="absolute inset-0 bg-shatter-pattern opacity-10" />
                    <div className="text-center z-10">
                        <Activity className="size-16 text-[#9AA0A6] mx-auto mb-4 opacity-50" />
                        <h3 className="text-2xl font-black text-[#E8EAED] uppercase italic">Traffic Analytics</h3>
                        <p className="text-[#9AA0A6] font-bold">Module Offline. Connect Analytics Provider.</p>
                    </div>
                </div>

                <div className="border-4 border-black bg-[#303134] h-96 p-8 flex items-center justify-center relative overflow-hidden group">
                    <div className="absolute inset-0 bg-shatter-pattern opacity-10" />
                    <div className="text-center z-10">
                        <Trophy className="size-16 text-[#9AA0A6] mx-auto mb-4 opacity-50" />
                        <h3 className="text-2xl font-black text-[#E8EAED] uppercase italic">Engagement Metrics</h3>
                        <p className="text-[#9AA0A6] font-bold">Module Offline. Connect Analytics Provider.</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

function AdminStatCard({ title, value, icon: Icon, accent }: { title: string, value: string, icon: any, accent: 'flame' | 'blue' | 'void' }) {
    return (
        <FoldCard accent={accent} className="p-6 flex items-center justify-between group cursor-default h-32 hover:bg-black hover:text-[#E8EAED] transition-colors duration-300">
            <div className="relative z-10">
                <p className="text-xs font-black text-[#9AA0A6] uppercase tracking-widest mb-1 group-hover:text-shatter-yellow transition-colors">{title}</p>
                <p className="text-4xl font-black text-[#E8EAED] italic group-hover:text-white transition-colors">{value}</p>
            </div>
            <div className={cn(
                "relative z-10 p-3 border-4 border-black shadow-[4px_4px_0px_black] group-hover:shadow-[4px_4px_0px_white] group-hover:border-white transition-all transform group-hover:rotate-12",
                accent === 'flame' ? "bg-shatter-pink text-white" :
                    accent === 'blue' ? "bg-shatter-yellow text-black" : "bg-[#303134] text-[#E8EAED]"
            )}>
                <Icon className="size-6" />
            </div>
        </FoldCard>
    );
}
