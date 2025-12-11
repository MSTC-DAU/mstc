
'use client';

import { Navbar } from '@/components/navbar';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Code2, Cpu, Globe, Terminal, Smartphone, Brain, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { AnimatedBackground } from '@/components/ui/animated-background';
import { motion } from 'framer-motion';
import { MagneticButton } from '@/components/ui/magnetic-button';
import { TiltCard } from '@/components/ui/tilt-card';
import { SpotlightCard } from '@/components/ui/spotlight-card';
import { Timeline } from '@/components/ui/timeline';
import { useSession } from 'next-auth/react';

const events = [
  { title: 'Hacktoberfest', date: 'Oct', status: 'upcoming', type: 'Open Source' },
  { title: 'ICPC Prep', date: 'Nov', status: 'upcoming', type: 'CP' },
  { title: 'Winter of Code', date: 'Dec', status: 'upcoming', type: 'Mentorship' },
  { title: 'Code Wars', date: 'Jan', status: 'upcoming', type: 'CP' },
  { title: 'FaceOff', date: 'Feb', status: 'upcoming', type: 'CP 1v1' },
  { title: 'Summer of Code', date: 'May', status: 'upcoming', type: 'Mentorship' },
];

const domains = [
  { name: 'Web Dev', icon: Globe, color: 'text-neon-cyan' },
  { name: 'App Dev', icon: Smartphone, color: 'text-neon-pink' },
  { name: 'AI/ML', icon: Brain, color: 'text-neon-purple' },
  { name: 'CP / DSA', icon: Code2, color: 'text-yellow-400' },
  { name: 'Game Dev', icon: Cpu, color: 'text-red-400' },
  { name: 'Cyber Sec', icon: Terminal, color: 'text-green-400' },
];

