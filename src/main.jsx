import React, { useState } from "react";
import { createRoot } from "react-dom/client";
import {
  AlertTriangle,
  BookOpenCheck,
  Bug,
  DatabaseZap,
  Eye,
  FileSearch,
  Github,
  Image as ImageIcon,
  Newspaper,
  Moon,
  Sun,
  Scale,
  ShieldAlert,
  Workflow,
} from "lucide-react";
import "./styles.css";

const routes = [
  { id: "home", label: "Home", href: "#/" },
  { id: "issues", label: "Key Issues", href: "#/issues" },
  { id: "results", label: "Results Issues", href: "#/results" },
  { id: "images", label: "Gallery", href: "#/images" },
  { id: "goats", label: "The Goats", href: "#/goats" },
  { id: "contribute", label: "Contribute", href: "https://github.com/ashyyhere/cbse-accountability-log" },
];

const issueCards = [
  {
    title: "Security & Vulnerabilities",
    description: "Master-password bypass risks, weak access boundaries, exposed evaluation workflows, and possible student data leakage.",
    icon: ShieldAlert,
    color: "text-[#7dbefa]",
  },
  {
    title: "Evaluation Failures",
    description: "Blurry scanned sheets, misaligned digital overlays, missing pages, frozen annotations, and reviewer-side rendering errors.",      
    icon: FileSearch,
    color: "text-indigo-400",
  },
  {
    title: "Process & Tenders",
    description: "Infrastructure anomalies, opaque vendor responsibilities, limited auditability, and tender documentation gaps.",
    icon: Workflow,
    color: "text-teal-400",
  },
  {
    title: "Evidence Preservation",
    description: "Structured references for screenshots, logs, affidavits, public documents, and reproducible technical notes.",
    icon: DatabaseZap,
    color: "text-slate-400",
  },
];

const resultIssues = [
  {
    title: "Blurred Answer-Sheet Scans",
    type: "Evaluation Quality",
    severity: "High",
    icon: Eye,
    summary: "Reports describe answer scripts where handwriting, diagrams, page edges, or continuation sheets are difficult to inspect because of scan quality.",
  },
  {
    title: "Wrong or Inconsistent Checking",
    type: "Marking Reliability",
    severity: "High",
    icon: Scale,
    summary: "Students and reviewers allege marking inconsistencies, missed steps, unchecked sections, or score mismatches between visible work and awarded marks.",
  },
  {
    title: "Site Vulnerabilities",
    type: "Security",
    severity: "Critical",
    icon: Bug,
    summary: "Community reports reference suspected weaknesses in authentication, access control, session handling, data exposure, or evaluator workflows.",
  },
  {
    title: "Missing Pages or Bad Page Order",
    type: "Evaluation Quality",
    severity: "Medium",
    icon: FileSearch,
    summary: "Some issue reports involve incomplete scans, duplicate pages, page-order confusion, or mismatched metadata during digital evaluation.",
  },
];

