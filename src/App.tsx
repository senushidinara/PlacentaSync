import { useEffect, useState } from 'react';
import {
  ArrowRight,
  Baby,
  Bell,
  Check,
  ChevronRight,
  CircleHelp,
  Heart,
  Home,
  Info,
  Leaf,
  Menu,
  MessageCircle,
  PhoneCall,
  ShieldCheck,
  Sparkles,
  Sun,
  Wind,
  X,
} from 'lucide-react';

const moods = [
  { label: 'Peaceful', emoji: '☺', color: '#b8e4d3' },
  { label: 'Okay', emoji: '•ᴗ•', color: '#dce8c0' },
  { label: 'Tired', emoji: '◡︵◡', color: '#f5dfb7' },
  { label: 'Anxious', emoji: '◕︵◕', color: '#f3c5c0' },
];

const symptoms = ['Nausea', 'Headache', 'Back ache', 'Swelling', 'Breathless', 'None today'];

function App() {
  const [mood, setMood] = useState('');
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [checkInSaved, setCheckInSaved] = useState(false);
  const [breathing, setBreathing] = useState(false);
  const [breathCount, setBreathCount] = useState(4);
  const [showMenu, setShowMenu] = useState(false);

  useEffect(() => {
    if (!breathing) return;
    const timer = window.setInterval(() => setBreathCount((value) => (value === 4 ? 1 : value + 1)), 1000);
    return () => window.clearInterval(timer);
  }, [breathing]);

  const toggleSymptom = (symptom: string) => {
    setSelectedSymptoms((current) => current.includes(symptom) ? current.filter((item) => item !== symptom) : [...current.filter((item) => item !== 'None today'), symptom]);
  };

  return (
    <div className="min-h-screen bg-[#fffaf6] text-[#24363a]">
      <header className="mx-auto flex max-w-[1180px] items-center justify-between px-5 py-5 sm:px-8 lg:px-10">
        <div className="flex items-center gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-[15px] bg-[#2f6260] text-white shadow-[0_8px_20px_rgba(47,98,96,.18)]"><Leaf size={19} /></div>
          <div><p className="text-[17px] font-bold tracking-[-.04em]">Placenta<span className="text-[#df7967]">Sync</span></p><p className="text-[9px] font-bold uppercase tracking-[.19em] text-[#a2a9a4]">Your gentle care loop</p></div>
        </div>
        <div className="flex items-center gap-2"><button className="hidden items-center gap-2 rounded-full bg-[#f7efe9] px-3 py-2 text-[11px] font-bold text-[#866c61] sm:flex"><Sun size={14} className="text-[#e7a65a]" /> 28 weeks</button><button className="grid h-9 w-9 place-items-center rounded-full border border-[#eee4dc] text-[#758581]"><Bell size={16} /></button><button onClick={() => setShowMenu(!showMenu)} className="grid h-9 w-9 place-items-center rounded-full border border-[#eee4dc] text-[#758581] lg:hidden">{showMenu ? <X size={17} /> : <Menu size={17} />}</button><div className="hidden h-9 w-9 place-items-center rounded-full bg-[#f2cfc3] text-[10px] font-bold text-[#8c5c52] sm:grid">AM</div></div>
      </header>

      {showMenu && <div className="mx-5 rounded-2xl border border-[#efe5de] bg-white p-3 shadow-lg lg:hidden"><button className="flex w-full items-center gap-3 rounded-xl bg-[#eff8f4] p-3 text-left text-xs font-bold text-[#34716d]"><Home size={16} />Today</button><button className="mt-1 flex w-full items-center gap-3 rounded-xl p-3 text-left text-xs font-bold text-[#71807b]"><MessageCircle size={16} />Care team</button></div>}

      <main className="mx-auto max-w-[1180px] px-5 pb-10 sm:px-8 lg:px-10">
        <section className="relative mt-3 overflow-hidden rounded-[30px] bg-[#e7f2eb] px-6 py-8 sm:px-10 sm:py-10">
          <div className="absolute -right-10 -top-20 h-64 w-64 rounded-full border-[34px] border-[#d1e8dc]" /><div className="absolute -bottom-28 right-48 h-56 w-56 rounded-full border-[22px] border-[#d8ebdf]" />
          <div className="relative max-w-[650px]"><div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[.2em] text-[#548b78]"><Sparkles size={14} /> Wednesday, November 5</div><h1 className="mt-4 text-[31px] font-bold leading-[1.08] tracking-[-.06em] text-[#25494a] sm:text-[43px]">A softer way to<br /><span className="text-[#df7967]">check in with you.</span></h1><p className="mt-4 max-w-[510px] text-[13px] leading-relaxed text-[#5b7772]">Your body is doing extraordinary work. Take one quiet minute to notice what you need today.</p><button onClick={() => document.getElementById('check-in')?.scrollIntoView({ behavior: 'smooth' })} className="mt-6 flex items-center gap-2 rounded-xl bg-[#2f6260] px-4 py-3 text-xs font-bold text-white shadow-lg shadow-[#2f6260]/15 transition hover:bg-[#244e4c]">Start today’s check-in <ArrowRight size={15} /></button></div>
        </section>

        <div className="mt-7 grid grid-cols-1 gap-5 lg:grid-cols-[1.25fr_.75fr]">
          <section id="check-in" className="rounded-[24px] border border-[#eee5de] bg-white p-5 shadow-[0_6px_22px_rgba(94,71,55,.04)] sm:p-7">
            <div className="flex items-start justify-between"><div><p className="text-[10px] font-bold uppercase tracking-[.2em] text-[#a4aaa4]">Daily check-in · 1 of 3</p><h2 className="mt-2 text-[21px] font-bold tracking-[-.04em]">How are you feeling right now?</h2></div><div className="grid h-9 w-9 place-items-center rounded-full bg-[#fff3ec] text-[#df7967]"><Heart size={17} /></div></div>
            <div className="mt-6 grid grid-cols-2 gap-2 sm:grid-cols-4">{moods.map((item) => <button key={item.label} onClick={() => { setMood(item.label); setCheckInSaved(false); }} className={`rounded-2xl border p-3 text-center transition ${mood === item.label ? 'border-[#4f9684] bg-[#eff8f4] shadow-sm' : 'border-[#f0e7e0] hover:border-[#c8ddd3]'}`}><span className="mx-auto grid h-11 w-11 place-items-center rounded-full text-[19px] font-semibold" style={{ backgroundColor: item.color }}>{item.emoji}</span><span className="mt-2 block text-[11px] font-bold text-[#687874]">{item.label}</span></button>)}</div>
            <div className="mt-7 border-t border-[#f2ebe5] pt-6"><p className="text-[13px] font-bold">Anything your body is telling you?</p><p className="mt-1 text-[11px] text-[#9aa39f]">Select all that feel relevant. There is no right answer.</p><div className="mt-4 flex flex-wrap gap-2">{symptoms.map((symptom) => <button key={symptom} onClick={() => toggleSymptom(symptom)} className={`rounded-full border px-3 py-2 text-[11px] font-semibold transition ${selectedSymptoms.includes(symptom) ? 'border-[#7eb6a1] bg-[#eaf6ef] text-[#397866]' : 'border-[#eee5de] text-[#7b8985] hover:bg-[#fffaf6]'}`}>{selectedSymptoms.includes(symptom) && <Check size={12} className="mr-1 inline" />}{symptom}</button>)}</div></div>
            <button disabled={!mood} onClick={() => setCheckInSaved(true)} className="mt-7 flex w-full items-center justify-center gap-2 rounded-xl bg-[#df7967] py-3 text-xs font-bold text-white shadow-lg shadow-[#df7967]/15 transition hover:bg-[#cc6859] disabled:cursor-not-allowed disabled:opacity-40">{checkInSaved ? <><Check size={15} /> Saved for today</> : <>Save my check-in <ArrowRight size={15} /></>}</button>
          </section>

          <div className="space-y-5">
            <section className="rounded-[24px] bg-[#2f6260] p-6 text-white shadow-[0_10px_26px_rgba(47,98,96,.14)]"><div className="flex items-start justify-between"><div><p className="text-[10px] font-bold uppercase tracking-[.2em] text-[#a9d8c5]">A moment to settle</p><h2 className="mt-2 text-[22px] font-bold tracking-[-.04em]">Breathe with baby</h2></div><Wind size={23} className="text-[#a9d8c5]" /></div><p className="mt-3 text-[12px] leading-relaxed text-[#c5ded5]">A simple 60-second rhythm to soften your shoulders and slow the day down.</p><div className="mt-6 flex items-center gap-4"><div className={`grid h-20 w-20 shrink-0 place-items-center rounded-full border-2 border-[#91cdb9] ${breathing ? 'animate-pulse bg-[#4b8078]' : 'bg-[#3a716d]'}`}><span className="text-center text-[11px] font-bold">{breathing ? `${breathCount}s` : '1 min'}</span></div><button onClick={() => { setBreathing(!breathing); setBreathCount(4); }} className="rounded-xl bg-white px-4 py-2.5 text-[11px] font-bold text-[#2f6260]">{breathing ? 'Pause' : 'Begin'}</button></div></section>
            <section className="rounded-[24px] border border-[#eee5de] bg-white p-6"><div className="flex items-center gap-3"><div className="grid h-10 w-10 place-items-center rounded-xl bg-[#fff2eb] text-[#df7967]"><Baby size={19} /></div><div><h3 className="text-[14px] font-bold">Baby’s little note</h3><p className="text-[10px] text-[#99a39f]">A gentle reminder for today</p></div></div><p className="mt-5 text-[15px] font-semibold leading-relaxed text-[#405452]">“Your rest is productive too. You don’t have to earn a pause.”</p><div className="mt-5 flex items-center gap-2 text-[10px] font-bold text-[#76918a]"><div className="h-1.5 w-1.5 rounded-full bg-[#df7967]" /> Week 28 · growing together</div></section>
          </div>
        </div>

        <section className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-3">
          <article className="rounded-[22px] border border-[#eee5de] bg-white p-5"><div className="flex items-center justify-between"><div className="grid h-9 w-9 place-items-center rounded-xl bg-[#f1f8ed] text-[#78a66f]"><ShieldCheck size={17} /></div><ChevronRight size={16} className="text-[#b0b9b3]" /></div><h3 className="mt-5 text-[14px] font-bold">My care plan</h3><p className="mt-1 text-[11px] leading-relaxed text-[#8c9994]">3 gentle actions prepared with your care team.</p><div className="mt-4 flex items-center gap-2 text-[10px] font-bold text-[#5e9882]"><span className="rounded-full bg-[#eaf6ef] px-2 py-1">2 complete</span> 1 remaining</div></article>
          <article className="rounded-[22px] border border-[#eee5de] bg-white p-5"><div className="flex items-center justify-between"><div className="grid h-9 w-9 place-items-center rounded-xl bg-[#eef6f7] text-[#64a7a5]"><MessageCircle size={17} /></div><ChevronRight size={16} className="text-[#b0b9b3]" /></div><h3 className="mt-5 text-[14px] font-bold">Ask your care team</h3><p className="mt-1 text-[11px] leading-relaxed text-[#8c9994]">Your midwife Sarah is available today.</p><div className="mt-4 flex items-center gap-2 text-[10px] font-bold text-[#5e9882]"><span className="h-2 w-2 rounded-full bg-[#71c197]" /> Usually replies in 2h</div></article>
          <article className="rounded-[22px] border border-[#f4d9d2] bg-[#fff8f4] p-5"><div className="flex items-center justify-between"><div className="grid h-9 w-9 place-items-center rounded-xl bg-white text-[#df7967]"><PhoneCall size={17} /></div><Info size={16} className="text-[#c9958b]" /></div><h3 className="mt-5 text-[14px] font-bold text-[#704f4a]">Need urgent help?</h3><p className="mt-1 text-[11px] leading-relaxed text-[#98746d]">If something feels wrong, trust yourself and contact your clinician.</p><button className="mt-4 flex items-center gap-1 text-[10px] font-bold text-[#c76456]">View emergency guidance <ArrowRight size={12} /></button></article>
        </section>

        <footer className="mx-auto mt-8 flex max-w-2xl items-start gap-2 text-center text-[10px] leading-relaxed text-[#a2aaa5]"><CircleHelp size={13} className="mt-0.5 shrink-0" />PlacentaSync is a support and communication tool, not a medical diagnosis. For urgent symptoms, contact your clinician or local emergency services.</footer>
      </main>
    </div>
  );
}

export default App;