export default function Home() {
  const { data: session } = useSession();
  return (
    <div className="min-h-screen bg-transparent text-white selection:bg-neon-cyan/30 overflow-x-hidden font-sans">
      <AnimatedBackground />
      <Navbar />

      {/* NEW HERO SECTION: "The Portal" */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 px-4 overflow-hidden z-10 min-h-[90vh] flex items-center">
        <div className="max-w-7xl mx-auto w-full grid lg:grid-cols-2 gap-12 items-center">

          {/* Left: Text Content */}
          <div className="relative z-10 text-left">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <Badge variant="outline" className="mb-6 border-white/10 bg-white/5 text-neon-cyan px-4 py-1.5 text-sm rounded-full backdrop-blur-md uppercase tracking-wider flex w-fit items-center gap-2">
                <Sparkles className="size-3" /> Microsoft Student Technical Club
              </Badge>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
              className="text-6xl md:text-8xl font-bold tracking-tighter mb-6 leading-[0.9]"
            >
              BUILDING <br />
              <span className="text-gradient drop-shadow-[0_0_30px_rgba(0,243,255,0.3)]">THE FUTURE.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-xl text-gray-400 mb-10 max-w-xl leading-relaxed"
            >
              Join the elite community of developers, innovators, and creators.
              We don't just write code; we architect the digital reality.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="flex flex-wrap gap-6"
            >
              {session?.user ? (
                <Link href="/dashboard">
                  <MagneticButton className="relative group">
                    <div className="absolute inset-0 bg-gradient-to-r from-neon-cyan to-blue-600 rounded-full blur-md opacity-70 group-hover:opacity-100 transition duration-300" />
                    <Button size="lg" className="relative bg-black hover:bg-black/80 text-white text-lg px-8 h-14 rounded-full border border-white/10">
                      Go to Dashboard
                    </Button>
                  </MagneticButton>
                </Link>
              ) : (
                <Link href="/register">
                  <MagneticButton className="relative group">
                    <div className="absolute inset-0 bg-gradient-to-r from-neon-cyan to-blue-600 rounded-full blur-md opacity-70 group-hover:opacity-100 transition duration-300" />
                    <Button size="lg" className="relative bg-black hover:bg-black/80 text-white text-lg px-8 h-14 rounded-full border border-white/10">
                      Join the Club
                    </Button>
                  </MagneticButton>
                </Link>
              )}
              <Link href="/dashboard/events">
                <MagneticButton>
                  <Button size="lg" variant="ghost" className="text-lg px-8 h-14 rounded-full text-white hover:bg-white/5 border border-white/10 backdrop-blur-sm">
                    Explore Events <ArrowRight className="ml-2 size-5" />
                  </Button>
                </MagneticButton>
              </Link>
            </motion.div>
          </div>

          {/* Right: The "Special" Element (3D Tilt Card) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8, rotate: -10 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 1, delay: 0.5, type: "spring" }}
            className="hidden lg:block relative perspective-1000"
          >
            <TiltCard className="w-full h-[500px] glass-card flex items-center justify-center relative bg-black/40 border-white/10 overflow-hidden group">
              {/* Dynamic Background Gradients */}
              <div className="absolute inset-0 bg-gradient-to-br from-neon-cyan/10 via-transparent to-neon-purple/10 opacity-50 transition-opacity duration-500 group-hover:opacity-80" />

              {/* Scanning Line Animation */}
              <motion.div
                animate={{ top: ['0%', '100%'], opacity: [0, 1, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                className="absolute left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-neon-cyan to-transparent z-20 shadow-[0_0_20px_rgba(0,243,255,0.5)]"
              />

              <div className="relative z-10 text-center space-y-8 p-12 w-full">
                {/* Floating Icons Ring */}
                <div className="relative size-40 mx-auto flex items-center justify-center">
                  <div className="absolute inset-0 rounded-full border border-neon-cyan/30 animate-[spin_10s_linear_infinite]" />
                  <div className="absolute inset-2 rounded-full border border-dotted border-neon-purple/30 animate-[spin_15s_linear_infinite_reverse]" />

                  <div className="size-32 rounded-full bg-gradient-to-tr from-neon-cyan/20 to-blue-600/20 backdrop-blur-md flex items-center justify-center shadow-[0_0_50px_rgba(0,243,255,0.2)] border border-white/10 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-t from-neon-cyan/20 to-transparent animate-pulse" />
                    <Terminal className="text-white size-14 relative z-10 drop-shadow-[0_0_10px_rgba(0,243,255,0.8)]" />
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="text-4xl font-bold text-white tracking-widest relative inline-block">
                    MSTC <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-cyan to-neon-purple">NEXT</span>
                    <div className="absolute -top-2 -right-4 size-2 bg-neon-pink rounded-full animate-ping" />
                  </h3>
                  <p className="text-xs font-mono text-neon-cyan/70 uppercase tracking-[0.3em] pl-1">System Status: Nominal</p>
                </div>

                {/* Data Readout Grid */}
                <div className="grid grid-cols-2 gap-4 mt-8 opacity-70">
                  <div className="bg-white/5 rounded p-3 border border-white/5 text-left">
                    <div className="text-[10px] text-gray-500 uppercase">Members</div>
                    <div className="text-xl font-mono text-white">2,048</div>
                  </div>
                  <div className="bg-white/5 rounded p-3 border border-white/5 text-left">
                    <div className="text-[10px] text-gray-500 uppercase">Events</div>
                    <div className="text-xl font-mono text-white">12+</div>
                  </div>
                </div>
              </div>

              {/* Decorative Tech Corners */}
              <div className="absolute top-6 left-6 w-16 h-16 border-t-2 border-l-2 border-neon-cyan/30 rounded-tl-2xl" />
              <div className="absolute bottom-6 right-6 w-16 h-16 border-b-2 border-r-2 border-neon-purple/30 rounded-br-2xl" />

              {/* Code Overlay (Subtle) */}
              <div className="absolute top-1/2 left-4 text-[10px] font-mono text-white/5 writing-vertical leading-tight hidden md:block select-none">
                01001101 01010011 01010100 01000011
              </div>
            </TiltCard>
          </motion.div>

        </div>
      </section>


      {/* Vertical Timeline Section */}
      <section className="py-24 relative z-10" id="timeline">
        <div className="max-w-7xl mx-auto px-4 mb-16 text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-bold mb-4"
          >
            The <span className="text-gradient">Journey</span>
          </motion.h2>
          <p className="text-gray-400 max-w-xl mx-auto">From major hackathons to intimate mentorship sessions, here is what lies ahead.</p>
        </div>

        <Timeline events={events} />
      </section>

      {/* Technologies Spotlight Grid */}
      <section className="py-32 max-w-7xl mx-auto px-4 relative z-10">
        <div className="text-center mb-20">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-5xl md:text-6xl font-bold mb-6"
          >
            Master The <span className="text-gradient">Stack</span>
          </motion.h2>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg">
            We don't chase trends. We build on foundations using industry-standard technologies.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {domains.map((domain, i) => {
            const Icon = domain.icon;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
                viewport={{ once: true }}
              >
                <SpotlightCard className="aspect-square flex flex-col items-center justify-center gap-4 hover:bg-white/5 transition-colors cursor-pointer group" spotlightColor="rgba(189, 0, 255, 0.2)">
                  <div className={`p-4 rounded-2xl bg-white/5 group-hover:bg-white/10 transition-all duration-300 ring-1 ring-white/5 group-hover:ring-white/20`}>
                    <Icon className={cn("size-8 transition-colors duration-300 text-gray-400 group-hover:text-white")} />
                  </div>
                  <span className="font-medium text-gray-400 group-hover:text-white transition-colors">{domain.name}</span>
                </SpotlightCard>
              </motion.div>
            )
          })}
        </div>
      </section>
    </div>
  );
}
