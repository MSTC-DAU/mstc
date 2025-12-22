export type EventThemeKey = 'default' | 'winter' | 'hacktoberfest' | 'github' | 'summer' | 'cp' | 'polar_night';

export interface ThemeConfig {
    name: string;
    background: string;
    accent: string;
    card: string;
    icon: string;
}

export const EVENT_THEME_CONFIG: Record<EventThemeKey, ThemeConfig> = {
    default: {
        name: 'Default (MSTC)',
        background: 'bg-[#202124] animate-aurora from-[#202124] via-[#303134] to-[#202124] bg-gradient-to-r',
        accent: 'text-[#8AB4F8] border-[#8AB4F8]',
        card: 'bg-[#303134] border-l-[8px] border-r-[8px] border-l-[#8AB4F8] border-r-green-500 shadow-2xl rounded-none',
        icon: 'text-[#8AB4F8]'
    },
    winter: {
        name: 'Winter of Code',
        background: 'bg-[#020617]', // Fallback
        accent: 'text-cyan-200 border-cyan-400 drop-shadow-[0_0_15px_rgba(34,211,238,0.6)]',
        card: 'backdrop-blur-xl bg-white/5 border border-white/20 shadow-[0_0_40px_-10px_rgba(34,211,238,0.2)] rounded-xl',
        icon: 'text-cyan-200 drop-shadow-[0_0_15px_rgba(34,211,238,0.9)] animate-pulse'
    },
    polar_night: {
        name: 'Polar Night',
        background: 'bg-[#020617]',
        accent: 'text-red-500 border-red-600 drop-shadow-[0_0_15px_rgba(220,38,38,0.6)]',
        card: 'backdrop-blur-md bg-black/40 border border-red-900/50 shadow-[0_0_30px_-5px_rgba(220,38,38,0.15)] rounded-sm',
        icon: 'text-red-500 drop-shadow-[0_0_10px_rgba(220,38,38,0.8)] animate-pulse'
    },
    hacktoberfest: {
        name: 'Hacktoberfest',
        background: 'bg-[#050014] animate-glitch bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]',
        accent: 'text-[#FF8AE2] border-[#ff00ff]',
        card: 'bg-black/80 border-4 border-[#ff00ff] shadow-[8px_8px_0px_#00ff00] rounded-none hover:animate-pulse',
        icon: 'text-[#FF8AE2]'
    },
    github: {
        name: 'GitHub / Tech',
        background: 'bg-[#0D1117] bg-[radial-gradient(#30363d_1px,transparent_1px)] bg-[size:16px_16px]',
        accent: 'text-white border-white',
        card: 'bg-[#161B22] border-2 border-white shadow-[6px_6px_0px_#30363d] rounded-none grayscale hover:grayscale-0 transition-all',
        icon: 'text-white'
    },
    summer: {
        name: 'Summer of Code',
        background: 'bg-orange-950 animate-heat-pulse',
        accent: 'text-black border-black',
        card: 'bg-gradient-to-tr from-red-600 to-yellow-500 text-black font-black border-4 border-black shadow-[8px_8px_0px_white] rounded-none',
        icon: 'text-black'
    },
    cp: {
        name: 'Competitive Programming',
        background: 'bg-black',
        accent: 'text-green-500 border-green-500',
        card: 'bg-black border-2 border-green-500 border-dashed shadow-[0_0_20px_#22c55e] rounded-none font-mono tracking-widest',
        icon: 'text-green-500 animate-ping'
    }
};
