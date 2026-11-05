import { useEffect, useMemo, useState } from 'react';
import {
  ArrowRight,
  Baby,
  Bell,
  BookOpen,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  CircleHelp,
  Clock3,
  Heart,
  Home,
  Info,
  Leaf,
  Menu,
  MessageCircle,
  NotebookPen,
  PhoneCall,
  Play,
  Plus,
  Send,
  ShieldCheck,
  Sparkles,
  Sun,
  Wind,
  X,
} from 'lucide-react';

type Tab = 'Today' | 'Learn' | 'Journal' | 'Care team';

const moods = [
  { label: 'Peaceful', emoji: '☺', color: '#b8e4d3' },
  { label: 'Okay', emoji: '•ᴗ•', color: '#dce8c0' },
  { label: 'Tired', emoji: '◡︵◡', color: '#f5dfb7' },
  { label: 'Anxious', emoji: '◕︵◕', color: '#f3c5c0' },
];

const symptoms = ['Nausea', 'Headache', 'Back ache', 'Swelling', 'Breathless', 'None today'];

const lessons = [
  { id: 'movement', category: 'Your body', title: 'Understanding baby movement', time: '4 min read', icon: Baby, color: 'bg-[#eaf6ef] text-[#5e9882]', summary: 'Learn what movement patterns can feel like in the third trimester and when to pause and check in.', points: ['Every baby has a different rhythm.', 'Notice your baby’s usual pattern, not a perfect number.', 'Contact your maternity team if movement feels reduced or different.'] },
  { id: 'rest', category: 'Wellbeing', title: 'Why rest is real care', time: '3 min read', icon: Heart, color: 'bg-[#fff1ec] text-[#df7967]', summary: 'Rest supports your changing body, your nervous system, and the energy you need for birth and recovery.', points: ['Short pauses count as rest.', 'Ask for practical support before you feel depleted.', 'Gentle movement and comfortable positions can help.'] },
  { id: 'appointments', category: 'Prepare', title: 'Make appointments work for you', time: '5 min read', icon: NotebookPen, color: 'bg-[#eef6f7] text-[#5d9c9b]', summary: 'A simple way to bring questions, symptoms, and preferences into your next care conversation.', points: ['Write down changes since your last visit.', 'Bring your questions, even if they feel small.', 'Ask who to contact between appointments.'] },
];