const galleryItems = [
  {
    title: "Full Page, Zero Marks",
    path: "/assets/blank-mark.jpg",
    category: "Checking Issues",
    caption: "Student wrote an entire page but was awarded a blank mark by the evaluator.",
    notes: "Source: @TheAnuragTyagi on X. Highlights severe negligence in OSM checking.",
  },
  {
    title: "Chemistry Evaluation Failure",
    path: "/assets/chemistry-eval.jpg",
    category: "Checking Issues",
    caption: "Chemistry copy appears to be evaluated by someone lacking basic subject knowledge.",
    notes: "Source: @TheAnuragTyagi on X. Raises questions about evaluator qualifications.",
  },
  {
    title: "Unreadable Bad Scans",
    path: "/assets/bad-scan.jpg",
    category: "Checking Issues",
    caption: "Answer sheet copies were scanned so poorly that evaluation becomes impossible.",
    notes: "Source: @TheAnuragTyagi on X. Direct consequence of digital infrastructure failure.",
  },
  {
    title: "Correct Answers, Deducted Marks",
    path: "/assets/correct-deducted.jpg",
    category: "Checking Issues",
    caption: "Marks were deducted despite the student writing the correct answers.",
    notes: "Source: @TheAnuragTyagi on X. Shows rigid or erroneous marking schemes applied.",
  },
  {
    title: "Maths 5-Marker Slashed",
    path: "/assets/maths-half-marks.jpg",
    category: "Checking Issues",
    caption: "A full 5-mark mathematics question was given only 2.5 marks despite correct steps.",
    notes: "Source: @TheAnuragTyagi on X. Indicates failure in step-marking protocols.",
  },
  {
    title: "Low Marks for Lengthy Answers",
    path: "/assets/low-marks-for-length.jpg",
    category: "Checking Issues",
    caption: "Extremely low marks awarded despite the student writing extensive, detailed answers.",
    notes: "Source: @TheAnuragTyagi on X. Points to potential 'glance checking' by evaluators.",
  },
  {
    title: "Unauthorized Access Bypass (Part 1)",
    path: "/assets/security-access-bypass-1.jpg",
    category: "Security Issues",
    caption: "Evidence showing potential bypass of standard authentication controls.",
    notes: "Source: @ni5arga on X. Vulnerability in access control systems.",
  },
  {
    title: "Unauthorized Access Bypass (Part 2)",
    path: "/assets/security-access-bypass-2.jpg",
    category: "Security Issues",
    caption: "Further evidence demonstrating unauthorized navigation within the portal.",
    notes: "Source: @ni5arga on X. Highlights weak session enforcement.",
  },
  {
    title: "OSM Portal Infrastructure Glitch",
    path: "/assets/security-portal-glitch-1.jpg",
    category: "Security Issues",
    caption: "Server-side or rendering error exposing internal paths or logic.",
    notes: "Source: @ni5arga on X. Infrastructure failure on the OSM platform.",
  },
  {
    title: "Data Exposure Risk (Part 1)",
    path: "/assets/security-data-exposure-1.jpg",
    category: "Security Issues",
    caption: "Evidence of potentially exposed student or evaluator metadata.",
    notes: "Source: @ni5arga on X. Severe risk to data privacy.",
  },
  {
    title: "Data Exposure Risk (Part 2)",
    path: "/assets/security-data-exposure-2.jpg",
    category: "Security Issues",
    caption: "Further demonstration of sensitive information leakage.",
    notes: "Source: @ni5arga on X. Severe risk to data privacy.",
  },
];

const goats = [
  {
    name: "Anurag Tyagi",
    handle: "@TheAnuragTyagi",
    profile: "https://x.com/TheAnuragTyagi",
    image: "/assets/anurag.jpg",
    role: "Student Advocate & Educator",
    contribution: "Consistently amplified student voices and provided a public platform for grievances during the OSM evaluation crisis. By compiling and sharing direct evidence of marking anomalies, he played a crucial role in bringing widespread attention to the systemic failures affecting students.",
    sources: [
      ["X Profile & Advocacy", "https://x.com/TheAnuragTyagi"],
    ],
  },
  {
    name: "Sarthak Sidhant",
    handle: "@sidhant_sarthak",
    profile: "https://x.com/sidhant_sarthak",
    image: "/assets/sarthak.jpg",
    role: "Tender-document investigator",
    contribution: "Published a document-led analysis arguing that CBSE tender terms changed across rounds in ways that may have benefited Coempt EduTeck. His work pushed the OSM controversy from scattered student complaints into procurement and accountability questions.",
    sources: [
      ["Original blog", "https://sarthaksidhant.com/coempt/"],
    ],
  },
  {
    name: "Nisarga Adhikary",
    handle: "@ni5arga",
    profile: "https://x.com/ni5arga",
    image: "/assets/nisarga.jpg",
    role: "Security researcher and disclosure lead",
    contribution: "Reported critical weaknesses in CBSE-linked OnMark/OSM systems, including access-control concerns and later cloud-storage exposure allegations. Media coverage says CBSE acknowledged vulnerabilities in the service-provider portal and deployed cybersecurity experts.",
    sources: [
      ["Personal site", "https://ni5arga.com/"],
    ],
  },
  {
    name: "Sidharth Sharma",
    handle: "@sidharthify",
    profile: "https://x.com/sidharthify",
    image: "/assets/Sidharth.jpg",
    role: "Technical writer and infrastructure analyst",
    contribution: "Authored a detailed technical write-up connecting the broader OnMark portal issues, crediting Nisarga, Sarthak, and Tirth, and documenting alleged weak credentials, outdated frontend dependencies, and disclosure activity in a public narrative.",
    sources: [
      ["CBSE OnMark blog", "https://sidharthify.tech/blogs/blog-31-05-26/"],
      ["Personal site", "https://sidharthify.tech/"],
      ["Breathe OSS profile", "https://breatheoss.app/"],
    ],
  },
  {
    name: "Tirth Parmar",
    handle: "@thetirthparmar",
    profile: "https://x.com/thetirthparmar",
    image: "/assets/tirth.jpg",
    role: "Security collaborator",
    contribution: "Credited in Sidharth's technical write-up as collaborating with Nisarga on deeper OnMark portal testing. Public mirrors also show his posts being cited in the CBSE cybersecurity discussion.",
    sources: [
      ["Sidharth technical write-up", "https://sidharthify.tech/blogs/blog-31-05-26/"],
      ["LinkedIn profile", "https://in.linkedin.com/in/thetirthparmar"],
      ["Public X mirror reference", "https://www.sotwe.com/NaPa01770529"],
    ],
  },
];

