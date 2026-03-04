import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import {
  MapPin,
  Music,
  ChevronDown,
  Heart,
  Clock,
  Volume2,
  VolumeX,
} from 'lucide-react';


// --- Types ---
interface CountdownTime {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

// --- Components ---

// Animation phases:
// 0 = idle (closed envelope)
// 1 = seal breaking + flap opening
// 2 = card rising out of envelope
// 3 = done → parent unmounts
const EnvelopeSection = ({ onOpen }: { onOpen: () => void }) => {
  const [phase, setPhase] = useState<0 | 1 | 2 | 3>(0);
  const [hovered, setHovered] = useState(false);

  const handleClick = () => {
    if (phase !== 0) return;
    setPhase(1);
    // After flap opens, start card rising
    setTimeout(() => setPhase(2), 900);
    // After card is fully "out" → switch to main page
    setTimeout(() => {
      setPhase(3);
      onOpen();
    }, 2200);
  };

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6 }}
      className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden"
      style={{ backgroundColor: '#f0ebe0' }}
    >
      {/* ═══════════ ENVELOPE BODY (full viewport) ═══════════ */}
      <div
        className="relative"
        style={{
          width: '100vw',
          height: '100vh',
          perspective: '1200px',
        }}
      >
        {/* ── Envelope back / body ── */}
        <div
          className="absolute inset-0"
          style={{
            backgroundColor: '#f8f4ec',
            backgroundImage: "url('/images/bg_texture.png')",
            backgroundSize: 'cover',
            backgroundBlendMode: 'multiply',
          }}
        >
          {/* Diamond fold triangles */}
          {/* Top */}
          <div className="absolute inset-x-0 top-0" style={{ height: '50%', clipPath: 'polygon(0% 0%, 100% 0%, 50% 100%)', backgroundColor: 'rgba(220,210,190,0.5)' }} />
          {/* Bottom */}
          <div className="absolute inset-x-0 bottom-0" style={{ height: '50%', clipPath: 'polygon(0% 100%, 100% 100%, 50% 0%)', backgroundColor: 'rgba(210,200,180,0.4)' }} />
          {/* Left */}
          <div className="absolute inset-y-0 left-0" style={{ width: '50%', clipPath: 'polygon(0% 0%, 0% 100%, 100% 50%)', backgroundColor: 'rgba(225,215,200,0.3)' }} />
          {/* Right */}
          <div className="absolute inset-y-0 right-0" style={{ width: '50%', clipPath: 'polygon(100% 0%, 100% 100%, 0% 50%)', backgroundColor: 'rgba(215,205,185,0.3)' }} />

          {/* Crease lines */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none" xmlns="http://www.w3.org/2000/svg">
            <line x1="0" y1="0" x2="50%" y2="50%" stroke="rgba(150,138,118,0.2)" strokeWidth="1" />
            <line x1="100%" y1="0" x2="50%" y2="50%" stroke="rgba(150,138,118,0.2)" strokeWidth="1" />
            <line x1="0" y1="100%" x2="50%" y2="50%" stroke="rgba(150,138,118,0.2)" strokeWidth="1" />
            <line x1="100%" y1="100%" x2="50%" y2="50%" stroke="rgba(150,138,118,0.2)" strokeWidth="1" />
          </svg>

          {/* Invitation text */}
          <motion.div
            animate={{ opacity: phase >= 1 ? 0 : 1 }}
            transition={{ duration: 0.4 }}
            className="absolute left-1/2 -translate-x-1/2 text-center pointer-events-none"
            style={{ bottom: '14%' }}
          >
            <p className="font-serif italic" style={{ color: 'rgba(120,110,95,0.7)', fontSize: 'clamp(14px, 2vw, 20px)', letterSpacing: '0.02em' }}>
              ننشرف بحضوركم حفل زفاف
              أروى و كريم
            </p>
          </motion.div>
        </div>

        {/* ── TOP FLAP (rotates open on click, 3D fold at top) ── */}
        <motion.div
          initial={{ rotateX: 0 }}
          animate={{ rotateX: phase >= 1 ? -175 : 0 }}
          transition={{ duration: 0.9, ease: [0.32, 0, 0.67, 0], delay: 0.05 }}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '50%',
            transformOrigin: 'top center',
            transformStyle: 'preserve-3d',
            zIndex: 10,
            pointerEvents: phase === 0 ? 'none' : 'none',
          }}
        >
          {/* Flap front face */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              clipPath: 'polygon(0% 0%, 100% 0%, 50% 100%)',
              backgroundColor: '#ede7d9',
              backgroundImage: "url('/images/bg_texture.png')",
              backgroundSize: 'cover',
              backgroundBlendMode: 'multiply',
              boxShadow: 'inset 0 -8px 24px rgba(0,0,0,0.06)',
            }}
          />
          {/* Flap back face (shows when opening) */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              clipPath: 'polygon(0% 0%, 100% 0%, 50% 100%)',
              backgroundColor: '#e4ddd0',
              transform: 'rotateX(180deg)',
              backfaceVisibility: 'hidden',
            }}
          />
        </motion.div>

        {/* ── INVITATION CARD (rises up out of the envelope) ── */}
        {/* Outer div handles centering; inner motion.div handles only the y animation */}
        <div
          style={{
            position: 'absolute',
            left: '50%',
            top: '50%',
            transform: 'translate(-50%, -50%)',
            width: 'min(85vw, 460px)',
            zIndex: 20,
          }}
        >
          <motion.div
            initial={{ y: '60vh', opacity: 0, scale: 0.92 }}
            animate={{
              y: phase >= 2 ? '-8vh' : '60vh',
              opacity: phase >= 2 ? 1 : 0,
              scale: phase >= 2 ? 1 : 0.92,
            }}
            transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1], delay: phase >= 2 ? 0.1 : 0 }}
          >
            <div
              style={{
                aspectRatio: '3/4',
                backgroundColor: '#faf7f2',
                backgroundImage: "url('/images/bg_texture.png')",
                backgroundSize: 'cover',
                backgroundBlendMode: 'multiply',
                borderRadius: '16px',
                boxShadow: '0 40px 80px rgba(0,0,0,0.18), 0 8px 24px rgba(0,0,0,0.1)',
                border: '1px solid rgba(200,190,170,0.6)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '16px',
                padding: '40px',
              }}
            >
              <img src="/images/logo-gold.png" alt="A&K Monogram" style={{ width: '80px', opacity: 0.7 }} />
              <div style={{ width: '40px', height: '1px', backgroundColor: 'rgba(150,138,118,0.4)' }} />
              <p className="font-serif italic text-center" style={{ color: 'rgba(100,92,78,0.7)', fontSize: '14px', letterSpacing: '0.04em' }}>Arwa &amp; Karim</p>
              <p className="font-sans uppercase text-center" style={{ color: 'rgba(130,120,100,0.5)', fontSize: '10px', letterSpacing: '0.3em' }}>April 4, 2026 - 3:00 PM</p>
            </div>
          </motion.div>
        </div>

        {/* ── WAX SEAL (centered, clickable) ── */}
        <div
          className="absolute z-30 flex flex-col items-center"
          style={{ top: '50%', left: '50%', transform: 'translate(-50%, -50%)', cursor: phase === 0 ? 'pointer' : 'default' }}
          onClick={handleClick}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
        >
          <motion.div
            animate={{
              scale: phase >= 1 ? 0 : hovered ? 1.1 : 1,
              rotate: phase >= 1 ? 20 : hovered ? 5 : 0,
              opacity: phase >= 1 ? 0 : 1,
            }}
            transition={{ type: 'spring', stiffness: 300, damping: 22 }}
            style={{ width: 'clamp(90px, 14vw, 130px)', height: 'clamp(90px, 14vw, 130px)', position: 'relative' }}
          >
            <img src="/images/wax_seal.webp" alt="Wax Seal" className="w-full h-full object-contain drop-shadow-xl" />
            {/* Pulsing ring */}
            <motion.div
              animate={{ opacity: phase === 0 ? [0, 0.55, 0] : 0, scale: [1, 1.4, 1] }}
              transition={{ repeat: Infinity, duration: 2.4, ease: 'easeInOut' }}
              style={{ position: 'absolute', inset: 0, borderRadius: '50%', border: '2px solid rgba(160,140,110,0.5)', pointerEvents: 'none' }}
            />
          </motion.div>

          {/* Tap hint */}
          <motion.p
            animate={{ opacity: phase === 0 ? (hovered ? 0.85 : 0.5) : 0 }}
            transition={{ duration: 0.3 }}
            className="mt-3 font-sans uppercase text-center"
            style={{ fontSize: '10px', letterSpacing: '0.3em', color: 'rgba(110,100,82,0.8)', whiteSpace: 'nowrap' }}
          >
            Tap to open
          </motion.p>
        </div>
      </div>
    </motion.div>
  );
};

