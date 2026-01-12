import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
    return {
        name: 'MSTC | Microsoft Student Technical Club',
        short_name: 'MSTC',
        description: 'Code. Compete. Conquer. The official platform for MSTC.',
        start_url: '/',
        display: 'standalone',
        background_color: '#202124',
        theme_color: '#202124',
        icons: [
            {
                src: '/favicon_io/android-chrome-192x192.png',
                sizes: '192x192',
                type: 'image/png',
            },
            {
                src: '/favicon_io/android-chrome-512x512.png',
                sizes: '512x512',
                type: 'image/png',
            },
        ],
    };
}
