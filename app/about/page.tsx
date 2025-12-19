import { OrigamiNavbar } from '@/components/ui/origami/origami-navbar';
import { FoldCard } from '@/components/ui/origami/fold-card';
import { Linkedin, Instagram, Twitter, Facebook, Github, Terminal } from 'lucide-react';

export default function AboutPage() {
    return (
        <div className="min-h-screen font-sans selection:bg-shatter-yellow selection:text-black">
            <OrigamiNavbar />

            <main className="pt-48 pb-16 px-4 md:px-8 max-w-7xl mx-auto space-y-32">
                {/* About MSTC Section */}
                <div className="text-center space-y-12 max-w-5xl mx-auto relative">
                    <div className="space-y-6">
                        <div className="inline-block bg-shatter-yellow border-2 border-black transform -rotate-2 shadow-[4px_4px_0px_black] mb-6">
                            <span className="block px-4 py-1 text-black font-black uppercase tracking-widest text-sm transform rotate-2">
                                Student-Led • Tech-Driven
                            </span>
                        </div>
                        <h1 className="text-5xl md:text-8xl font-black uppercase italic tracking-tighter text-[#E8EAED] leading-[0.95] drop-shadow-lg">
                            About <span className="text-shatter-yellow">MSTC</span>
                        </h1>
                    </div>

                    <div className="text-xl md:text-2xl text-[#9AA0A6] font-medium leading-relaxed text-left space-y-6 bg-[#303134] p-8 md:p-12 border-2 border-black shadow-[8px_8px_0px_black] relative">
                        {/* Decorators */}
                        <div className="absolute -top-3 -left-3 size-6 bg-shatter-pink border-2 border-black" />
                        <div className="absolute -bottom-3 -right-3 size-6 bg-shatter-yellow border-2 border-black" />

                        <p>
                            <span className="text-[#E8EAED] font-bold">Microsoft Student Technical Club (MSTC)</span> at Dhirubhai Ambani University, Gandhinagar is a student-led tech community built by and for curious learners.
                        </p>
                        <p>
                            We bring together students from diverse technical backgrounds — web development (MERN, Django, Spring Boot), app development, blockchain, game development, system programming, C++, DSA, competitive programming, AI, and ML.
                        </p>
                        <p>
                            At MSTC, we don't limit ourselves to a single technology or domain. Our focus is on learning by building, exploring different fields, and helping students grow into confident developers and problem-solvers.
                        </p>
                        <p>
                            We aim to create an environment where students can experiment with ideas, collaborate with peers, and gradually bridge the gap between classroom learning and real-world applications.
                        </p>
                    </div>
                </div>

                {/* Goals Section */}
                <div className="space-y-16">
                    <h2 className="text-4xl md:text-6xl font-black uppercase italic text-[#E8EAED] tracking-tighter text-center">
                        Our <span className="text-shatter-pink">Goals</span>
                    </h2>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {GOALS.map((goal, idx) => (
                            <FoldCard key={idx} accent={idx % 2 === 0 ? "blue" : "flame"} className="h-full bg-[#303134] hover:bg-black group transition-colors duration-300">
                                <div className="p-6 h-full flex items-start gap-4">
                                    <Terminal className={`size-6 shrink-0 ${idx % 2 === 0 ? 'text-shatter-yellow' : 'text-shatter-pink'} mt-1`} />
                                    <p className="text-[#E8EAED] font-medium text-lg leading-relaxed group-hover:text-white">
                                        {goal}
                                    </p>
                                </div>
                            </FoldCard>
                        ))}
                    </div>
                </div>

                {/* Events Section */}
                <div className="space-y-16">
                    <h2 className="text-4xl md:text-6xl font-black uppercase italic text-[#E8EAED] tracking-tighter text-center">
                        Events & <span className="text-shatter-yellow">Initiatives</span>
                    </h2>

                    <div className="grid md:grid-cols-2 gap-8">
                        {EVENTS.map((event, idx) => (
                            <div key={idx} className="relative group">
                                <div className="absolute inset-0 bg-black translate-x-2 translate-y-2 group-hover:translate-x-4 group-hover:translate-y-4 transition-transform border-2 border-[#E8EAED]" />
                                <div className="relative bg-[#303134] border-2 border-black p-8 h-full space-y-4 hover:-translate-y-1 transition-transform duration-300 flex flex-col">
                                    <h3 className="text-2xl font-black uppercase italic text-shatter-pink">{event.title}</h3>
                                    <p className="text-[#9AA0A6] text-lg leading-relaxed">{event.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                    <p className="text-center text-[#E8EAED] text-lg max-w-3xl mx-auto mt-12 italic border-l-4 border-shatter-yellow pl-6 py-2 bg-[#ffffff05]">
                        "The event we are currently conducting is development-focused, aimed at helping students strengthen practical building skills while complementing their DSA/CP journey."
                    </p>
                </div>

                {/* Connect Section */}
                <div className="text-center space-y-12 py-20 border-t-4 border-black relative">
                    <div className="absolute inset-0 bg-shatter-pattern opacity-5" />
                    <div className="relative z-10 space-y-12">
                        <div>
                            <h2 className="text-4xl md:text-6xl font-black uppercase italic text-[#E8EAED] tracking-tighter mb-4">
                                Connect With Us
                            </h2>
                            <p className="text-xl text-[#9AA0A6] max-w-2xl mx-auto">Stay connected with MSTC DAU Gandhinagar and be part of our growing community</p>
                        </div>

                        <div className="flex flex-wrap justify-center gap-6">
                            {SOCIALS.map((social, idx) => (
                                <a
                                    key={idx}
                                    href={social.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-3 px-6 py-4 bg-black border-2 border-shatter-yellow text-[#E8EAED] hover:bg-shatter-yellow hover:text-black transition-all duration-300 font-bold uppercase tracking-wider transform hover:-rotate-2 hover:shadow-[4px_4px_0px_white]"
                                >
                                    {social.icon}
                                    <span>{social.name}</span>
                                </a>
                            ))}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}

const GOALS = [
    "Foster technical curiosity across multiple domains and tech stacks",
    "Maintain a healthy balance between development and DSA / competitive programming",
    "Encourage students to explore, build and contribute at their own pace",
    "Promote open-source culture and collaborative learning",
    "Help members grow not just technically, but also in leadership, teamwork and communication",
    "The event and content we serve is aimed to help students in resume building"
];

const EVENTS = [
    { title: "Git-Tech-Toe", description: "Hands-on sessions focused to introduce open-source contributions and version control and logic building for code." },
    { title: "Hacktoberfest", description: "Beginner friendly open source event with collaboration of hacktoberfest to promote open source and provides platform beginners to contribute." },
    { title: "Winter of Code (WoC)", description: "A month-long, mentorship-driven program where students work on real-world open-source projects." },
    { title: "Face-Off (1v1)", description: "Competitive programming battles designed to sharpen problem-solving skills in a fun, fast-paced format." },
    { title: "CodeChain", description: "A mock ICPC like event to promote CP and make them familiar with the process of ICPC." },
    { title: "Summer of Code", description: "A summer mentorship initiative focused on building impactful projects and gaining deeper technical exposure." },
    { title: "Guest Talks", description: "Interactive sessions with industry professionals sharing their journeys, challenges and insights." }
];

const SOCIALS = [
    { name: "LinkedIn", url: "https://in.linkedin.com/company/microsoft-student-technical-club-da-iict", icon: <Linkedin className="size-5" /> },
    { name: "Instagram", url: "https://www.instagram.com/mstc_daiict/", icon: <Instagram className="size-5" /> },
    { name: "Twitter (X)", url: "https://x.com/mstc_daiict", icon: <Twitter className="size-5" /> },
    { name: "Facebook", url: "https://www.facebook.com/mstcatdaiict/", icon: <Facebook className="size-5" /> },
    { name: "GitHub", url: "https://github.com/MSTC-DA-IICT", icon: <Github className="size-5" /> }
];
