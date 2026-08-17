"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";

/* ===========================================================================
 *  CONFIGURACIÓN (edita aquí fecha, URL de canción, mapa y confirmación)
 * =======================================================================*/
const CONFIG = {
  weddingDate: "2026-11-07T17:00:00-05:00", // 7 nov 2026 5:00 pm
  songUrl: "/music/Fonseca - Prometo (LyricLetra).mp3",
  mapEmbed:
    "https://www.google.com/maps?q=5.0920721,-75.5937616&output=embed",
  mapLink: "https://www.google.com/maps/place/HOTEL+EL+PASO/@5.0920721,-75.5937616,17z/data=!3m1!4b1!4m9!3m8!1s0x8e477143b55a8e99:0x9543e798a941a917!5m2!4m1!1i2!8m2!3d5.0920721!4d-75.5937616!16s%2Fg%2F11kbcmd6s6!18m1!1e1?entry=ttu&g_ep=EgoyMDI2MDcwNi4wIKXMDSoASAFQAw%3D%3D",
  whatsappConfirm:
    "https://wa.me/573000000000?text=Confirmo%20mi%20asistencia%20a%20la%20boda%20de%20Camilo%20%26%20Valentina",
  rsvpLimit: "15 de septiembre",
};

/* ===========================================================================
 *  PÁGINA
 * =======================================================================*/
export default function Home() {
  const [isInvitationOpen, setIsInvitationOpen] = useState(false);
  useReveal(isInvitationOpen);

  useEffect(() => {
    // Asegurar que la página cargue arriba del todo
    window.scrollTo(0, 0);
    
    const images = Array.from(document.querySelectorAll<HTMLImageElement>("img"));
    images.forEach((img, index) => {
      img.decoding = "async";
      img.loading = index < 3 ? "eager" : "lazy";
    });
  }, [isInvitationOpen]);

  return (
    <div className="relative w-full overflow-x-hidden">
      <HeroSaveTheDate
        isInvitationOpen={isInvitationOpen}
        onOpenInvitation={() => setIsInvitationOpen(true)}
      />

      {isInvitationOpen && (
        <>
          <SectionSong startPlayback={isInvitationOpen} />
          <LazySection>
            <SectionLocation />
          </LazySection>
          <LazySection>
            <SectionDressCode />
          </LazySection>
          <LazySection>
            <SectionLluviaSobres />
          </LazySection>
          <LazySection>
            <SectionCountdown />
          </LazySection>
          <LazySection>
            <SectionConfirm />
          </LazySection>
          <LazySection>
            <SectionThanks />
          </LazySection>
        </>
      )}
    </div>
  );
}

/* ===========================================================================
 *  HOOK: revela secciones al hacer scroll
 * =======================================================================*/
function useReveal(trigger: boolean) {
  useEffect(() => {
    if (typeof window === "undefined" || !("IntersectionObserver" in window)) return;
    const els = Array.from(document.querySelectorAll<HTMLElement>(".reveal"));
    els.forEach((el) => el.classList.add("will-reveal"));
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.remove("will-reveal");
            e.target.classList.add("is-visible");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -10% 0px" }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [trigger]);
}

function LazySection({ children }: { children: React.ReactNode }) {
  const hostRef = useRef<HTMLDivElement | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined" || !("IntersectionObserver" in window)) {
      setIsMounted(true);
      return;
    }

    const node = hostRef.current;
    if (!node) return;

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsMounted(true);
            io.disconnect();
          }
        });
      },
      { rootMargin: "260px 0px", threshold: 0.01 }
    );

    io.observe(node);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={hostRef} className={isMounted ? "lazy-section lazy-section--mounted" : "lazy-section"}>
      {isMounted ? children : <div className="lazy-section__placeholder" aria-hidden="true" />}
    </div>
  );
}

/* ===========================================================================
 *  SECCIÓN 1 · SAVE THE DATE
 * =======================================================================*/