function App() {
  const [activeTab, setActiveTab] = useState<Tab>('Today');
  const [mood, setMood] = useState('');
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [checkInSaved, setCheckInSaved] = useState(false);
  const [breathing, setBreathing] = useState(false);
  const [breathCount, setBreathCount] = useState(4);
  const [showMenu, setShowMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [urgentHelp, setUrgentHelp] = useState(false);
  const [expandedLesson, setExpandedLesson] = useState<string | null>(null);
  const [completedLessons, setCompletedLessons] = useState<string[]>([]);
  const [journal, setJournal] = useState('');
  const [savedJournal, setSavedJournal] = useState('');
  const [message, setMessage] = useState('');
  const [sentMessage, setSentMessage] = useState('');
  const [careToast, setCareToast] = useState(false);

  useEffect(() => {
    if (!breathing) return;
    const timer = window.setInterval(() => setBreathCount((value) => (value === 4 ? 1 : value + 1)), 1000);
    return () => window.clearInterval(timer);
  }, [breathing]);

  const toggleSymptom = (symptom: string) => {
    setSelectedSymptoms((current) => current.includes(symptom) ? current.filter((item) => item !== symptom) : symptom === 'None today' ? ['None today'] : [...current.filter((item) => item !== 'None today'), symptom]);
    setCheckInSaved(false);
  };

  const navigate = (tab: Tab) => {
    setActiveTab(tab);
    setShowMenu(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const completedCount = completedLessons.length;
  const todayLabel = useMemo(() => new Intl.DateTimeFormat('en', { weekday: 'long', month: 'long', day: 'numeric' }).format(new Date()), []);

  return (
    <div className="min-h-screen bg-[#fffaf6] text-[#24363a]">
      <header className="sticky top-0 z-30 border-b border-[#efe5de] bg-[#fffaf6]/95 backdrop-blur">
        <div className="mx-auto flex max-w-[1180px] items-center justify-between px-5 py-4 sm:px-8 lg:px-10">
          <button onClick={() => navigate('Today')} className="flex items-center gap-3 text-left">
            <div className="grid h-10 w-10 place-items-center rounded-[15px] bg-[#2f6260] text-white shadow-[0_8px_20px_rgba(47,98,96,.18)]"><Leaf size={19} /></div>
            <div><p className="text-[17px] font-bold tracking-[-.04em]">Placenta<span className="text-[#df7967]">Sync</span></p><p className="text-[9px] font-bold uppercase tracking-[.19em] text-[#a2a9a4]">Your gentle care loop</p></div>
          </button>
          <nav className="hidden items-center gap-1 rounded-full border border-[#eee4dc] bg-white p-1 lg:flex">
            {(['Today', 'Learn', 'Journal', 'Care team'] as Tab[]).map((tab) => <button key={tab} onClick={() => navigate(tab)} className={`rounded-full px-4 py-2 text-[11px] font-bold transition ${activeTab === tab ? 'bg-[#2f6260] text-white' : 'text-[#7b8985] hover:bg-[#f8f2ed]'}`}>{tab === 'Learn' && <BookOpen size={13} className="mr-1 inline" />}{tab === 'Journal' && <NotebookPen size={13} className="mr-1 inline" />}{tab === 'Care team' && <MessageCircle size={13} className="mr-1 inline" />}{tab}</button>)}
          </nav>
          <div className="relative flex items-center gap-2">
            <button onClick={() => setShowNotifications(!showNotifications)} className="relative grid h-9 w-9 place-items-center rounded-full border border-[#eee4dc] text-[#758581]"><Bell size={16} /><span className="absolute right-2 top-1.5 h-1.5 w-1.5 rounded-full bg-[#df7967]" /></button>
            <button className="hidden items-center gap-2 rounded-full bg-[#f7efe9] px-3 py-2 text-[11px] font-bold text-[#866c61] sm:flex"><Sun size={14} className="text-[#e7a65a]" /> 28 weeks</button>
            <button onClick={() => setShowMenu(!showMenu)} className="grid h-9 w-9 place-items-center rounded-full border border-[#eee4dc] text-[#758581] lg:hidden">{showMenu ? <X size={17} /> : <Menu size={17} />}</button>
            <div className="hidden h-9 w-9 place-items-center rounded-full bg-[#f2cfc3] text-[10px] font-bold text-[#8c5c52] sm:grid">AM</div>
            {showNotifications && <div className="absolute right-0 top-12 z-40 w-72 rounded-2xl border border-[#efe5de] bg-white p-4 text-left shadow-xl"><div className="flex items-center justify-between"><p className="text-xs font-bold">Your notifications</p><button onClick={() => setShowNotifications(false)}><X size={14} className="text-[#9aa39f]" /></button></div><p className="mt-3 rounded-xl bg-[#eff8f4] p-3 text-[11px] leading-relaxed text-[#4c756b]"><b>All clear.</b> Your care team has no new requests today.</p></div>}
          </div>
        </div>
        {showMenu && <div className="mx-5 mb-4 rounded-2xl border border-[#efe5de] bg-white p-2 shadow-lg lg:hidden">{(['Today', 'Learn', 'Journal', 'Care team'] as Tab[]).map((tab) => <button key={tab} onClick={() => navigate(tab)} className={`flex w-full items-center gap-3 rounded-xl p-3 text-left text-xs font-bold ${activeTab === tab ? 'bg-[#eff8f4] text-[#34716d]' : 'text-[#71807b]'}`}>{tab === 'Today' ? <Home size={16} /> : tab === 'Learn' ? <BookOpen size={16} /> : tab === 'Journal' ? <NotebookPen size={16} /> : <MessageCircle size={16} />}{tab}</button>)}</div>}
      </header>

      <main className="mx-auto max-w-[1180px] px-5 pb-10 sm:px-8 lg:px-10">
        {activeTab === 'Today' && <TodayPage {...{ mood, setMood, selectedSymptoms, toggleSymptom, checkInSaved, setCheckInSaved, breathing, setBreathing, breathCount, setBreathCount, navigate, setUrgentHelp, careToast, setCareToast, todayLabel }} />}
        {activeTab === 'Learn' && <LearnPage expandedLesson={expandedLesson} setExpandedLesson={setExpandedLesson} completedLessons={completedLessons} setCompletedLessons={setCompletedLessons} />}
        {activeTab === 'Journal' && <JournalPage journal={journal} setJournal={setJournal} savedJournal={savedJournal} setSavedJournal={setSavedJournal} />}
        {activeTab === 'Care team' && <CareTeamPage message={message} setMessage={setMessage} sentMessage={sentMessage} setSentMessage={setSentMessage} />}
      </main>

      {urgentHelp && <div className="fixed inset-0 z-50 grid place-items-center bg-[#24363a]/35 p-5"><div className="w-full max-w-md rounded-[26px] bg-white p-6 shadow-2xl"><div className="flex items-start justify-between"><div className="grid h-10 w-10 place-items-center rounded-xl bg-[#fff0eb] text-[#df7967]"><PhoneCall size={19} /></div><button onClick={() => setUrgentHelp(false)}><X size={18} className="text-[#9aa39f]" /></button></div><h2 className="mt-5 text-xl font-bold">You know your body best.</h2><p className="mt-2 text-sm leading-relaxed text-[#71807b]">If something feels urgent, contact your maternity team or local emergency services now. PlacentaSync cannot assess emergencies.</p><div className="mt-5 space-y-2"><button onClick={() => setUrgentHelp(false)} className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#df7967] py-3 text-xs font-bold text-white">I understand <ArrowRight size={14} /></button><button onClick={() => setUrgentHelp(false)} className="w-full rounded-xl border border-[#eee5de] py-3 text-xs font-bold text-[#71807b]">Close</button></div></div></div>}
    </div>
  );
}

function TodayPage(props: {
  mood: string; setMood: (value: string) => void; selectedSymptoms: string[]; toggleSymptom: (value: string) => void; checkInSaved: boolean; setCheckInSaved: (value: boolean) => void; breathing: boolean; setBreathing: (value: boolean) => void; breathCount: number; setBreathCount: (value: number) => void; navigate: (tab: Tab) => void; setUrgentHelp: (value: boolean) => void; careToast: boolean; setCareToast: (value: boolean) => void; todayLabel: string;
}) {
  const { mood, setMood, selectedSymptoms, toggleSymptom, checkInSaved, setCheckInSaved, breathing, setBreathing, breathCount, setBreathCount, navigate, setUrgentHelp, careToast, setCareToast, todayLabel } = props;
  return <><section className="relative mt-3 overflow-hidden rounded-[30px] bg-[#e7f2eb] px-6 py-8 sm:px-10 sm:py-10"><div className="absolute -right-10 -top-20 h-64 w-64 rounded-full border-[34px] border-[#d1e8dc]" /><div className="relative max-w-[650px]"><div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[.2em] text-[#548b78]"><Sparkles size={14} /> {todayLabel}</div><h1 className="mt-4 text-[31px] font-bold leading-[1.08] tracking-[-.06em] text-[#25494a] sm:text-[43px]">A softer way to<br /><span className="text-[#df7967]">check in with you.</span></h1><p className="mt-4 max-w-[510px] text-[13px] leading-relaxed text-[#5b7772]">Your body is doing extraordinary work. Take one quiet minute to notice what you need today.</p><button onClick={() => document.getElementById('check-in')?.scrollIntoView({ behavior: 'smooth' })} className="mt-6 flex items-center gap-2 rounded-xl bg-[#2f6260] px-4 py-3 text-xs font-bold text-white shadow-lg shadow-[#2f6260]/15 transition hover:bg-[#244e4c]">Start today’s check-in <ArrowRight size={15} /></button></div></section>
    <div className="mt-7 grid grid-cols-1 gap-5 lg:grid-cols-[1.25fr_.75fr]"><section id="check-in" className="rounded-[24px] border border-[#eee5de] bg-white p-5 shadow-[0_6px_22px_rgba(94,71,55,.04)] sm:p-7"><div className="flex items-start justify-between"><div><p className="text-[10px] font-bold uppercase tracking-[.2em] text-[#a4aaa4]">Daily check-in · 1 of 3</p><h2 className="mt-2 text-[21px] font-bold tracking-[-.04em]">How are you feeling right now?</h2></div><div className="grid h-9 w-9 place-items-center rounded-full bg-[#fff3ec] text-[#df7967]"><Heart size={17} /></div></div><div className="mt-6 grid grid-cols-2 gap-2 sm:grid-cols-4">{moods.map((item) => <button key={item.label} onClick={() => { setMood(item.label); setCheckInSaved(false); }} className={`rounded-2xl border p-3 text-center transition ${mood === item.label ? 'border-[#4f9684] bg-[#eff8f4] shadow-sm' : 'border-[#f0e7e0] hover:border-[#c8ddd3]'}`}><span className="mx-auto grid h-11 w-11 place-items-center rounded-full text-[19px] font-semibold" style={{ backgroundColor: item.color }}>{item.emoji}</span><span className="mt-2 block text-[11px] font-bold text-[#687874]">{item.label}</span></button>)}</div><div className="mt-7 border-t border-[#f2ebe5] pt-6"><p className="text-[13px] font-bold">Anything your body is telling you?</p><p className="mt-1 text-[11px] text-[#9aa39f]">Select all that feel relevant. There is no right answer.</p><div className="mt-4 flex flex-wrap gap-2">{symptoms.map((symptom) => <button key={symptom} onClick={() => toggleSymptom(symptom)} className={`rounded-full border px-3 py-2 text-[11px] font-semibold transition ${selectedSymptoms.includes(symptom) ? 'border-[#7eb6a1] bg-[#eaf6ef] text-[#397866]' : 'border-[#eee5de] text-[#7b8985] hover:bg-[#fffaf6]'}`}>{selectedSymptoms.includes(symptom) && <Check size={12} className="mr-1 inline" />}{symptom}</button>)}</div></div><button disabled={!mood} onClick={() => setCheckInSaved(true)} className="mt-7 flex w-full items-center justify-center gap-2 rounded-xl bg-[#df7967] py-3 text-xs font-bold text-white shadow-lg shadow-[#df7967]/15 transition hover:bg-[#cc6859] disabled:cursor-not-allowed disabled:opacity-40">{checkInSaved ? <><Check size={15} /> Saved for today</> : <>Save my check-in <ArrowRight size={15} /></>}</button></section>
      <div className="space-y-5"><section className="rounded-[24px] bg-[#2f6260] p-6 text-white shadow-[0_10px_26px_rgba(47,98,96,.14)]"><div className="flex items-start justify-between"><div><p className="text-[10px] font-bold uppercase tracking-[.2em] text-[#a9d8c5]">A moment to settle</p><h2 className="mt-2 text-[22px] font-bold tracking-[-.04em]">Breathe with baby</h2></div><Wind size={23} className="text-[#a9d8c5]" /></div><p className="mt-3 text-[12px] leading-relaxed text-[#c5ded5]">A simple 60-second rhythm to soften your shoulders and slow the day down.</p><div className="mt-6 flex items-center gap-4"><div className={`grid h-20 w-20 shrink-0 place-items-center rounded-full border-2 border-[#91cdb9] ${breathing ? 'animate-pulse bg-[#4b8078]' : 'bg-[#3a716d]'}`}><span className="text-center text-[11px] font-bold">{breathing ? `${breathCount}s` : '1 min'}</span></div><button onClick={() => { setBreathing(!breathing); setBreathCount(4); }} className="rounded-xl bg-white px-4 py-2.5 text-[11px] font-bold text-[#2f6260]">{breathing ? 'Pause' : 'Begin'}</button></div></section><section className="rounded-[24px] border border-[#eee5de] bg-white p-6"><div className="flex items-center gap-3"><div className="grid h-10 w-10 place-items-center rounded-xl bg-[#fff2eb] text-[#df7967]"><Baby size={19} /></div><div><h3 className="text-[14px] font-bold">Baby’s little note</h3><p className="text-[10px] text-[#99a39f]">A gentle reminder for today</p></div></div><p className="mt-5 text-[15px] font-semibold leading-relaxed text-[#405452]">“Your rest is productive too. You don’t have to earn a pause.”</p><button onClick={() => navigate('Learn')} className="mt-5 flex items-center gap-2 text-[10px] font-bold text-[#5e9882]">Explore week 28 learning <ArrowRight size={12} /></button></section></div></div>
    <section className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-3"><button onClick={() => navigate('Learn')} className="rounded-[22px] border border-[#eee5de] bg-white p-5 text-left transition hover:-translate-y-0.5"><div className="flex items-center justify-between"><div className="grid h-9 w-9 place-items-center rounded-xl bg-[#f1f8ed] text-[#78a66f]"><ShieldCheck size={17} /></div><ChevronRight size={16} className="text-[#b0b9b3]" /></div><h3 className="mt-5 text-[14px] font-bold">My care plan</h3><p className="mt-1 text-[11px] leading-relaxed text-[#8c9994]">3 gentle actions prepared with your care team.</p><div className="mt-4 text-[10px] font-bold text-[#5e9882]">2 complete · 1 remaining</div></button><button onClick={() => navigate('Care team')} className="rounded-[22px] border border-[#eee5de] bg-white p-5 text-left transition hover:-translate-y-0.5"><div className="flex items-center justify-between"><div className="grid h-9 w-9 place-items-center rounded-xl bg-[#eef6f7] text-[#64a7a5]"><MessageCircle size={17} /></div><ChevronRight size={16} className="text-[#b0b9b3]" /></div><h3 className="mt-5 text-[14px] font-bold">Ask your care team</h3><p className="mt-1 text-[11px] leading-relaxed text-[#8c9994]">Your midwife Sarah is available today.</p><div className="mt-4 text-[10px] font-bold text-[#5e9882]">Usually replies in 2h</div></button><button onClick={() => setUrgentHelp(true)} className="rounded-[22px] border border-[#f4d9d2] bg-[#fff8f4] p-5 text-left transition hover:-translate-y-0.5"><div className="flex items-center justify-between"><div className="grid h-9 w-9 place-items-center rounded-xl bg-white text-[#df7967]"><PhoneCall size={17} /></div><Info size={16} className="text-[#c9958b]" /></div><h3 className="mt-5 text-[14px] font-bold text-[#704f4a]">Need urgent help?</h3><p className="mt-1 text-[11px] leading-relaxed text-[#98746d]">If something feels wrong, trust yourself and contact your clinician.</p><span className="mt-4 flex items-center gap-1 text-[10px] font-bold text-[#c76456]">View guidance <ArrowRight size={12} /></span></button></section><footer className="mx-auto mt-8 flex max-w-2xl items-start gap-2 text-center text-[10px] leading-relaxed text-[#a2aaa5]"><CircleHelp size={13} className="mt-0.5 shrink-0" />PlacentaSync is a support and communication tool, not a medical diagnosis. For urgent symptoms, contact your clinician or local emergency services.</footer>{careToast && <div className="fixed bottom-6 right-6 z-40 rounded-xl bg-[#2f6260] px-4 py-3 text-xs font-bold text-white shadow-xl">Care plan updated ✓</div>}</>;
}

function LearnPage({ expandedLesson, setExpandedLesson, completedLessons, setCompletedLessons }: { expandedLesson: string | null; setExpandedLesson: (value: string | null) => void; completedLessons: string[]; setCompletedLessons: (value: string[]) => void }) {
  const complete = (id: string) => setCompletedLessons(completedLessons.includes(id) ? completedLessons.filter((item) => item !== id) : [...completedLessons, id]);
  return <><section className="mt-3 rounded-[30px] bg-[#e7f2eb] px-6 py-8 sm:px-10 sm:py-10"><p className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[.2em] text-[#548b78]"><BookOpen size={14} /> Maternal education · week 28</p><h1 className="mt-4 max-w-[670px] text-[31px] font-bold leading-tight tracking-[-.06em] text-[#25494a] sm:text-[43px]">Knowledge that makes<br /><span className="text-[#df7967]">care conversations easier.</span></h1><p className="mt-4 max-w-[570px] text-[13px] leading-relaxed text-[#5b7772]">Short, kind explainers to help you notice patterns, prepare questions, and feel more confident speaking with your care team.</p></section><div className="mt-7 flex items-end justify-between"><div><p className="text-[10px] font-bold uppercase tracking-[.2em] text-[#a4aaa4]">Your learning shelf</p><h2 className="mt-2 text-2xl font-bold tracking-[-.04em]">Start where you are</h2></div><span className="rounded-full bg-[#eaf6ef] px-3 py-2 text-[10px] font-bold text-[#5e9882]">{completedLessons.length}/3 complete</span></div><div className="mt-4 space-y-3">{lessons.map((lesson) => { const Icon = lesson.icon; const open = expandedLesson === lesson.id; const done = completedLessons.includes(lesson.id); return <article key={lesson.id} className="rounded-[22px] border border-[#eee5de] bg-white p-5 shadow-[0_6px_22px_rgba(94,71,55,.03)]"><button onClick={() => setExpandedLesson(open ? null : lesson.id)} className="flex w-full items-center gap-4 text-left"><div className={`grid h-11 w-11 shrink-0 place-items-center rounded-2xl ${lesson.color}`}><Icon size={20} /></div><div className="min-w-0 flex-1"><div className="flex flex-wrap items-center gap-2"><span className="text-[9px] font-bold uppercase tracking-[.15em] text-[#a4aaa4]">{lesson.category}</span>{done && <span className="rounded-full bg-[#eaf6ef] px-2 py-1 text-[9px] font-bold text-[#5e9882]">Complete</span>}</div><h3 className="mt-1 text-[15px] font-bold">{lesson.title}</h3><p className="mt-1 text-[11px] text-[#8c9994]">{lesson.time}</p></div>{open ? <ChevronDown size={18} className="text-[#9aa39f]" /> : <ChevronRight size={18} className="text-[#9aa39f]" />}</button>{open && <div className="mt-5 border-t border-[#f2ebe5] pt-5"><p className="text-[13px] leading-relaxed text-[#5f716d]">{lesson.summary}</p><ul className="mt-4 space-y-2">{lesson.points.map((point) => <li key={point} className="flex gap-2 text-[11px] leading-relaxed text-[#71807b]"><CheckCircle2 size={15} className="shrink-0 text-[#6daf91]" />{point}</li>)}</ul><button onClick={() => complete(lesson.id)} className={`mt-5 flex items-center gap-2 rounded-xl px-4 py-2.5 text-[11px] font-bold ${done ? 'bg-[#eaf6ef] text-[#5e9882]' : 'bg-[#2f6260] text-white'}`}>{done ? <><Check size={14} /> Marked as complete</> : <>Mark as learned <Check size={14} /></>}</button></div>}</article>; })}</div><p className="mx-auto mt-8 max-w-xl text-center text-[10px] leading-relaxed text-[#a2aaa4]"><Info size={13} className="mr-1 inline" />Education is general information, not personal medical advice. Bring questions and concerns to your clinician.</p></>;
}

function JournalPage({ journal, setJournal, savedJournal, setSavedJournal }: { journal: string; setJournal: (value: string) => void; savedJournal: string; setSavedJournal: (value: string) => void }) {
  return <><section className="mt-3 rounded-[30px] bg-[#fff0e8] px-6 py-8 sm:px-10 sm:py-10"><p className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[.2em] text-[#bd806d]"><NotebookPen size={14} /> Private reflection space</p><h1 className="mt-4 text-[31px] font-bold leading-tight tracking-[-.06em] text-[#704f4a] sm:text-[43px]">Put the day<br /><span className="text-[#df7967]">somewhere gentle.</span></h1><p className="mt-4 max-w-[560px] text-[13px] leading-relaxed text-[#98746d]">Write a few words for yourself. This prototype keeps your note in the current session.</p></section><section className="mt-6 rounded-[24px] border border-[#eee5de] bg-white p-5 sm:p-7"><div className="flex items-center justify-between"><div><p className="text-[10px] font-bold uppercase tracking-[.2em] text-[#a4aaa4]">Today’s note</p><h2 className="mt-2 text-[20px] font-bold">What would you like to remember?</h2></div><div className="grid h-10 w-10 place-items-center rounded-xl bg-[#fff2eb] text-[#df7967]"><NotebookPen size={18} /></div></div><textarea value={journal} onChange={(event) => setJournal(event.target.value)} placeholder="I noticed… I needed… I’m proud that…" className="mt-6 min-h-44 w-full resize-none rounded-2xl border border-[#eee5de] bg-[#fffaf6] p-4 text-sm leading-relaxed outline-none transition focus:border-[#7eb6a1] focus:ring-2 focus:ring-[#eaf6ef]" /><div className="mt-4 flex flex-col justify-between gap-3 sm:flex-row sm:items-center"><p className="text-[10px] text-[#a4aaa4]">{journal.length}/500 characters</p><button disabled={!journal.trim()} onClick={() => { setSavedJournal(journal.trim()); setJournal(''); }} className="flex items-center justify-center gap-2 rounded-xl bg-[#2f6260] px-4 py-3 text-xs font-bold text-white disabled:opacity-40"><Plus size={15} /> Save note</button></div>{savedJournal && <div className="mt-6 rounded-2xl bg-[#eff8f4] p-4"><p className="text-[10px] font-bold uppercase tracking-[.15em] text-[#5e9882]">Saved just now</p><p className="mt-2 text-sm leading-relaxed text-[#4f6e68]">{savedJournal}</p></div>}</section></>;
}

function CareTeamPage({ message, setMessage, sentMessage, setSentMessage }: { message: string; setMessage: (value: string) => void; sentMessage: string; setSentMessage: (value: string) => void }) {
  return <><section className="mt-3 rounded-[30px] bg-[#eaf6f7] px-6 py-8 sm:px-10 sm:py-10"><p className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[.2em] text-[#5d9c9b]"><MessageCircle size={14} /> Your support circle</p><h1 className="mt-4 text-[31px] font-bold leading-tight tracking-[-.06em] text-[#315b5e] sm:text-[43px]">You don’t have to<br /><span className="text-[#df7967]">carry questions alone.</span></h1><p className="mt-4 max-w-[560px] text-[13px] leading-relaxed text-[#668486]">Keep a simple conversation open with the people who know your care and your preferences.</p></section><div className="mt-6 grid grid-cols-1 gap-5 lg:grid-cols-[.8fr_1.2fr]"><section className="rounded-[24px] border border-[#eee5de] bg-white p-6"><div className="flex items-center gap-3"><div className="grid h-12 w-12 place-items-center rounded-full bg-[#f2cfc3] text-xs font-bold text-[#8c5c52]">SM</div><div><h2 className="text-[16px] font-bold">Sarah Mitchell</h2><p className="text-[11px] text-[#8c9994]">Midwife · Your care team</p></div><span className="ml-auto h-2.5 w-2.5 rounded-full bg-[#71c197]" /></div><div className="mt-6 rounded-2xl bg-[#eff8f4] p-4"><p className="text-[11px] leading-relaxed text-[#4f7169]">“I’m here to help you prepare questions and understand your next steps.”</p></div><div className="mt-5 flex items-center gap-2 text-[10px] font-bold text-[#5e9882]"><Clock3 size={13} /> Usually replies within 2 hours</div></section><section className="rounded-[24px] border border-[#eee5de] bg-white p-6"><p className="text-[10px] font-bold uppercase tracking-[.2em] text-[#a4aaa4]">New message</p><h2 className="mt-2 text-[20px] font-bold">What would you like to share?</h2><textarea value={message} onChange={(event) => setMessage(event.target.value)} placeholder="For example: I have a question about my next appointment…" className="mt-5 min-h-32 w-full resize-none rounded-2xl border border-[#eee5de] bg-[#fffaf6] p-4 text-sm outline-none focus:border-[#7eb6a1] focus:ring-2 focus:ring-[#eaf6ef]" /><button disabled={!message.trim()} onClick={() => { setSentMessage(message.trim()); setMessage(''); }} className="mt-4 flex items-center gap-2 rounded-xl bg-[#2f6260] px-4 py-3 text-xs font-bold text-white disabled:opacity-40"><Send size={14} /> Send to Sarah</button>{sentMessage && <div className="mt-5 flex gap-2 rounded-2xl bg-[#eaf6ef] p-4 text-[11px] leading-relaxed text-[#4f7169]"><CheckCircle2 size={16} className="shrink-0 text-[#5e9882]" />Message saved to this prototype. Your care team would see it here in a connected version.</div>}</section></div><div className="mt-5 rounded-2xl border border-[#f4d9d2] bg-[#fff8f4] p-5"><div className="flex gap-3"><ShieldCheck size={18} className="shrink-0 text-[#df7967]" /><div><p className="text-xs font-bold text-[#704f4a]">Need urgent help?</p><p className="mt-1 text-[11px] leading-relaxed text-[#98746d]">Messaging is not for emergencies. Contact your clinician or local emergency services if you need urgent help.</p></div></div></div></>;
}

export default App;
