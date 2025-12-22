'use client';

import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Settings, Save, Loader2, Image as ImageIcon } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { getSystemSetting, updateSystemSetting } from "@/app/actions/settings";

export default function AdminSettingsPage() {
    const [teamPhotoUrl, setTeamPhotoUrl] = useState("");
    const [loading, setLoading] = useState(false);
    const [initialLoading, setInitialLoading] = useState(true);

    useEffect(() => {
        async function fetchSettings() {
            const url = await getSystemSetting("team_photo_url");
            if (url) setTeamPhotoUrl(url);
            setInitialLoading(false);
        }
        fetchSettings();
    }, []);

    const handleSaveTeamPhoto = async () => {
        setLoading(true);
        const res = await updateSystemSetting("team_photo_url", teamPhotoUrl, "URL for the team photo displayed on the Team page");
        setLoading(false);

        if (res.success) {
            toast.success("Team photo updated successfully");
        } else {
            toast.error(res.message);
        }
    };

    if (initialLoading) {
        return <div className="p-12 flex justify-center"><Loader2 className="animate-spin text-cyan-400" /></div>;
    }

    return (
        <div className="p-6 space-y-6 max-w-4xl mx-auto font-sans">
            <div className="flex items-center gap-3 mb-8 border-b border-white/10 pb-6">
                <div className="p-3 bg-cyan-500/10 rounded-lg">
                    <Settings className="size-8 text-cyan-400" />
                </div>
                <div>
                    <h1 className="text-3xl font-black uppercase text-white tracking-tight">Platform Settings</h1>
                    <p className="text-gray-400">Manage global configuration.</p>
                </div>
            </div>

            <Card className="p-8 border-white/10 bg-[#202124] space-y-6">
                <div className="flex items-center gap-2 mb-6">
                    <ImageIcon className="size-5 text-shatter-yellow" />
                    <h2 className="text-xl font-bold text-white uppercase tracking-wider">Team Page Configuration</h2>
                </div>

                <div className="space-y-4 max-w-2xl">
                    <div className="space-y-2">
                        <Label className="text-gray-300">Team Photo URL</Label>
                        <Input
                            value={teamPhotoUrl}
                            onChange={(e) => setTeamPhotoUrl(e.target.value)}
                            placeholder="https://example.com/team-photo.jpg"
                            className="bg-black/30 border-white/10 text-white focus:border-shatter-yellow transition-colors"
                        />
                        <p className="text-xs text-gray-500">
                            This image will be displayed prominently on the /team page.
                        </p>
                    </div>

                    {teamPhotoUrl && (
                        <div className="mt-4 rounded-lg overflow-hidden border-2 border-dashed border-white/20 relative aspect-video bg-black/50 group">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={teamPhotoUrl} alt="Preview" className="w-full h-full object-cover opacity-70 group-hover:opacity-100 transition-opacity" />
                            <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-2 py-1 rounded">Preview</div>
                        </div>
                    )}

                    <div className="pt-4">
                        <Button
                            onClick={handleSaveTeamPhoto}
                            disabled={loading}
                            className="bg-shatter-yellow text-black hover:bg-white font-bold uppercase tracking-widest transition-all hover:scale-105"
                        >
                            {loading ? <Loader2 className="size-4 animate-spin mr-2" /> : <Save className="size-4 mr-2" />}
                            Save Configuration
                        </Button>
                    </div>
                </div>
            </Card>
        </div>
    );
}

