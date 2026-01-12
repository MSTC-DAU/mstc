'use client';

import { useState, useEffect } from 'react';
import { Download, Share, PlusSquare, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from "@/components/ui/drawer";

export function InstallPrompt({ className }: { className?: string }) {
    const [isIOS, setIsIOS] = useState(false);
    const [isStandalone, setIsStandalone] = useState(false);
    const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        setIsIOS(
            /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream
        );

        setIsStandalone(window.matchMedia('(display-mode: standalone)').matches);

        const handleBeforeInstallPrompt = (e: any) => {
            e.preventDefault();
            setDeferredPrompt(e);
        };

        window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

        return () => {
            window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
        };
    }, []);

    if (!mounted || isStandalone) {
        return null; // Don't show install button if already installed or not mounted
    }

    const handleInstallClick = async () => {
        if (deferredPrompt) {
            deferredPrompt.prompt();
            const { outcome } = await deferredPrompt.userChoice;
            if (outcome === 'accepted') {
                setDeferredPrompt(null);
            }
        }
    };

    // Native Install Prompt available
    if (deferredPrompt) {
        return (
            <Button
                onClick={handleInstallClick}
                className={className}
                size="lg"
                variant="default"
            >
                <Download className="w-4 h-4 mr-2" />
                Add Shortcut
            </Button>
        );
    }

    // Fallback: Instructions for iOS or purely manual install
    return (
        <Drawer>
            <DrawerTrigger asChild>
                <Button
                    className={className}
                    size="lg"
                    variant="default"
                >
                    <Download className="w-4 h-4 mr-2" />
                    Install App
                </Button>
            </DrawerTrigger>
            <DrawerContent>
                <div className="mx-auto w-full max-w-sm">
                    <DrawerHeader>
                        <DrawerTitle>Install MSTC App</DrawerTitle>
                        <DrawerDescription>
                            {isIOS ? 'Tap Share -> Add to Home Screen' : 'Open Browser Menu -> Install App'}
                        </DrawerDescription>
                    </DrawerHeader>
                    <div className="p-4 bg-muted/50 rounded-lg mx-4 space-y-4">
                        <div className="flex items-center gap-4">
                            <Share className="w-6 h-6 text-blue-500" />
                            <p className="text-sm">1. Open your browser's <strong>Menu</strong> or <strong>Share</strong> button.</p>
                        </div>
                        <div className="flex items-center gap-4">
                            <PlusSquare className="w-6 h-6 text-blue-500" />
                            <p className="text-sm">2. Select <strong>Add to Home Screen</strong> or <strong>Install App</strong>.</p>
                        </div>
                    </div>
                    <DrawerFooter>
                        <DrawerClose asChild>
                            <Button variant="outline">Close</Button>
                        </DrawerClose>
                    </DrawerFooter>
                </div>
            </DrawerContent>
        </Drawer>
    );
}