const Header = () => {
  return (
    <header className="fixed top-0 w-full z-40 px-6 py-4 flex justify-between items-center pointer-events-none">
      <img src="/images/logo-black.png" alt="A & K" className="h-8 w-auto" />
      <span className="font-sans text-xs uppercase tracking-[0.3em] text-slate-700 mix-blend-difference text-black">04.04.2026</span>
    </header>
  );
};

const Hero = () => {
  return (
    <section className="relative min-h-[90vh] flex flex-col items-center justify-center pt-20 px-4 overflow-hidden">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="text-center z-10 max-w-2xl"
      >
        <span className="text-sage-400 uppercase tracking-[0.4em] text-xs mb-6 block font-medium">We are getting married</span>
        <h1 className="text-6xl md:text-8xl font-serif text-slate-800 leading-tight mb-8">
          Arwa <span className="italic block md:inline text-sage-400 serif">&</span> Karim
        </h1>
        <span className="text-sage-400 uppercase tracking-[0.4em] text-xs mb-6 block font-medium">April 04, 2026 - 3:00 PM</span>

        <div className="w-16 h-[1px] bg-sage-200 mx-auto mb-8 relative">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 rotate-45 border border-sage-200 bg-cream-100"></div>
        </div>

        <p className="text-slate-500 font-serif italic text-l md:text-xl mb-12 px-6">
          بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيمِ
        </p>
        <p className="text-slate-500 font-serif italic text-l md:text-xl mb-12 px-6">

          ‎﴾ وَمِنْ آيَاتِهِ أَنْ خَلَقَ لَكُم مِّنْ أَنفُسِكُمْ أَزْوَاجًا لِّتَسْكُنُوا إِلَيْهَا وَجَعَلَ بَيْنَكُم مَّوَدَّةً وَرَحْمَةً  ‎﴿      </p>
        <p className="text-slate-500 font-serif italic text-l md:text-xl mb-12 px-6">

          سورة الروم – الآية ٢١         </p>
      </motion.div>

      {/* <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.5, delay: 0.2 }}
        className="relative w-full max-w-4xl aspect-[16/9] mt-4 rounded-t-full overflow-hidden shadow-2xl border-x-8 border-t-8 border-white/50"
      >
        <img
          src="/images/venue2.png"
          alt="Wedding Venue"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-cream-100 via-transparent to-transparent"></div>
      </motion.div> */}
    </section>
  );
};

