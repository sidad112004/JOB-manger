import React, { useState } from 'react';
import {
  Chrome, Download, FolderOpen, ToggleRight, CheckCircle2,
  Briefcase, Users, ClipboardList, Building2, Search,
  ArrowRight, ExternalLink, Copy, Check, Zap, Globe, Bell
} from 'lucide-react';

const DRIVE_LINK = 'https://drive.google.com/drive/folders/1MWmz3nMYICvJjbaKhVVjuyFzSU8rVefv?usp=sharing';

const steps = [
  {
    n: '01',
    icon: Download,
    color: 'text-blue-600',
    bg: 'bg-blue-50',
    title: 'Download the Extension',
    desc: 'Click the button below to open the Google Drive folder. Download the entire extension folder to your computer.',
    action: true,
  },
  {
    n: '02',
    icon: FolderOpen,
    color: 'text-amber-600',
    bg: 'bg-amber-50',
    title: 'Extract & Prepare',
    desc: 'After downloading, extract the zip (if needed). You should have a folder called "extension" with these files inside:',
    files: ['manifest.json', 'background.js', 'sidepanel.html', 'sidepanel.css', 'sidepanel.js', 'icons/'],
  },
  {
    n: '03',
    icon: Chrome,
    color: 'text-green-600',
    bg: 'bg-green-50',
    title: 'Open Chrome Extensions',
    desc: 'Open Google Chrome and navigate to the extensions page.',
    code: 'chrome://extensions',
  },
  {
    n: '04',
    icon: ToggleRight,
    color: 'text-purple-600',
    bg: 'bg-purple-50',
    title: 'Enable Developer Mode',
    desc: 'In the top-right corner of the extensions page, toggle on Developer Mode. This allows you to load unpacked extensions.',
  },
  {
    n: '05',
    icon: FolderOpen,
    color: 'text-indigo-600',
    bg: 'bg-indigo-50',
    title: 'Load Unpacked Extension',
    desc: 'Click the "Load unpacked" button that appears after enabling Developer Mode. Then select the extension folder you downloaded.',
  },
  {
    n: '06',
    icon: CheckCircle2,
    color: 'text-emerald-600',
    bg: 'bg-emerald-50',
    title: 'Pin & Use',
    desc: 'The ReachlistTracker icon will appear in your Chrome toolbar. Click the puzzle icon 🧩 to pin it for easy access. Then click it to open the sidebar!',
  },
];

const features = [
  {
    icon: Briefcase,
    color: 'text-blue-600',
    bg: 'bg-blue-50',
    title: 'Add Job Applications',
    desc: 'Visit any job posting. The current page URL auto-fills as the job link. Select or create a company, fill role details, and save in seconds.',
  },
  {
    icon: Users,
    color: 'text-indigo-600',
    bg: 'bg-indigo-50',
    title: 'Add People & Notes',
    desc: 'On any LinkedIn or profile page, open the sidebar. Add contacts directly with their profile URL auto-filled, or log notes for existing contacts.',
  },
  {
    icon: Building2,
    color: 'text-amber-600',
    bg: 'bg-amber-50',
    title: 'Log Company Notes',
    desc: 'Found something interesting about a company? Log research notes directly from their website — hiring cycles, interview process, culture insights.',
  },
  {
    icon: ClipboardList,
    color: 'text-green-600',
    bg: 'bg-green-50',
    title: 'Manage Tasks',
    desc: 'View and add personal tasks from any page. Mark tasks done, set priorities and due dates — all without leaving your current tab.',
  },
  {
    icon: Search,
    color: 'text-purple-600',
    bg: 'bg-purple-50',
    title: 'Smart Person Detection',
    desc: 'The extension automatically checks if the person on the current page is already in your system and shows a quick "Add Note" button if found.',
  },
  {
    icon: Zap,
    color: 'text-rose-600',
    bg: 'bg-rose-50',
    title: 'Auto URL Detection',
    desc: 'The current page URL updates automatically as you browse. No copy-pasting — just open the sidebar and all fields are pre-filled.',
  },
];

function CopyCode({ text }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <div className="flex items-center gap-2 mt-3 bg-gray-900 text-green-400 rounded-lg px-4 py-2.5 font-mono text-sm">
      <span className="flex-1">{text}</span>
      <button onClick={copy} className="shrink-0 text-gray-400 hover:text-white transition-colors p-1 rounded">
        {copied ? <Check className="h-3.5 w-3.5 text-green-400" /> : <Copy className="h-3.5 w-3.5" />}
      </button>
    </div>
  );
}

