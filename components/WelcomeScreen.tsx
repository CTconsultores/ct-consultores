"use client";

import Logo from "./Logo";

interface Props {
  onLogin: () => void;
  onOnboarding: () => void;
}

export default function WelcomeScreen({ onLogin, onOnboarding }: Props) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 relative overflow-hidden"
      style={{ background: "linear-gradient(135deg, #1a3a2a 0%, #2d5a3d 50%, #1a3a2a 100%)" }}>

      {/* Decorative circles */}
      <div className="absolute top-[-120px] right-[-120px] w-[400px] h-[400px] rounded-full opacity-10"
        style={{ background: "radial-gradient(circle, #c8763a, transparent)" }} />
      <div className="absolute bottom-[-80px] left-[-80px] w-[300px] h-[300px] rounded-full opacity-10"
        style={{ background: "radial-gradient(circle, #c8763a, transparent)" }} />

      {/* Grid lines decoration */}
      <div className="absolute inset-0 opacity-5"
        style={{ backgroundImage: "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)", backgroundSize: "60px 60px" }} />

      <div className="relative z-10 flex flex-col items-center text-center max-w-2xl mx-auto">

        {/* Logo */}
        <div className="mb-8 p-6 rounded-2xl"
          style={{ background: "rgba(255,255,255,0.08)", backdropFilter: "blur(10px)", border: "1px solid rgba(255,255,255,0.12)" }}>
          <Logo size="lg" />
        </div>

        {/* Headline */}
        <h1 className="text-white mb-4 leading-tight"
          style={{ fontFamily: "var(--font-cormorant)", fontSize: "clamp(1.6rem, 4vw, 2.4rem)", fontWeight: 300, letterSpacing: "0.01em" }}>
          Construimos tu estrategia financiera personal<br />
          <span style={{ color: "#e0935a", fontWeight: 500 }}>con visión, orden y elegancia.</span>
        </h1>

        <p className="mb-10 leading-relaxed"
          style={{ color: "rgba(255,255,255,0.65)", fontSize: "1rem", maxWidth: "520px" }}>
          Bienvenido a tu espacio financiero personal. En CT Consultores analizamos
          tu situación para ayudarte a tomar mejores decisiones.
        </p>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md">
          <button
            onClick={onLogin}
            className="flex-1 flex items-center justify-center gap-2 py-4 px-6 rounded-xl font-medium text-sm transition-all duration-200 cursor-pointer"
            style={{ background: "rgba(255,255,255,0.12)", color: "#fff", border: "1px solid rgba(255,255,255,0.25)", backdropFilter: "blur(10px)" }}
            onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.2)"; }}
            onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.12)"; }}
          >
            <span>→</span> Entrar a mi área personal
          </button>

          <button
            onClick={onOnboarding}
            className="flex-1 flex items-center justify-center gap-2 py-4 px-6 rounded-xl font-medium text-sm transition-all duration-200 cursor-pointer"
            style={{ background: "#c8763a", color: "#fff", border: "none" }}
            onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = "#e0935a"; }}
            onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = "#c8763a"; }}
          >
            <span>✦</span> Iniciar nuevo análisis financiero
          </button>
        </div>

        <p className="mt-10 text-xs" style={{ color: "rgba(255,255,255,0.35)", letterSpacing: "0.08em", textTransform: "uppercase" }}>
          Asesoramiento financiero privado · Confidencialidad garantizada
        </p>
      </div>
    </div>
  );
}
