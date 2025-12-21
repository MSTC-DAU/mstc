import { getMentors, getTeamHeaderPhoto } from '@/app/actions/team-actions';
import AdminTeamClientView from './client-view';

export default async function AdminTeamPage() {
    const mentorsData = await getMentors();
    const currentHeader = await getTeamHeaderPhoto();

    return <AdminTeamClientView initialMentors={mentorsData} initialHeader={currentHeader} />;
}

// ... wait, I need to write the client view separately if I do this.
// I'll write the client view in the same file if I can? No, `use client` applies to the whole file.
// I will write TWO files.