function HeroSaveTheDate({
  isInvitationOpen,
  onOpenInvitation,
}: {
  isInvitationOpen: boolean;
  onOpenInvitation: () => void;
}) {
  const sobreAbiertoRef = useRef<HTMLDivElement>(null);
  const envelopeBtnRef = useRef<HTMLButtonElement>(null);

  const createParticles = () => {
    const colors = ['#D4AF37', '#C0C0C0', '#D4AF37', '#C0C0C0', '#D4AF37', '#C0C0C0'];
    const container = document.createElement('div');
    container.className = 'envelope-particles';
    document.body.appendChild(container);

    // Obtener posición del botón del sobre
    const buttonRect = envelopeBtnRef.current?.getBoundingClientRect();
    const centerX = buttonRect ? buttonRect.left + buttonRect.width / 2 : window.innerWidth / 2;
    const centerY = buttonRect ? buttonRect.top + buttonRect.height / 2 : window.innerHeight / 2;

    for (let i = 0; i < 50; i++) {
      const particle = document.createElement('div');
      particle.className = 'particle';
      
      const angle = (Math.random() * 360) * (Math.PI / 180);
      const distance = 150 + Math.random() * 300;
      const tx = Math.cos(angle) * distance;
      const ty = Math.sin(angle) * distance;
      
      particle.style.setProperty('--tx', `${tx}px`);
      particle.style.setProperty('--ty', `${ty}px`);
      particle.style.left = `${centerX}px`;
      particle.style.top = `${centerY}px`;
      particle.style.background = colors[Math.floor(Math.random() * colors.length)];
      particle.style.boxShadow = `0 0 20px ${particle.style.background}`;
      particle.style.animationDelay = `${Math.random() * 0.5}s`;
      
      container.appendChild(particle);
    }

    setTimeout(() => container.remove(), 4000);
  };

  const handleSobreClick = () => {
    if (!isInvitationOpen) {
      onOpenInvitation();
      
      // Crear partículas voladoras
      createParticles();
      
      // Activar efecto de fondo dramático
      document.body.classList.add('envelope-opening-active');
      
      // Animación del sobre cerrado
      if (envelopeBtnRef.current) {
        envelopeBtnRef.current.classList.add('envelope-opening');
      }
      
      // Remover clase del body después de la animación
      setTimeout(() => {
        document.body.classList.remove('envelope-opening-active');
      }, 2500);
    }

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        const target = sobreAbiertoRef.current;
        if (!target) return;
        target.classList.add("hero-open-focus");
        
        // Scroll dramático hacia el contenido abierto
        window.scrollTo({
          top: window.scrollY + 300,
          behavior: 'smooth'
        });
        
        setTimeout(() => {
          target.scrollIntoView({ behavior: "smooth", block: "center" });
        }, 600);
        
        window.setTimeout(() => {
          target.focus({ preventScroll: true });
          target.classList.remove("hero-open-focus");
        }, 2500);
      });
    });
  };

  return (
    <section className="relative pt-8 pb-16 overflow-hidden">
      {/* Fondo sutil con gradientes radiales */}
      <div className="absolute inset-0 bg-gradient-to-b from-white via-[#f8f9fa] to-[#eef1f4]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_20%_10%,rgba(255,255,255,0.9)_0%,transparent_60%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_80%_20%,rgba(255,255,255,0.9)_0%,transparent_55%)]" />

      <div className="relative z-10 grid w-full grid-cols-[1fr_minmax(0,22rem)_1fr] px-0 sm:grid-cols-[minmax(10rem,14rem)_minmax(0,34rem)_minmax(10rem,14rem)] md:grid-cols-[minmax(12rem,16rem)_minmax(0,44rem)_minmax(12rem,16rem)] lg:grid-cols-[minmax(14rem,18rem)_minmax(0,52rem)_minmax(14rem,18rem)]">
        <div className="relative min-h-[7rem] sm:min-h-[9rem] md:min-h-[10rem] lg:min-h-[11rem]">
          <div className="pointer-events-none absolute left-0 top-0 w-[6rem] -translate-x-[40%] -translate-y-[15%] opacity-95 sm:w-[8.5rem] sm:-translate-x-[32%] sm:-translate-y-[10%] md:w-[9.5rem] lg:w-[10.5rem]">
            <img src="/images/Rosa.svg" alt="Rosa decorativa izquierda" className="w-full h-auto" />
          </div>
        </div>

        <div className="flex flex-col items-center px-2 pt-4 text-center sm:px-3 sm:pt-6 md:px-4 md:pt-8 lg:px-5 lg:pt-10">
          <div className="relative mx-auto w-full max-w-[22rem] sm:max-w-[30rem] md:max-w-[38rem] lg:max-w-[44rem] mb-4 sm:mb-6">
            <img src="/images/NombresTitulo.svg" alt="Nombres de los novios" className="w-full h-auto drop-shadow-[0_8px_20px_rgba(20,40,70,0.2)]" />
          </div>

          <div className="relative w-full max-w-[22rem] sm:max-w-[30rem] md:max-w-[38rem] lg:max-w-[44rem]">
            <button
              type="button"
              ref={envelopeBtnRef}
              onClick={handleSobreClick}
              className="hero-envelope-btn w-full cursor-pointer"
              aria-label="Abrir sobre"
            >
              <img src="/images/Sobre.svg" alt="Sobre de invitación" className="hero-envelope-btn__asset w-full h-auto drop-shadow-[0_20px_40px_rgba(15,30,50,0.45)]" />
            </button>
            <p className="hero-envelope-btn__hint">Toca el sobre para abrir la invitación</p>
          </div>

          <div className="relative mx-auto w-full max-w-[22rem] sm:max-w-[30rem] md:max-w-[38rem] lg:max-w-[44rem] mt-4 sm:mt-6">
            <img src="/images/Reservado.svg" alt="Reservado" className="w-full h-auto drop-shadow-[0_4px_12px_rgba(20,40,70,0.15)]" />
          </div>

          <div className={isInvitationOpen ? "hero-opened-content hero-opened-content--visible" : "hero-opened-content"}>
            <div ref={sobreAbiertoRef} tabIndex={-1} className="relative w-full mt-6 sm:mt-8 outline-none">
              <img src="/images/SobreAbierto.svg" alt="Sobre abierto" className="w-full h-auto drop-shadow-[0_15px_35px_rgba(20,40,70,0.3)]" />
            </div>

            <div className="relative w-full mt-4 sm:mt-6">
              <img src="/images/Marco1.svg" alt="Marco 1" className="w-full h-auto" />
            </div>
          </div>
        </div>

        {isInvitationOpen && (
          <div className="relative min-h-[7rem] sm:min-h-[9rem] md:min-h-[10rem] lg:min-h-[11rem]">
            <div className="pointer-events-none absolute right-0 top-0 w-[9rem] translate-x-[55%] -translate-y-[14%] opacity-95 sm:w-[9.1rem] sm:translate-x-[24%] sm:-translate-y-[15%] md:w-[10.1rem] md:translate-x-[28%] md:-translate-y-[16%] lg:w-[12.5rem] lg:translate-x-[32%] lg:-translate-y-[20%] xl:w-[13rem] xl:translate-x-[35%] xl:-translate-y-[22%]">
              <img src="/images/Rosa2.svg" alt="Rosa decorativa derecha" className="w-full h-auto" />
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

/* ===========================================================================
 *  SECCIÓN 2 · CANCIÓN
 * =======================================================================*/
function SectionSong({ startPlayback }: { startPlayback: boolean }) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const a = audioRef.current;
    if (!a) return;
    a.volume = 0.1;
    return undefined;
  }, []);

  useEffect(() => {
    if (!startPlayback) return;
    const a = audioRef.current;
    if (!a) return;
    a.play().then(() => setPlaying(true)).catch(() => setPlaying(false));
  }, [startPlayback]);

  const toggle = useCallback(() => {
    const a = audioRef.current;
    if (!a) return;
    if (playing) {
      a.pause();
      setPlaying(false);
    } else {
      a.play().then(() => setPlaying(true)).catch(() => setPlaying(false));
    }
  }, [playing]);

  return (
    <section className="relative py-14">
      <div className="container-invite text-center reveal">

        <p className="mt-10 font-serif text-xl sm:text-2xl text-[color:var(--ink-deep)] flex items-center justify-center gap-3">
          <IconGuitar className="w-8 h-8" />
          Nuestra Cancion
        </p>
        <div className="mt-2 h-px bg-gradient-to-r from-transparent via-[color:var(--ink-soft)] to-transparent" />

        {/* Player */}
        <div className="mt-8 flex items-center justify-center gap-3">
          <WaveBars />
          <button
            type="button"
            className="play-btn pulse"
            onClick={toggle}
            aria-label={playing ? "Pausar canción" : "Reproducir canción"}
          >
            {playing ? (
              <svg viewBox="0 0 24 24" fill="currentColor"><rect x="7" y="5" width="3.5" height="14" rx="1" /><rect x="13.5" y="5" width="3.5" height="14" rx="1" /></svg>
            ) : (
              <svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5 L20 12 L8 19 Z" /></svg>
            )}
          </button>
          <WaveBars reverse />
        </div>
        <audio ref={audioRef} src={CONFIG.songUrl} onEnded={() => setPlaying(false)} preload="none" />
      </div>
    </section>
  );
}

