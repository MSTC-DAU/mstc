import { OrigamiNavbar } from '@/components/ui/origami/origami-navbar'; // Using the proper Origami Navbar
import { db } from '@/lib/db';
import { users, mentors, teamPhotos } from '@/db/schema';
import { not } from 'drizzle-orm';
import { eq } from 'drizzle-orm';
import { Github, Linkedin, User } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { TeamPhotoOrigami } from '@/components/ui/origami/team-photo-origami';

export const dynamic = 'force-dynamic';

export default async function TeamPage() {
    // Fetch non-student users
    const teamMembers = await db.query.users.findMany({
        where: not(eq(users.role, 'student')),
        orderBy: (users, { desc }) => [desc(users.role)],
    });

    // Fetch Mentors
    const mentorsList = await db.query.mentors.findMany({
        orderBy: (mentors, { desc }) => [desc(mentors.createdAt)],
    });

    // Fetch Team Header Photo
    const headerPhoto = await db.query.teamPhotos.findFirst({
        where: eq(teamPhotos.isHeader, true),
        orderBy: (teamPhotos, { desc }) => [desc(teamPhotos.createdAt)],
    });

    // Custom sorting helper to put Convener -> Deputy -> Core -> Member
    const roleOrder: Record<string, number> = {
        'convener': 1,
        'deputy_convener': 2,
        'core_member': 3,
        'member': 4
    };

    const sortedTeam = teamMembers.sort((a, b) => {
        return (roleOrder[a.role || 'member'] || 99) - (roleOrder[b.role || 'member'] || 99);
    });

    return (
        <div className="min-h-screen bg-[#202124] text-[#E8EAED] font-sans selection:bg-shatter-yellow selection:text-black">
            <OrigamiNavbar />

            <main className="pt-24 pb-16 px-4 md:px-8 max-w-7xl mx-auto space-y-16">

                {/* 1. Header Section */}
                <div className="text-center space-y-4">
                    <h1 className="text-4xl md:text-6xl font-black uppercase italic tracking-tighter text-[#E8EAED]">
                        Meet The <span className="text-shatter-yellow">Team</span>
                    </h1>
                    <p className="text-lg text-[#9AA0A6] max-w-2xl mx-auto font-bold uppercase tracking-widest">
                        The minds behind the magic.
                    </p>
                </div>

                {/* 2. Team Photo (Origami Style) */}
                {headerPhoto?.url && (
                    <TeamPhotoOrigami imageUrl={headerPhoto.url} />
                )}

                {/* 3. Existing Team Members Grid */}
                <div>
                    <h2 className="text-3xl font-black uppercase italic tracking-tighter text-[#E8EAED] mb-8 border-l-8 border-shatter-yellow pl-4">
                        Current Core
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {sortedTeam.length === 0 ? (
                            <div className="col-span-full text-center py-12 text-[#9AA0A6] border-4 border-black border-dashed">
                                <p className="uppercase font-bold">No team members found.</p>
                            </div>
                        ) : (
                            sortedTeam.map((member) => (
                                <div key={member.id} className="group h-[400px] perspective-1000 active:scale-[0.98] transition-all duration-300">
                                    <div className="relative w-full h-full transition-transform duration-700 transform-style-preserve-3d group-hover:rotate-y-180">
                                        {/* --- FRONT FACE --- */}
                                        <div className="absolute inset-0 w-full h-full backface-hidden bg-[#303134] border-4 border-black">
                                            {/* Image */}
                                            <div className="w-full h-full relative">
                                                <Avatar className="w-full h-full rounded-none">
                                                    <AvatarImage
                                                        src={member.image || ''}
                                                        className="object-cover w-full h-full"
                                                    />
                                                    <AvatarFallback className="w-full h-full rounded-none bg-[#202124] flex items-center justify-center">
                                                        <User className="size-24 text-[#9AA0A6] opacity-50" />
                                                    </AvatarFallback>
                                                </Avatar>

                                                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-90" />

                                                <div className="absolute top-4 right-4 z-20">
                                                    <span className="bg-black text-[#E8EAED] px-3 py-1 text-xs font-black uppercase tracking-widest shadow-[4px_4px_0px_#8AB4F8] transform -rotate-2">
                                                        {member.role?.replace('_', ' ')}
                                                    </span>
                                                </div>

                                                <div className="absolute bottom-0 left-0 p-6 w-full">
                                                    <h3 className="text-2xl font-black uppercase italic tracking-tighter leading-none mb-2 text-[#E8EAED]">
                                                        {member.name || 'Unknown User'}
                                                    </h3>
                                                    <p className="text-xs font-mono font-bold text-[#9AA0A6] truncate uppercase tracking-widest">
                                                        {member.email}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* --- BACK FACE --- */}
                                        <div className="absolute inset-0 w-full h-full backface-hidden rotate-y-180 bg-[#303134] border-4 border-shatter-yellow flex flex-col justify-center items-center p-8 text-center space-y-6">
                                            <div className="size-16 rounded-full bg-[#303134] flex items-center justify-center mb-2 border-2 border-shatter-yellow">
                                                <User className="size-8 text-[#E8EAED]" />
                                            </div>

                                            <div>
                                                <h3 className="text-xl font-black uppercase italic tracking-tighter text-[#E8EAED] mb-4">
                                                    About
                                                </h3>
                                                <p className="text-sm font-bold text-[#9AA0A6] leading-relaxed line-clamp-6">
                                                    "{member.bio || 'Building the future with MSTC.'}"
                                                </p>
                                            </div>

                                            <div className="flex gap-4 pt-4 border-t-2 border-[#303134] w-full justify-center">
                                                {member.githubId && (
                                                    <a
                                                        href={member.githubId.startsWith('http') ? member.githubId : `https://github.com/${member.githubId}`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="p-3 bg-[#303134] hover:bg-white hover:text-black transition-all hover:-translate-y-1 shadow-[4px_4px_0px_black]"
                                                    >
                                                        <Github className="size-5" />
                                                    </a>
                                                )}
                                                {member.linkedinId && (
                                                    <a
                                                        href={member.linkedinId.startsWith('http') ? member.linkedinId : `https://linkedin.com/in/${member.linkedinId}`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="p-3 bg-[#303134] hover:bg-[#0077b5] hover:text-white transition-all hover:-translate-y-1 shadow-[4px_4px_0px_black]"
                                                    >
                                                        <Linkedin className="size-5" />
                                                    </a>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* 4. Mentors Section (New) */}
                {mentorsList.length > 0 && (
                    <div className="pt-8">
                        <div className="flex items-center gap-4 mb-8">
                            <h2 className="text-3xl font-black uppercase italic tracking-tighter text-[#E8EAED] border-l-8 border-shatter-pink pl-4">
                                Mentors
                            </h2>
                            <div className="h-1 bg-shatter-pink flex-1 opacity-50"></div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {mentorsList.map((mentor) => (
                                <div key={mentor.id} className="group relative bg-[#303134] border-2 border-black p-0 overflow-hidden shadow-[4px_4px_0px_black] hover:shadow-[8px_8px_0px_#FF00FF] transition-all hover:-translate-y-1">
                                    {/* Image */}
                                    <div className="aspect-square w-full relative overflow-hidden bg-black/50">
                                        <div className="absolute inset-0 bg-shatter-pink mix-blend-overlay opacity-0 group-hover:opacity-40 transition-opacity z-10" />
                                        {mentor.image ? (
                                            <img
                                                src={mentor.image}
                                                alt={mentor.name}
                                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center">
                                                <User className="size-16 text-[#9AA0A6]" />
                                            </div>
                                        )}
                                    </div>

                                    {/* Content */}
                                    <div className="p-4 relative">
                                        <h3 className="text-xl font-black uppercase tracking-tight text-[#E8EAED] truncate">
                                            {mentor.name}
                                        </h3>
                                        <p className="text-xs font-bold text-shatter-pink uppercase tracking-widest mb-3">
                                            {mentor.role}
                                        </p>

                                        <div className="flex gap-2">
                                            {mentor.linkedinId && (
                                                <a href={mentor.linkedinId.startsWith('http') ? mentor.linkedinId : `https://linkedin.com/in/${mentor.linkedinId}`} target="_blank" rel="noreferrer" className="text-[#9AA0A6] hover:text-[#fff] transition-colors">
                                                    <Linkedin className="size-4" />
                                                </a>
                                            )}
                                            {mentor.githubId && (
                                                <a href={mentor.githubId.startsWith('http') ? mentor.githubId : `https://github.com/${mentor.githubId}`} target="_blank" rel="noreferrer" className="text-[#9AA0A6] hover:text-[#fff] transition-colors">
                                                    <Github className="size-4" />
                                                </a>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

            </main>
        </div>
    );
}