const Countdown = () => {
  const [timeLeft, setTimeLeft] = useState<CountdownTime>({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const targetDate = new Date('2026-04-04T15:00:00');

    const interval = setInterval(() => {
      const now = new Date();
      const difference = targetDate.getTime() - now.getTime();

      if (difference <= 0) {
        clearInterval(interval);
        return;
      }

      setTimeLeft({
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="py-20 bg-white/30 backdrop-blur-sm relative overflow-hidden">
      <div className="container mx-auto px-4 relative z-10 text-center">
        <h3 className="font-serif text-3xl mb-12 text-slate-800 italic">Counting down the days...</h3>

        <div className="flex flex-wrap justify-center gap-4 md:gap-12">
          {Object.entries(timeLeft).map(([unit, value]) => (
            <div key={unit} className="flex flex-col items-center">
              <div className="w-20 h-20 md:w-28 md:h-28 glass rounded-2xl flex items-center justify-center mb-4 shadow-sm">
                <span className="text-3xl md:text-4xl font-serif text-sage-500">{value}</span>
              </div>
              <span className="text-[10px] uppercase tracking-[0.3em] text-slate-400 font-bold">{unit}</span>
            </div>
          ))}
        </div>
      </div>


    </section>
  );
};

const EventDetails = () => {
  return (
    <section className="py-32 px-4 container mx-auto">
      <div className="flex justify-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col items-center text-center p-10 md:p-16 rounded-3xl bg-white border border-slate-100 shadow-xl hover:shadow-2xl transition-shadow max-w-lg w-full"
        >
          <div className="w-16 h-16 bg-sage-50 rounded-full flex items-center justify-center mb-6 text-sage-400">
            <Heart size={32} />
          </div>
          <h2 className="text-3xl font-serif mb-1">Ceremony & Celebration</h2>
          <p className="text-sage-400 italic font-serif text-sm mb-4">The Wedding of Arwa & Karim</p>
          <div className="w-8 h-[1px] bg-sage-200 mb-8"></div>

          <div className="space-y-4 text-slate-600 mb-10">
            <div className="flex items-center justify-center gap-2">
              <Clock size={16} className="text-sage-400" />
              <span>Saturday, April 4, 2026 at 3:00 PM</span>
            </div>

            <div className="flex items-center justify-center gap-2">
              <MapPin size={16} className="text-sage-400" />
              <span>Hilton Cairo Heliopolis</span>
            </div>
          </div>

          <a
            href="https://maps.app.goo.gl/kAQvWx9SpcKXD81H6"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary flex items-center gap-2"
          >
            <MapPin size={18} /> View on Maps
          </a>
        </motion.div>
      </div>
    </section>
  );
};

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs = [
    { q: "Can I bring a plus one?", a: "Your invitation will specify the number of seats we've reserved for you. Please check your physical invitation or the RSVP section for details." },
    { q: "Are kids welcome?", a: "While we love your little ones, our wedding will be an adults-only event so that everyone can relax and enjoy the celebration." },
  ];

  return (
    <section className="py-32 bg-sage-50/50 backdrop-blur-md">
      <div className="container mx-auto px-4 max-w-3xl">
        <h2 className="text-4xl font-serif text-center mb-16 ">✨مع أطيب الأمنيات لأطفالكم بنومٍ هادئٍ  </h2>


      </div>
    </section>
  );
};



const MusicPlayer = () => {
  // const [isPlaying, setIsPlaying] = useState(false);
  // const audioRef = useRef<HTMLAudioElement | null>(null);

  // const toggleMusic = () => {
  //   if (!audioRef.current) return;
  //   if (isPlaying) {
  //     audioRef.current.pause();
  //   } else {
  //     audioRef.current.play().catch(e => console.log("Audio play blocked", e));
  //   }
  //   setIsPlaying(!isPlaying);
  // };

  // return (
  //   <div className="fixed bottom-8 right-8 z-40">
  //     <audio ref={audioRef} loop src="https://www.bensound.com/bensound-music/bensound-romantic.mp3" />
  //     <button
  //       onClick={toggleMusic}
  //       className={`w-14 h-14 rounded-full flex items-center justify-center transition-all ${isPlaying ? 'bg-sage-400 scale-110 shadow-xl' : 'bg-white/80 backdrop-blur shadow-md'}`}
  //     >
  //       {isPlaying ? (
  //         <Volume2 className="text-white animate-pulse" />
  //       ) : (
  //         <VolumeX className="text-sage-400" />
  //       )}
  //     </button>

  //     {isPlaying && (
  //       <div className="absolute -top-12 right-0 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest text-sage-400 whitespace-nowrap border border-sage-100 shadow-sm transition-all animate-fade-up">
  //         Playing: Romantic Waltz
  //       </div>
  //     )}
  //   </div>
  // );
};

const Footer = () => {
  return (
    <footer className="py-24 text-center bg-cream-100">
      <div className="w-16 h-[1px] bg-sage-200 mx-auto mb-12"></div>
      <img
        src="/images/logo-sage.png"
        alt="Arwa & Karim Monogram"
        className="mx-auto mb-8"
        style={{ width: '100px', opacity: 0.55 }}
      />
      <p className="text-slate-400 font-sans text-xs uppercase tracking-[0.5em] mb-6">Forever & Always</p>
      <div className="flex justify-center gap-4 text-sage-200">
        <Heart size={16} fill="currentColor" />
        <Heart size={16} fill="currentColor" />
        <Heart size={16} fill="currentColor" />
      </div>
    </footer>
  );
};

// --- Main App ---

export default function App() {
  const [isOpen, setIsOpen] = useState(false);
  const [showEnvelope, setShowEnvelope] = useState(true);
  const { scrollYProgress } = useScroll();
  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);

  const handleOpen = () => {
    // Let the card-rise animation play before removing the envelope layer
    setIsOpen(true);
    setTimeout(() => setShowEnvelope(false), 600);
  };

  return (
    <div className="min-h-screen relative selection:bg-sage-100 selection:text-sage-600">
      <AnimatePresence>
        {showEnvelope && <EnvelopeSection onOpen={handleOpen} />}
      </AnimatePresence>

      {isOpen && (
        <motion.main
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 1.5, ease: [0.22, 1, 0.36, 1] }}
          className="relative"
        >
          <Header />
          <Hero />

          <motion.div
            style={{ opacity }}
            className="fixed bottom-10 left-1/2 -translate-x-1/2 z-20 pointer-events-none flex flex-col items-center gap-2"
          >
            <span className="text-[10px] uppercase tracking-[0.4em] text-slate-400">Scroll to explore</span>
            <div className="w-[1px] h-12 bg-gradient-to-b from-sage-400 to-transparent"></div>
          </motion.div>

          <Countdown />
          <EventDetails />

          <FAQ />

          <Footer />

          <MusicPlayer />
        </motion.main>
      )}
    </div>
  );
}
