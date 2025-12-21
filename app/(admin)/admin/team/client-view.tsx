'use client';

import { useState, useTransition } from 'react';
import { addMentor, deleteMentor, setTeamHeaderPhoto, removeTeamHeaderPhoto } from '@/app/actions/team-actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Trash2, Plus, Save, User } from 'lucide-react';
import { toast } from 'sonner';

interface Mentor {
    id: string;
    name: string;
    role: string;
    image: string | null;
    linkedinId: string | null;
    githubId: string | null;
    createdAt: Date | null;
}

interface TeamPhoto {
    id: string;
    url: string;
    isHeader: boolean | null;
}

interface AdminTeamClientViewProps {
    initialMentors: Mentor[];
    initialHeader: TeamPhoto | undefined;
}

export default function AdminTeamClientView({ initialMentors, initialHeader }: AdminTeamClientViewProps) {
    const [isPending, startTransition] = useTransition();

    // Mentors State (optimistic updates could be added, but simple revalidation is fine)
    // Actually, `revalidatePath` in actions will refresh the Server Component, but we need to pass refreshing down?
    // Next.js Server Actions + revalidatePath usually triggers a refresh of the route.
    // So we just need to handle the form submission.

    // Header Photo State
    const [headerUrl, setHeaderUrl] = useState(initialHeader?.url || '');

    async function handleUpdateHeader() {
        if (!headerUrl) {
            toast.error('Please enter a URL');
            return;
        }

        startTransition(async () => {
            try {
                await setTeamHeaderPhoto(headerUrl);
                toast.success('Header photo updated');
            } catch (error) {
                toast.error('Failed to update header photo');
            }
        });
    }

    async function handleAddMentor(formData: FormData) {
        startTransition(async () => {
            try {
                await addMentor(formData);
                toast.success('Mentor added');
                // clear form? - Native form reset might happen or we can use ref
                const form = document.getElementById('add-mentor-form') as HTMLFormElement;
                form?.reset();
            } catch (error) {
                toast.error('Failed to add mentor');
            }
        });
    }

    async function handleDeleteMentor(id: string) {
        if (!confirm('Are you sure you want to delete this mentor?')) return;

        startTransition(async () => {
            try {
                await deleteMentor(id);
                toast.success('Mentor deleted');
            } catch (error) {
                toast.error('Failed to delete mentor');
            }
        });
    }

    return (
        <div className="space-y-8 p-8">
            <h1 className="text-3xl font-bold">Team Management</h1>

            {/* Header Photo Section */}
            <Card>
                <CardHeader>
                    <CardTitle>Team Header Photo</CardTitle>
                    <CardDescription>Update the large origami-style photo at the top of the Team page.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex gap-4 items-end">
                        <div className="grid w-full max-w-sm items-center gap-1.5">
                            <Label htmlFor="headerUrl">Image URL</Label>
                            <Input
                                id="headerUrl"
                                value={headerUrl}
                                onChange={(e) => setHeaderUrl(e.target.value)}
                                placeholder="https://..."
                            />
                        </div>
                        <Button onClick={handleUpdateHeader} disabled={isPending}>
                            <Save className="mr-2 h-4 w-4" /> Save Header
                        </Button>
                    </div>
                    {initialHeader?.url && (
                        <div className="mt-4 border rounded-md overflow-hidden bg-gray-100 max-h-64 flex justify-center">
                            <img src={initialHeader.url} alt="Current Header" className="object-cover h-full" />
                        </div>
                    )}
                    {initialHeader?.url && (
                        <div className="flex justify-end">
                            <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => {
                                    if (confirm('Remove header photo?')) {
                                        startTransition(async () => {
                                            await removeTeamHeaderPhoto();
                                            toast.success('Header photo removed');
                                            setHeaderUrl('');
                                        });
                                    }
                                }}
                                disabled={isPending}
                            >
                                <Trash2 className="mr-2 h-4 w-4" /> Remove Header
                            </Button>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Mentors Section */}
            <Card>
                <CardHeader>
                    <CardTitle>Mentors</CardTitle>
                    <CardDescription>Manage previous club members.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    {/* Add Mentor Form */}
                    <form id="add-mentor-form" action={handleAddMentor} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 border-b pb-6">
                        <div className="space-y-2">
                            <Label htmlFor="name">Name *</Label>
                            <Input name="name" id="name" required placeholder="e.g. John Doe" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="role">Role *</Label>
                            <Input name="role" id="role" required placeholder="e.g. Former Convener" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="image">Image URL</Label>
                            <Input name="image" id="image" placeholder="https://..." />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="linkedinId">LinkedIn ID/URL</Label>
                            <Input name="linkedinId" id="linkedinId" placeholder="johndoe" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="githubId">GitHub ID/URL</Label>
                            <Input name="githubId" id="githubId" placeholder="johndoe" />
                        </div>
                        <div className="flex items-end">
                            <Button type="submit" disabled={isPending} className="w-full">
                                <Plus className="mr-2 h-4 w-4" /> Add Mentor
                            </Button>
                        </div>
                    </form>

                    {/* Mentors List */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {initialMentors.map((mentor) => (
                            <div key={mentor.id} className="flex items-center gap-4 p-4 border rounded-lg bg-card text-card-foreground shadow-sm">
                                <div className="h-12 w-12 rounded-full overflow-hidden bg-gray-200 flex-shrink-0">
                                    {mentor.image ? (
                                        <img src={mentor.image} alt={mentor.name} className="h-full w-full object-cover" />
                                    ) : (
                                        <div className="h-full w-full flex items-center justify-center text-gray-400">
                                            <User className="h-6 w-6" />
                                        </div>
                                    )}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="font-bold truncate">{mentor.name}</p>
                                    <p className="text-sm text-muted-foreground truncate">{mentor.role}</p>
                                </div>
                                <Button
                                    variant="destructive"
                                    size="icon"
                                    onClick={() => handleDeleteMentor(mentor.id)}
                                    disabled={isPending}
                                >
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </div>
                        ))}
                        {initialMentors.length === 0 && (
                            <div className="col-span-full text-center text-muted-foreground py-8">
                                No mentors added yet.
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