function WaveBars({ reverse = false }: { reverse?: boolean }) {
  const bars = [10, 16, 22, 16, 10];
  const arr = reverse ? [...bars].reverse() : bars;
  return (
    <div className="flex items-center gap-1 text-[color:var(--ink-deep)]">
      {arr.map((h, i) => (
        <span
          key={i}
          className="inline-block w-[3px] rounded-full bg-current opacity-70"
          style={{ height: `${h}px` }}
        />
      ))}
    </div>
  );
}

/* ===========================================================================
 *  SECCIÓN 3 · UBICACIÓN (imagen con mapa en medio)
 * =======================================================================*/
function SectionLocation() {
  return (
    <section className="relative py-16 sm:py-20 md:py-24 lg:py-28 w-full">
      <div className="w-full px-2 sm:px-3 md:px-4 lg:px-5 reveal">
        <div className="relative mx-auto w-full">
          <img src="/images/Ubicacion.svg" alt="Ubicación" className="w-full h-auto min-h-[60vh] sm:min-h-[70vh] md:min-h-[75vh] lg:min-h-[80vh] object-contain drop-shadow-[0_10px_25px_rgba(20,40,70,0.2)]" />
          
          {/* Mapa posicionado en el medio */}
          <div className="absolute left-1/2 top-[52%] -translate-x-1/2 -translate-y-1/2 w-[55%] sm:w-[38%] md:w-[36%] lg:w-[35%]">
            {/* Sombra difuminada plateada hacia afuera */}
            <div className="absolute -inset-3 pointer-events-none"
                 style={{
                   background: 'radial-gradient(ellipse at center, transparent 55%, rgba(140,150,160,0.4) 75%, rgba(105,115,125,0.55) 90%, transparent 100%)',
                   filter: 'blur(8px)',
                   clipPath: 'polygon(3% 1%, 12% 3%, 25% 0%, 40% 2%, 55% 0%, 70% 3%, 85% 1%, 96% 4%, 100% 12%, 98% 25%, 100% 40%, 97% 55%, 100% 70%, 98% 85%, 96% 96%, 85% 98%, 70% 100%, 55% 97%, 40% 100%, 25% 98%, 12% 100%, 4% 97%, 0% 85%, 2% 70%, 0% 55%, 3% 40%, 0% 25%, 2% 12%)'
                 }} />
            <div className="relative w-full h-24 sm:h-32 md:h-36 lg:h-40 overflow-hidden" 
                 style={{
                   boxShadow: '0 0 0 6px rgba(150,160,170,0.5), 0 0 15px 8px rgba(120,130,140,0.4), 0 0 35px rgba(105,115,125,0.45), 0 10px 40px rgba(31,51,70,0.4)',
                   background: 'linear-gradient(145deg, rgba(255,255,255,0.95) 0%, rgba(235,240,245,0.98) 100%)',
                   clipPath: 'polygon(3% 1%, 12% 3%, 25% 0%, 40% 2%, 55% 0%, 70% 3%, 85% 1%, 96% 4%, 100% 12%, 98% 25%, 100% 40%, 97% 55%, 100% 70%, 98% 85%, 96% 96%, 85% 98%, 70% 100%, 55% 97%, 40% 100%, 25% 98%, 12% 100%, 4% 97%, 0% 85%, 2% 70%, 0% 55%, 3% 40%, 0% 25%, 2% 12%)',
                   border: 'none'
                 }}>
              <iframe
                title="Mapa ubicación"
                src={CONFIG.mapEmbed}
                className="w-full h-full border-0"
                loading="lazy"
              />
              {/* Efecto de bordes desgastados internos plateados */}
              <div className="absolute inset-0 pointer-events-none" 
                   style={{
                     boxShadow: 'inset 0 0 20px 6px rgba(120,130,140,0.55), inset 0 0 40px 10px rgba(150,160,170,0.3)',
                   }} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ===========================================================================
 *  SECCIÓN 4 · DRESS CODE (imagen)
 * =======================================================================*/
function SectionDressCode() {
  return (
    <section className="relative py-16 sm:py-20 md:py-24 lg:py-28 w-full">
      <div className="w-full px-2 sm:px-3 md:px-4 lg:px-5 reveal">
        <div className="relative mx-auto w-full">
          <img src="/images/dresscode.svg" alt="Dress Code" className="w-full h-auto drop-shadow-[0_10px_25px_rgba(20,40,70,0.2)]" />
        </div>
        <div className="relative mx-auto w-full mt-6 sm:mt-8">
          <img src="/images/dresscodetext.svg" alt="Dress Code Text" className="w-full h-auto drop-shadow-[0_10px_25px_rgba(20,40,70,0.2)]" />
        </div>
        <div className="relative mx-auto w-full mt-6 sm:mt-8">
          <img src="/images/ColoresReservados.svg" alt="Colores Reservados" className="w-full h-auto drop-shadow-[0_10px_25px_rgba(20,40,70,0.2)]" />
        </div>
      </div>
    </section>
  );
}

/* ===========================================================================
 *  SECCIÓN 5 · LLUVIA (imagen)
 * =======================================================================*/
function SectionLluviaSobres() {
  return (
    <section className="relative py-16 sm:py-20 md:py-24 lg:py-28 w-full">
      <div className="w-full px-2 sm:px-3 md:px-4 lg:px-5 reveal">
        <div className="relative mx-auto w-full">
          <img src="/images/lluvia.svg" alt="Lluvia" className="w-full h-auto drop-shadow-[0_10px_25px_rgba(20,40,70,0.2)]" />
        </div>
      </div>
    </section>
  );
}

/* ===========================================================================
 *  SECCIÓN 6 · COUNTDOWN
 * =======================================================================*/
function SectionCountdown() {
  const target = useMemo(() => new Date(CONFIG.weddingDate).getTime(), []);
  const [now, setNow] = useState<number | null>(null);

  useEffect(() => {
    setNow(Date.now());
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  const diff = Math.max(0, target - (now ?? target));
  const days = Math.floor(diff / 86_400_000);
  const hours = Math.floor((diff % 86_400_000) / 3_600_000);
  const minutes = Math.floor((diff % 3_600_000) / 60_000);
  const seconds = Math.floor((diff % 60_000) / 1000);

  return (
    <section className="relative py-10">
      <div className="container-invite text-center reveal">
        <div className="flex items-center justify-center gap-3">
          <h3 className="font-script text-5xl sm:text-6xl text-[color:var(--ink-deep)]">Faltan</h3>
          <RoseBouquet className="w-16 sm:w-20 text-[color:var(--ink-deep)]" />
        </div>

        <div className="mt-6 grid grid-cols-4 gap-2">
          <CountCell value={days} label="Días" />
          <CountCell value={hours} label="Horas" />
          <CountCell value={minutes} label="Min" />
          <CountCell value={seconds} label="Seg" />
        </div>
      </div>
    </section>
  );
}

function CountCell({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center">
      <span className="count-num tabular-nums">{String(value).padStart(2, "0")}</span>
      <span className="count-label">{label}</span>
    </div>
  );
}

/* ===========================================================================
 *  SECCIÓN 11 · CONFIRMAR ASISTENCIA
 * =======================================================================*/
function SectionConfirm() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <section className="relative py-14">
      <div className="container-invite text-center reveal">
        <div className="ornament text-[color:var(--ink-soft)] text-lg">
          <span>&#10086;</span>
        </div>
        <p className="mt-4 font-serif-it text-lg sm:text-xl text-[color:var(--ink-deep)] leading-relaxed">
          Por eso recuerda <strong className="font-semibold not-italic">confirmar tu asistencia</strong>
          <br />
          antes del <strong className="font-semibold not-italic">{CONFIG.rsvpLimit}</strong>
        </p>

        <div className="mt-8">
          <button
            type="button"
            className="btn-confirm-image"
            aria-label="Confirmar asistencia"
            onClick={() => setIsModalOpen(true)}
          >
            <img
              src="/images/ConfirmarAsistencia.svg"
              alt="Confirmar asistencia"
              className="btn-confirm-image__asset"
            />
            <span className="btn-confirm-image__hint">Toca el botón para confirmar tu asistencia</span>
          </button>
        </div>

        <div className="mt-8 ornament text-[color:var(--ink-soft)] text-lg">
          <span>&#10086;</span>
        </div>
      </div>
      <ModalConfirm isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </section>
  );
}

type RsvpStatus = "idle" | "loading" | "success" | "already-registered" | "error";

function ModalConfirm({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const emptyForm = { nombre: "", telefono: "" };
  const [formData, setFormData] = useState(emptyForm);
  const [status, setStatus] = useState<RsvpStatus>("idle");
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    if (!isOpen) {
      setStatus("idle");
      setErrorMsg("");
      return;
    }

    const preventScroll = (e: Event) => { e.preventDefault(); e.stopPropagation(); };
    const preventKeyScroll = (e: KeyboardEvent) => {
      const scrollKeys = ["ArrowUp", "ArrowDown", "PageUp", "PageDown", "Space", "Home", "End"];
      if (scrollKeys.includes(e.key)) { e.preventDefault(); e.stopPropagation(); }
    };

    const scrollY = window.scrollY;
    document.body.style.top = `-${scrollY}px`;
    document.documentElement.classList.add("modal-open");
    document.body.classList.add("modal-open");
    window.addEventListener("wheel", preventScroll, { passive: false });
    window.addEventListener("touchmove", preventScroll, { passive: false });
    window.addEventListener("scroll", preventScroll, { passive: false });
    window.addEventListener("keydown", preventKeyScroll, { passive: false });

    return () => {
      document.documentElement.classList.remove("modal-open");
      document.body.classList.remove("modal-open");
      document.body.style.top = "";
      window.removeEventListener("wheel", preventScroll);
      window.removeEventListener("touchmove", preventScroll);
      window.removeEventListener("scroll", preventScroll);
      window.removeEventListener("keydown", preventKeyScroll);
      window.scrollTo({ top: scrollY, behavior: "instant" });
    };
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setErrorMsg("");

    try {
      const res = await fetch("/api/rsvp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();

      if (data.alreadyRegistered) {
        setStatus("already-registered");
        return;
      }
      if (!data.success) {
        setStatus("error");
        setErrorMsg(data.error ?? "Ocurrió un error, intenta de nuevo.");
        return;
      }

      setStatus("success");
      setFormData(emptyForm);
    } catch {
      setStatus("error");
      setErrorMsg("No se pudo conectar con el servidor. Verifica tu conexión.");
    }
  };

  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);
  if (!mounted) return null;

  return createPortal(
    <>
      <div id="modal-confirm" className={`modal-confirm ${isOpen ? "modal-confirm--open" : ""}`}>
        <div className="modal-confirm__content">
          <button type="button" className="modal-confirm__close" aria-label="Cerrar" onClick={onClose}>
            <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>

          <h3 className="modal-confirm__title font-script text-3xl sm:text-4xl text-[color:var(--ink-deep)]">Confirmar Asistencia</h3>

          {status === "success" && (
            <div className="modal-confirm__feedback modal-confirm__feedback--success">
              <p className="font-serif-it text-lg">¡Gracias! Tu asistencia ha sido confirmada 🎉</p>
              <button type="button" className="modal-confirm__submit font-serif-it mt-4" onClick={onClose}>Cerrar</button>
            </div>
          )}

          {status === "already-registered" && (
            <div className="modal-confirm__feedback modal-confirm__feedback--warn">
              <p className="font-serif-it text-lg">Ya has confirmado tu asistencia anteriormente.</p>
              <p className="text-sm mt-1 text-[color:var(--ink-soft)]">Si crees que es un error, contáctanos.</p>
              <button type="button" className="modal-confirm__submit font-serif-it mt-4" onClick={onClose}>Cerrar</button>
            </div>
          )}

          {(status === "idle" || status === "loading" || status === "error") && (
            <form onSubmit={handleSubmit} className="modal-confirm__form">
              <div className="modal-confirm__field">
                <label htmlFor="nombre" className="modal-confirm__label">Nombre y Apellido</label>
                <input type="text" id="nombre" required value={formData.nombre}
                  onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                  className="modal-confirm__input" placeholder="Tu nombre completo" disabled={status === "loading"} />
              </div>
              <div className="modal-confirm__field">
                <label htmlFor="telefono" className="modal-confirm__label">Número de Teléfono</label>
                <input type="tel" id="telefono" required value={formData.telefono}
                  onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                  className="modal-confirm__input" placeholder="Tu número de teléfono" disabled={status === "loading"} />
              </div>

              {status === "error" && (
                <p className="modal-confirm__feedback modal-confirm__feedback--error text-sm">{errorMsg}</p>
              )}

              <button type="submit" className="modal-confirm__submit font-serif-it" disabled={status === "loading"}>
                {status === "loading" ? "Guardando..." : "Confirmar"}
              </button>
            </form>
          )}
        </div>
      </div>
      <div
        id="modal-confirm-backdrop"
        className={`modal-confirm__backdrop ${isOpen ? "modal-confirm__backdrop--open" : ""}`}
        onClick={status === "loading" ? undefined : onClose}
      />
    </>,
    document.body
  );
}

/* ===========================================================================
 *  SECCIÓN 7 · ROSA FINAL (imagen)
 * =======================================================================*/
function SectionThanks() {
  return (
    <section className="relative py-16 sm:py-20 md:py-24 lg:py-28 w-full overflow-hidden">
      <div className="w-full px-2 sm:px-3 md:px-4 lg:px-5 reveal">
        <div className="flex flex-col items-center">
          <div className="max-w-[8rem] sm:max-w-[10rem] md:max-w-[12rem] lg:max-w-[14rem] mb-4 sm:mb-6">
            <img src="/images/separador.svg" alt="Separador" className="w-full h-auto drop-shadow-[0_8px_20px_rgba(20,40,70,0.2)]" />
          </div>
          <div className="max-w-[22rem] sm:max-w-[30rem] md:max-w-[38rem] lg:max-w-[44rem] mb-4 sm:mb-6">
            <img src="/images/gracias.svg" alt="Gracias" className="w-full h-auto drop-shadow-[0_8px_20px_rgba(20,40,70,0.2)]" />
          </div>
          <div className="max-w-[22rem] sm:max-w-[30rem] md:max-w-[38rem] lg:max-w-[44rem] mb-6 sm:mb-8">
            <img src="/images/nombresolo.svg" alt="Nombre Solo" className="w-full h-auto drop-shadow-[0_8px_20px_rgba(20,40,70,0.2)]" />
          </div>
        </div>
      </div>
      <div className="w-full px-2 sm:px-3 md:px-4 lg:px-5 reveal relative h-[60vh] sm:h-[70vh] md:h-[75vh] lg:h-[80vh] overflow-hidden">
        <img src="/images/rosafinal.svg" alt="Rosa Final" className="absolute top-0 left-0 w-full h-auto md:bottom-0 md:top-auto -translate-y-[30%] sm:-translate-y-[35%] md:translate-y-[50%] lg:translate-y-[45%] drop-shadow-[0_10px_25px_rgba(20,40,70,0.2)]" />
      </div>
    </section>
  );
}

/* ===========================================================================
 *  COMPONENTES DECORATIVOS (SVG inline)
 * =======================================================================*/
function OrnateFrame({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative">
      <svg viewBox="0 0 400 260" preserveAspectRatio="none" className="absolute inset-0 w-full h-full" aria-hidden>
        <defs>
          <linearGradient id="frameFill" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#d4dde6" />
            <stop offset="55%" stopColor="#e7ecf1" />
            <stop offset="100%" stopColor="#aabccf" />
          </linearGradient>
        </defs>
        <path
          d="M 30 40
             C 30 22, 50 10, 80 16
             C 140 6, 260 6, 320 16
             C 350 10, 370 22, 370 40
             C 380 80, 380 180, 370 220
             C 370 238, 350 250, 320 244
             C 260 254, 140 254, 80 244
             C 50 250, 30 238, 30 220
             C 20 180, 20 80, 30 40 Z"
          fill="url(#frameFill)"
          stroke="#1f3346"
          strokeWidth="2"
        />
        <path
          d="M 38 46
             C 38 28, 56 18, 84 24
             C 142 16, 258 16, 316 24
             C 344 18, 362 28, 362 46
             C 372 82, 372 178, 362 214
             C 362 232, 344 242, 316 236
             C 258 246, 142 246, 84 236
             C 56 242, 38 232, 38 214
             C 28 178, 28 82, 38 46 Z"
          fill="none"
          stroke="#1f3346"
          strokeWidth="0.7"
          opacity="0.7"
        />
        <g stroke="#1f3346" strokeWidth="1" fill="none" opacity="0.9">
          <path d="M 30 40 C 18 28, 14 18, 26 10 C 34 4, 44 12, 40 22" />
          <path d="M 370 40 C 382 28, 386 18, 374 10 C 366 4, 356 12, 360 22" />
          <path d="M 30 220 C 18 232, 14 242, 26 250 C 34 256, 44 248, 40 238" />
          <path d="M 370 220 C 382 232, 386 242, 374 250 C 366 256, 356 248, 360 238" />
        </g>
      </svg>
      <div className="relative">{children}</div>
    </div>
  );
}

function FloralCluster({ className = "", flip = false }: { className?: string; flip?: boolean }) {
  return (
    <svg
      viewBox="0 0 200 200"
      className={className}
      style={{ transform: flip ? "scaleX(-1)" : undefined }}
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <defs>
        <radialGradient id="petalFL" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#eaf0f6" />
          <stop offset="55%" stopColor="#8aa4bd" />
          <stop offset="100%" stopColor="#3e5874" />
        </radialGradient>
        <radialGradient id="leafFL" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#c4d2df" />
          <stop offset="100%" stopColor="#4f6e8c" />
        </radialGradient>
      </defs>
      {/* tallos y hojas */}
      <g opacity="0.95">
        <path d="M15 175 C 40 110, 80 80, 140 65" stroke="#4f6e8c" strokeWidth="1.2" fill="none" />
        <path d="M8 145 C 30 115, 70 95, 125 95" stroke="#4f6e8c" strokeWidth="1" fill="none" />
        <ellipse cx="55" cy="120" rx="16" ry="6" fill="url(#leafFL)" transform="rotate(-35 55 120)" />
        <ellipse cx="85" cy="95" rx="20" ry="7" fill="url(#leafFL)" transform="rotate(-25 85 95)" />
        <ellipse cx="35" cy="150" rx="14" ry="5" fill="url(#leafFL)" transform="rotate(-45 35 150)" />
        <ellipse cx="130" cy="70" rx="22" ry="7" fill="url(#leafFL)" transform="rotate(-12 130 70)" />
        <ellipse cx="160" cy="55" rx="16" ry="5" fill="url(#leafFL)" transform="rotate(5 160 55)" />
      </g>
      {/* rosa principal */}
      <g>
        <circle cx="95" cy="115" r="38" fill="url(#petalFL)" />
        <path d="M95 85 C 78 100, 78 122, 95 137 C 112 122, 112 100, 95 85 Z" fill="#2f4a66" opacity="0.55" />
        <path d="M70 112 C 82 104, 108 104, 120 112 C 108 122, 82 122, 70 112 Z" fill="#233b55" opacity="0.5" />
        <path d="M85 115 C 88 112, 102 112, 105 115 C 102 120, 88 120, 85 115 Z" fill="#1f3346" opacity="0.8" />
        <circle cx="95" cy="115" r="4" fill="#1f3346" />
      </g>
      {/* rosa secundaria */}
      <g>
        <circle cx="150" cy="140" r="20" fill="url(#petalFL)" />
        <circle cx="150" cy="140" r="5" fill="#1f3346" />
      </g>
      {/* botones */}
      <g fill="url(#petalFL)">
        <circle cx="40" cy="95" r="6" />
        <circle cx="175" cy="85" r="5" />
        <circle cx="60" cy="170" r="5" />
        <circle cx="170" cy="170" r="4" />
      </g>
    </svg>
  );
}

function RoseBouquet({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 160 140" className={className} fill="none" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" aria-hidden>
      <path d="M80 130 C 80 100, 68 90, 58 80" />
      <path d="M80 130 C 80 105, 92 90, 102 80" />
      <path d="M80 130 C 80 108, 80 95, 80 70" />
      <circle cx="60" cy="58" r="18" />
      <circle cx="102" cy="55" r="16" />
      <circle cx="82" cy="36" r="14" />
      <path d="M53 60 C 58 55, 62 55, 67 60 M57 65 C 63 63, 70 67, 66 72" />
      <path d="M95 55 C 100 50, 106 52, 109 57" />
      <path d="M76 36 C 80 32, 86 32, 89 37" />
      <path d="M72 128 C 76 120, 84 120, 88 128" />
      <path d="M70 132 L 58 142 M90 132 L 102 142" />
    </svg>
  );
}

/* ===========================================================================
 *  ÍCONOS (línea)
 * =======================================================================*/
const iconBase = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.7,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

function IconEnvelope(p: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" {...iconBase} {...p}>
      <rect x="3" y="6" width="18" height="13" rx="1.5" />
      <path d="M3 7 L12 14 L21 7" />
    </svg>
  );
}
function IconMusic(p: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" {...iconBase} {...p}>
      <path d="M9 18 V6 L19 4 V16" />
      <circle cx="7" cy="18" r="2" />
      <circle cx="17" cy="16" r="2" />
    </svg>
  );
}
function IconGuitar(p: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" {...iconBase} {...p}>
      <path d="M14 4 L20 10" />
      <path d="M17 3 L21 7" />
      <path d="M13 9 C 9 13, 5 13, 5 17 C 5 20, 7 22, 10 22 C 14 22, 14 18, 18 14" />
      <circle cx="11" cy="16" r="1.5" />
    </svg>
  );
}
function IconPin(p: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" {...iconBase} {...p}>
      <path d="M12 22 C 6 15, 4 11, 4 8 A 8 8 0 0 1 20 8 C 20 11, 18 15, 12 22 Z" />
      <circle cx="12" cy="9" r="2.6" />
      <path d="M9 9 h6" />
    </svg>
  );
}
function IconPlane(p: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" {...iconBase} {...p}>
      <path d="M3 12 L21 5 L14 21 L11 13 Z" />
      <path d="M11 13 L21 5" />
    </svg>
  );
}
function IconClock(p: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" {...iconBase} {...p}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7 V12 L15.5 14" />
    </svg>
  );
}
function IconRings(p: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" {...iconBase} {...p}>
      <circle cx="9" cy="15" r="5" />
      <circle cx="15" cy="15" r="5" />
      <path d="M7 7 L9 9 M15 7 L13 9 M11 5 L13 5" />
    </svg>
  );
}
function IconArch(p: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" {...iconBase} {...p}>
      <path d="M4 20 V11 A 8 8 0 0 1 20 11 V20" />
      <path d="M4 20 H20" />
      <path d="M8 20 V15 M16 20 V15" />
    </svg>
  );
}
function IconCalendar(p: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" {...iconBase} {...p}>
      <rect x="3" y="5" width="18" height="16" rx="2" />
      <path d="M3 9 H21" />
      <path d="M8 3 V7 M16 3 V7" />
      <path d="M12 14 l1 1 l-1 1 l-1-1 z" fill="currentColor" />
    </svg>
  );
}
function IconBride(p: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" {...iconBase} {...p}>
      <circle cx="12" cy="5" r="2.5" />
      <path d="M8 22 L10 12 H14 L16 22 Z" />
      <path d="M10 12 L12 8 L14 12" />
    </svg>
  );
}
function IconBow(p: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" {...iconBase} {...p}>
      <path d="M3 12 C 6 8, 10 8, 12 12 C 14 16, 18 16, 21 12 C 18 8, 14 8, 12 12 C 10 16, 6 16, 3 12 Z" />
      <circle cx="12" cy="12" r="1.2" fill="currentColor" />
    </svg>
  );
}
function IconDress(p: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" {...iconBase} {...p}>
      <path d="M9 4 L15 4 L14 9 L18 21 L6 21 L10 9 Z" />
    </svg>
  );
}
function IconSuit(p: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" {...iconBase} {...p}>
      <path d="M7 3 L12 6 L17 3 L20 21 L4 21 Z" />
      <path d="M12 6 L12 21" />
      <path d="M10 9 L12 11 L14 9" />
    </svg>
  );
}
function IconForbidden(p: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" {...iconBase} {...p}>
      <circle cx="12" cy="12" r="9" />
      <path d="M6 6 L18 18" />
    </svg>
  );
}
function IconHeart(p: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" {...iconBase} {...p}>
      <path d="M12 20 C 5 14, 3 10, 6 7 C 9 4, 12 8, 12 8 C 12 8, 15 4, 18 7 C 21 10, 19 14, 12 20 Z" />
    </svg>
  );
}
function IconCardHeart(p: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" {...iconBase} {...p}>
      <rect x="3" y="6" width="16" height="12" rx="1" />
      <path d="M7 10 C 8 9, 9 10, 9 11 C 9 12, 7 13, 7 13 C 7 13, 5 12, 5 11 C 5 10, 6 9, 7 10 Z" />
    </svg>
  );
}