function App() {
  const [route, setRoute] = useState(getRouteFromHash);
  const [isDark, setIsDark] = useState(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("theme");
      if (stored) return stored === "dark";
      return window.matchMedia("(prefers-color-scheme: dark)").matches;
    }
    return false;
  });

  React.useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [isDark]);

  React.useEffect(() => {
    const handleRouteChange = () => setRoute(getRouteFromHash());
    window.addEventListener("hashchange", handleRouteChange);
    return () => window.removeEventListener("hashchange", handleRouteChange);
  }, []);

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 transition-colors duration-200">
      <SiteHeader route={route} isDark={isDark} toggleDark={() => setIsDark(!isDark)} />
      <main className="relative">
        {route === "home" && <Hero />}
        {route === "issues" && <IssueOverview />}
        {route === "results" && <ResultsIssues />}
        {route === "images" && <GalleryPage />}
        {route === "goats" && <GoatsPage />}
        {route === "contribute" && <CallToAction />}
        {route === "error" && <ErrorPage />}
      </main>
      <footer className="py-12 md:py-20 text-center text-[10px] font-medium uppercase tracking-[0.2em] text-slate-300 dark:text-slate-600">
        CBSE OSM Accountability Log &copy; 2026
      </footer>
    </div>
  );
}

function getRouteFromHash() {
  const route = window.location.hash.replace(/^#\/?/, "") || "home";
  const found = routes.some((item) => item.id === route);
  return found ? route : (route === "home" ? "home" : "error");
}

function SiteHeader({ route, isDark, toggleDark }) {
  return (
    <header className="misty-blur sticky top-0 z-50 bg-white/70 dark:bg-slate-950/70 border-b border-transparent dark:border-slate-800/50 transition-colors duration-200">
      <nav className="mx-auto flex max-w-5xl flex-col items-center justify-between px-6 py-6 md:flex-row md:px-8">
        <div className="flex w-full justify-between items-center md:w-auto">
          <a className="group flex items-center gap-4" href="#/">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#7dbefa]/10 p-1.5 transition-colors group-hover:bg-[#7dbefa]/20">      
              <img className="h-full w-full object-contain opacity-50" src="/assets/cbse-logo.png" alt="CBSE" />
            </div>
            <span className="font-display text-xs font-bold uppercase tracking-[0.3em] text-[#7dbefa]">Accountability Log</span>
          </a>
          <button 
            onClick={toggleDark} 
            className="md:hidden flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 hover:text-[#7dbefa] transition-colors"
            aria-label="Toggle Dark Mode"
          >
            {isDark ? <Sun size={14} /> : <Moon size={14} />}
          </button>
        </div>
        <div className="mt-6 flex w-full max-w-full items-center gap-2 overflow-x-auto pb-2 hide-scrollbar md:mt-0 md:w-auto md:overflow-visible md:pb-0">
          {routes.map((item) => (
            <a
              className={`shrink-0 rounded-full px-4 py-2 text-[10px] font-bold uppercase tracking-widest transition-all ${
                route === item.id 
                  ? "bg-[#7dbefa] text-white" 
                  : "text-slate-400 hover:text-[#7dbefa] dark:hover:text-[#7dbefa]"
              }`}
              href={item.href}
              key={item.id}
            >
              {item.label}
            </a>
          ))}
          <button 
            onClick={toggleDark} 
            className="hidden md:flex ml-4 h-8 w-8 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 hover:text-[#7dbefa] transition-colors shrink-0"
            aria-label="Toggle Dark Mode"
          >
            {isDark ? <Sun size={14} /> : <Moon size={14} />}
          </button>
        </div>
      </nav>
    </header>
  );
}

function Hero() {
  return (
    <section className="relative overflow-hidden pt-24 pb-20 md:pt-32 md:pb-40">
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-white via-slate-50/30 to-white dark:from-slate-950 dark:via-slate-900/30 dark:to-slate-950" />
      <div className="mx-auto max-w-5xl px-6 text-center md:px-8">
        <div className="mb-10 inline-flex items-center gap-3 text-[10px] font-bold uppercase tracking-[0.3em] text-[#7dbefa]/60">
          <Newspaper size={12} className="text-[#7dbefa]/40" />
          <span>Public Interest Audit</span>
        </div>
        
        <h1 className="font-display text-4xl font-light tracking-tight text-slate-900 dark:text-slate-100 sm:text-6xl md:text-7xl lg:leading-[1.1]">
          Open records for <br/>
          <span className="font-display font-bold italic text-[#7dbefa]">digital accountability</span>
        </h1>
        
        <p className="mx-auto mt-12 max-w-xl text-sm leading-loose text-slate-400 sm:text-base">
          A transparent repository documenting institutional failures, security gaps, and procurement anomalies in the CBSE digital marking infrastructure.
        </p>
        
        <div className="mt-12 flex flex-col items-center justify-center gap-4 sm:flex-row md:mt-16 md:gap-6">
          <a
            className="inline-flex h-12 w-full items-center justify-center rounded-full bg-[#7dbefa] px-10 text-[10px] font-bold uppercase tracking-widest text-white transition-transform hover:scale-[1.02] active:scale-[0.98] sm:w-auto"
            href="#/issues"
          >
            Explore the Log
          </a>
          <a
            className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-full border border-slate-100 dark:border-slate-800 px-10 text-[10px] font-bold uppercase tracking-widest text-slate-400 transition-colors hover:border-[#7dbefa] hover:text-[#7dbefa] sm:w-auto"
            href="https://github.com/ashyyhere/cbse-accountability-log"
            rel="noreferrer"
            target="_blank"
          >
            <Github size={14} />
            GitHub
          </a>
        </div>
      </div>
    </section>
  );
}

function IssueOverview() {
  return (
    <section className="mx-auto max-w-5xl px-6 py-20 md:px-8 md:py-32">
      <div className="mb-16 text-center md:mb-24">
        <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-300 dark:text-slate-600">Observation Pillars</p>
        <h2 className="font-display mt-6 text-3xl font-light tracking-tight text-slate-900 dark:text-slate-100 sm:text-5xl">Tracking Systemic Risk</h2>
      </div>
      <div className="grid gap-x-12 gap-y-16 sm:grid-cols-2 md:gap-y-20 lg:grid-cols-4">
        {issueCards.map((card) => {
          const Icon = card.icon;
          return (
            <article key={card.title} className="group">
              <Icon size={20} className={`${card.color} mb-6 opacity-40 transition-opacity group-hover:opacity-100 md:mb-8`} />
              <h3 className="font-display text-xs font-bold uppercase tracking-widest text-slate-900 dark:text-slate-100">
                {card.title === "Security & Vulnerabilities" ? <span className="text-[#7dbefa]">{card.title}</span> : card.title}
              </h3>
              <p className="mt-4 text-xs leading-relaxed text-slate-400">{card.description}</p>
            </article>
          );
        })}
      </div>
    </section>
  );
}

function ResultsIssues() {
  return (
    <section className="mx-auto max-w-5xl px-6 py-20 md:px-8 md:py-32">
      <div className="mb-16 md:mb-24">
        <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-300 dark:text-slate-600">Field Evidence</p>       
        <h2 className="font-display mt-6 text-3xl font-light tracking-tight text-slate-900 dark:text-slate-100 sm:text-5xl">Evaluation Quality Reports</h2>
      </div>
      <div className="grid gap-8 md:grid-cols-2 md:gap-12">
        {resultIssues.map((issue) => {
          const Icon = issue.icon;
          return (
            <article key={issue.title} className="soft-shadow rounded-3xl bg-white dark:bg-slate-900/50 p-8 border border-slate-50 dark:border-slate-800/50 md:p-10">
              <div className="mb-6 flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-6 md:mb-8 md:pb-8">
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-300 dark:text-slate-600">{issue.type}</p>  
                <Icon size={18} className="text-[#7dbefa]/30" />
              </div>
              <h3 className="font-display text-xl font-medium tracking-tight text-slate-900 dark:text-slate-100">{issue.title}</h3>       
              <p className="mt-6 text-sm leading-loose text-slate-400">{issue.summary}</p>
              {issue.evidence && (
                <div className="mt-8 rounded-2xl bg-slate-50 dark:bg-slate-900/50 p-6 text-[10px] font-medium leading-relaxed tracking-wide text-slate-400">
                  <span className="block text-slate-300 dark:text-slate-600 uppercase mb-2">Requirements</span>
                  {issue.evidence}
                </div>
              )}
            </article>
          );
        })}
      </div>
    </section>
  );
}

function GalleryPage() {
  const categories = [...new Set(galleryItems.map(item => item.category))];

  return (
    <section className="mx-auto max-w-5xl px-6 py-20 md:px-8 md:py-32">
      <div className="mb-16 text-center md:mb-24">
        <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-300 dark:text-slate-600">Visual Archive</p>     
        <h2 className="font-display mt-6 text-3xl font-light tracking-tight text-slate-900 dark:text-slate-100 sm:text-5xl">Traceable Evidence</h2>
      </div>
      {galleryItems.length > 0 ? (
        <div className="flex flex-col gap-24 md:gap-32">
          {categories.map(category => (
            <div key={category}>
              <div className="mb-12 border-b border-slate-100 dark:border-slate-800 pb-6 md:mb-16">
                <h3 className="font-display text-2xl font-light tracking-tight text-slate-900 dark:text-slate-100 md:text-3xl">{category}</h3>
              </div>
              <div className="grid gap-x-12 gap-y-16 sm:grid-cols-2 md:gap-y-24 lg:grid-cols-3">
                {galleryItems.filter(item => item.category === category).map((asset) => (
                  <article key={asset.title}>
                    <div className="aspect-square overflow-hidden rounded-3xl bg-slate-50 dark:bg-slate-900 transition-transform hover:scale-[1.02]">
                      {asset.path ? (
                        <img className="h-full w-full object-cover grayscale opacity-50 contrast-125 hover:grayscale-0 hover:opacity-100 transition-all duration-500" src={asset.path} alt={asset.title} />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center border border-dashed border-slate-100 dark:border-slate-800">
                          <ImageIcon className="text-[#7dbefa]/20" size={24} />
                        </div>
                      )}
                    </div>
                    <div className="mt-8 md:mt-10">
                      <p className="text-[8px] font-bold uppercase tracking-[0.2em] text-[#7dbefa]/50 mb-3">{asset.category}</p>
                      <h3 className="font-display text-xs font-bold uppercase tracking-widest text-slate-900 dark:text-slate-100">{asset.title}</h3>
                      <p className="mt-4 text-xs leading-relaxed text-slate-400">{asset.caption}</p>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="py-20 text-center rounded-[3rem] border border-dashed border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/30">
          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-300 dark:text-slate-600">No images uploaded yet</p>
        </div>
      )}
    </section>
  );
}

function GoatsPage() {
  return (
    <section className="mx-auto max-w-5xl px-6 py-20 md:px-8 md:py-32">
      <div className="mb-16 text-center md:mb-24">
        <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-300 dark:text-slate-600">Contributors</p>
        <h2 className="font-display mt-6 text-4xl font-light tracking-tight text-slate-900 dark:text-slate-100 sm:text-6xl">The Goats</h2>
      </div>
      <div className="grid gap-8 md:grid-cols-2 md:gap-12">
        {goats.map((person) => (
          <article key={person.name} className="soft-shadow flex flex-col rounded-[2rem] bg-white dark:bg-slate-900/50 p-8 border border-slate-50 dark:border-slate-800/50 md:rounded-[3rem] md:p-12">
            <div className="mb-8 flex items-center gap-4 md:mb-10 md:gap-6">
              <img 
                src={person.image} 
                alt={`${person.name} profile`} 
                className="h-16 w-16 rounded-full object-cover shadow-sm bg-slate-50 dark:bg-slate-900 border-2 border-white dark:border-slate-800 md:h-20 md:w-20"
                onError={(e) => { e.target.src = 'https://abs.twimg.com/sticky/default_profile_images/default_profile_400x400.png' }}
              />
              <div>
                <h3 className="font-display text-xl font-light tracking-tight text-slate-900 dark:text-slate-100 md:text-2xl">{person.name}</h3>
                <a className="mt-1 block text-[10px] font-bold uppercase tracking-widest text-slate-400 hover:text-[#7dbefa] transition-colors" href={person.profile} target="_blank" rel="noreferrer">
                  {person.handle}
                </a>
              </div>
            </div>
            <p className="mb-6 text-[10px] font-bold uppercase tracking-widest text-[#7dbefa]/60 md:mb-10 md:text-xs">{person.role}</p>
            <p className="flex-1 text-sm leading-loose text-slate-400 font-light">{person.contribution}</p>
            <div className="mt-8 flex flex-wrap gap-2 pt-6 border-t border-slate-100 dark:border-slate-800 md:mt-12 md:pt-8">
              {person.sources.map(([label, href]) => (
                <a
                  className="rounded-full border border-slate-100 dark:border-slate-800 px-4 py-2 text-[8px] font-bold uppercase tracking-widest text-slate-400 transition-all hover:border-[#7dbefa] hover:text-[#7dbefa]"
                  href={href}
                  key={href}
                  target="_blank"
                  rel="noreferrer"
                >
                  {label}
                </a>
              ))}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function CallToAction() {
  return (
    <section className="mx-auto max-w-5xl px-6 py-20 md:px-8 md:py-40">        
      <div className="rounded-[2rem] bg-[#7dbefa]/5 py-20 px-8 text-center md:rounded-[40px] md:py-32 md:px-12">
        <div className="mx-auto max-w-xl">
          <BookOpenCheck size={28} className="mx-auto mb-8 text-[#7dbefa]/20 md:mb-10" />
          <h2 className="font-display text-3xl font-light tracking-tight text-slate-900 dark:text-slate-100 sm:text-5xl">Institutional Change</h2>
          <p className="mt-6 text-sm leading-loose text-slate-400 md:mt-10">
            This log is a collective effort to push for transparency. If you have verifiable evidence or technical insights, contribute to the open-source repository.
          </p>
          <a
            className="mt-10 inline-flex h-12 items-center justify-center rounded-full bg-[#7dbefa] px-10 text-[10px] font-bold uppercase tracking-widest text-white transition-transform hover:scale-[1.02] md:mt-16"
            href="https://github.com/ashyyhere/cbse-accountability-log"
            target="_blank"
            rel="noreferrer"
          >
            Contribute to Repository
          </a>
        </div>
      </div>
    </section>
  );
}

function ErrorPage() {
  return (
    <section className="mx-auto flex max-w-5xl flex-col items-center justify-center px-6 py-24 text-center min-h-[70vh] md:px-8 md:py-40">
      <div className="flex h-24 w-24 items-center justify-center rounded-full bg-[#fb3b64]/10 text-[#fb3b64] mb-8 md:mb-10">
        <AlertTriangle size={40} />
      </div>
      <h2 className="font-display text-4xl font-light tracking-tight text-slate-900 dark:text-slate-100 sm:text-6xl">Page Not Found</h2>
      <p className="mt-6 text-base leading-loose text-slate-400 max-w-xl md:text-lg">
        Something went wrong or the data you are looking for has been moved. Return to the registry to continue exploring the public log.
      </p>
      <a
        className="mt-10 inline-flex h-12 items-center justify-center rounded-full bg-[#fb3b64] px-10 text-[10px] font-bold uppercase tracking-widest text-white transition-transform hover:scale-[1.02] md:mt-12"
        href="#/"
      >
        Return Home
      </a>
    </section>
  );
}

createRoot(document.getElementById("root")).render(<App />);