export function Extension() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">

      {/* ── Hero ──────────────────────────────────────────────── */}
      <div className="relative bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl p-8 overflow-hidden">
        {/* Decorative circles */}
        <div className="absolute -right-8 -top-8 w-48 h-48 rounded-full bg-white/5" />
        <div className="absolute -right-4 -bottom-10 w-32 h-32 rounded-full bg-white/5" />

        <div className="relative">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-12 w-12 rounded-xl bg-white/15 backdrop-blur flex items-center justify-center">
              <Chrome className="h-6 w-6 text-white" />
            </div>
            <div>
              <div className="text-xs font-semibold text-blue-200 uppercase tracking-widest">Chrome Extension</div>
              <h1 className="text-2xl font-bold text-white leading-tight">ReachlistTracker Sidebar</h1>
            </div>
          </div>
          <p className="text-blue-100 text-sm leading-relaxed max-w-xl mb-6">
            Add jobs, contacts and notes to your tracker directly from any webpage —
            without switching tabs. The sidebar stays open while you browse.
          </p>
          <div className="flex flex-wrap gap-3">
            <a
              href={DRIVE_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-blue-700 text-sm font-bold rounded-xl hover:bg-blue-50 transition-colors shadow-sm"
            >
              <Download className="h-4 w-4" />
              Download Extension
              <ExternalLink className="h-3 w-3 opacity-60" />
            </a>
            <div className="inline-flex items-center gap-2 px-4 py-2.5 bg-white/10 text-white text-sm font-medium rounded-xl">
              <CheckCircle2 className="h-4 w-4 text-green-300" />
              Chrome 114+ required
            </div>
          </div>
        </div>
      </div>

      {/* ── Setup steps ───────────────────────────────────────── */}
      <div>
        <div className="mb-6">
          <h2 className="text-lg font-bold text-gray-900">How to Install</h2>
          <p className="text-sm text-gray-500 mt-0.5">Follow these 6 steps to get the extension running in under 2 minutes.</p>
        </div>

        <div className="space-y-4">
          {steps.map((step, i) => (
            <div
              key={step.n}
              className="bg-white rounded-xl border border-gray-100 p-5 flex gap-4 hover:border-gray-200 hover:shadow-sm transition-all"
            >
              {/* Step number + icon */}
              <div className="flex flex-col items-center gap-2 shrink-0">
                <div className={`h-10 w-10 rounded-xl ${step.bg} flex items-center justify-center`}>
                  <step.icon className={`h-5 w-5 ${step.color}`} />
                </div>
                {i < steps.length - 1 && (
                  <div className="w-px flex-1 min-h-[12px] bg-gray-100" />
                )}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] font-bold text-gray-300 font-mono">STEP {step.n}</span>
                </div>
                <h3 className="text-sm font-semibold text-gray-900 mb-1">{step.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{step.desc}</p>

                {/* Download button */}
                {step.action && (
                  <a
                    href={DRIVE_LINK}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 mt-3 px-4 py-2 bg-blue-600 text-white text-xs font-bold rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Download className="h-3.5 w-3.5" />
                    Open Google Drive Folder
                    <ExternalLink className="h-3 w-3 opacity-70" />
                  </a>
                )}

                {/* File list */}
                {step.files && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {step.files.map(f => (
                      <span key={f} className="px-2.5 py-1 bg-gray-100 text-gray-600 text-xs font-mono rounded-md">
                        {f}
                      </span>
                    ))}
                  </div>
                )}

                {/* Code snippet */}
                {step.code && <CopyCode text={step.code} />}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Features ──────────────────────────────────────────── */}
      <div>
        <div className="mb-6">
          <h2 className="text-lg font-bold text-gray-900">What You Can Do</h2>
          <p className="text-sm text-gray-500 mt-0.5">Everything the extension lets you do without leaving your current page.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {features.map(f => (
            <div key={f.title} className="bg-white rounded-xl border border-gray-100 p-4 hover:border-gray-200 hover:shadow-sm transition-all">
              <div className={`h-9 w-9 rounded-lg ${f.bg} flex items-center justify-center mb-3`}>
                <f.icon className={`h-4.5 w-4.5 ${f.color}`} />
              </div>
              <h3 className="text-sm font-semibold text-gray-900 mb-1">{f.title}</h3>
              <p className="text-xs text-gray-500 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Tips ─────────────────────────────────────────────── */}
      <div className="bg-amber-50 border border-amber-100 rounded-2xl p-6">
        <h2 className="text-sm font-bold text-amber-800 mb-4 flex items-center gap-2">
          <Bell className="h-4 w-4" /> Tips for Best Experience
        </h2>
        <ul className="space-y-3">
          {[
            'Pin the extension to your Chrome toolbar for one-click access — click the 🧩 puzzle icon and pin ReachlistTracker.',
            'The sidebar stays open as you browse. Navigate between pages and the URL updates automatically in the sidebar.',
            'On LinkedIn profile pages, the extension detects if that person is already in your system and shows a quick note button.',
            'Use the Tasks section in the sidebar to capture quick to-dos while you\'re actively applying.',
            'The extension works with your live account — everything saves directly to your ReachlistTracker data.',
          ].map((tip, i) => (
            <li key={i} className="flex items-start gap-2.5 text-sm text-amber-700">
              <ArrowRight className="h-4 w-4 shrink-0 mt-0.5 text-amber-400" />
              {tip}
            </li>
          ))}
        </ul>
      </div>

      {/* ── Requirements ─────────────────────────────────────── */}
      <div className="bg-white rounded-xl border border-gray-100 p-6">
        <h2 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
          <Globe className="h-4 w-4 text-gray-400" /> Requirements
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { label: 'Browser', value: 'Google Chrome 114 or newer', ok: true },
            { label: 'Account', value: 'Active ReachlistTracker account', ok: true },
            { label: 'Firefox / Safari', value: 'Not supported (Chrome only)', ok: false },
          ].map(r => (
            <div key={r.label} className="flex items-start gap-2.5">
              <div className={`h-5 w-5 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${r.ok ? 'bg-green-100' : 'bg-red-100'}`}>
                {r.ok
                  ? <CheckCircle2 className="h-3 w-3 text-green-600" />
                  : <span className="text-red-500 text-xs font-bold">✕</span>
                }
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-700">{r.label}</p>
                <p className="text-xs text-gray-400 mt-0.5">{r.value}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── CTA ──────────────────────────────────────────────── */}
      <div className="text-center py-4">
        <a
          href={DRIVE_LINK}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white text-sm font-bold rounded-xl hover:bg-blue-700 transition-colors shadow-md"
        >
          <Download className="h-4 w-4" />
          Download Extension from Google Drive
          <ExternalLink className="h-3.5 w-3.5 opacity-70" />
        </a>
        <p className="text-xs text-gray-400 mt-3">Free to use · No additional setup required</p>
      </div>

    </div>
  );
}
