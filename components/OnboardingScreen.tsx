"use client";

import { useState } from "react";
import Logo from "./Logo";
import type { Deuda, Inversion } from "@/lib/types";
import { generateUsername, hashPassword, saveUser, setSession } from "@/lib/storage";

interface Props {
  onComplete: (username: string) => void;
  onBack: () => void;
}

const TIPOS_DEUDA = ["Hipoteca", "Préstamo personal", "Préstamo de coche", "Tarjeta de crédito", "Otra financiación"];
const TIPOS_INV = ["Fondo de inversión", "Fondo indexado", "Acciones", "ETF", "Plan de pensiones", "Depósito", "Cuenta remunerada", "Criptomonedas", "Otro producto"];

function parseCurrency(val: string): number {
  return parseFloat(val.replace(/\./g, "").replace(",", ".")) || 0;
}

function formatCurrency(val: string): string {
  const num = val.replace(/[^\d]/g, "");
  if (!num) return "";
  return parseInt(num, 10).toLocaleString("es-ES");
}

export default function OnboardingScreen({ onComplete, onBack }: Props) {
  const [step, setStep] = useState(1);
  const [animating, setAnimating] = useState(false);

  // Step 1
  const [nombre, setNombre] = useState("");
  const [fechaNac, setFechaNac] = useState("");
  const [profesion, setProfesion] = useState("");

  // Step 2
  const [ahorro, setAhorro] = useState("");

  // Step 3
  const [tieneDeudas, setTieneDeudas] = useState<"si" | "no" | null>(null);
  const [deudas, setDeudas] = useState<Deuda[]>([{ tipo: TIPOS_DEUDA[0], importe: 0, fechaFin: "" }]);

  // Step 4
  const [tieneInv, setTieneInv] = useState<"si" | "no" | null>(null);
  const [inversiones, setInversiones] = useState<Inversion[]>([{ producto: TIPOS_INV[0], cantidad: 0 }]);

  // Step 5
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [showPass2, setShowPass2] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  function goNext(n: number) {
    const errs = validate(n);
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setErrors({});
    setAnimating(true);
    setTimeout(() => { setStep(n + 1); setAnimating(false); }, 250);
  }

  function goPrev(n: number) {
    setErrors({});
    setAnimating(true);
    setTimeout(() => { setStep(n - 1); setAnimating(false); }, 250);
  }

  function validate(n: number): Record<string, string> {
    const e: Record<string, string> = {};
    if (n === 1) {
      if (!nombre.trim()) e.nombre = "Introduce tu nombre";
      if (!fechaNac) e.fechaNac = "Introduce tu fecha de nacimiento";
      if (!profesion.trim()) e.profesion = "Introduce tu profesión";
    }
    if (n === 2) {
      if (!ahorro) e.ahorro = "Introduce tu ahorro actual";
    }
    if (n === 3) {
      if (tieneDeudas === null) e.deudas = "Selecciona una opción";
      if (tieneDeudas === "si") {
        deudas.forEach((d, i) => {
          if (!d.fechaFin) e[`deuda_fecha_${i}`] = "Introduce la fecha de finalización";
          if (!d.importe) e[`deuda_importe_${i}`] = "Introduce el importe";
          if (d.tipo === "Otra financiación" && !d.tipoCustom?.trim()) e[`deuda_custom_${i}`] = "Describe el tipo de financiación";
        });
      }
    }
    if (n === 4) {
      if (tieneInv === null) e.inversiones = "Selecciona una opción";
      if (tieneInv === "si") {
        inversiones.forEach((inv, i) => {
          if (!inv.cantidad) e[`inv_cantidad_${i}`] = "Introduce la cantidad";
          if (inv.producto === "Otro producto" && !inv.productoCustom?.trim()) e[`inv_custom_${i}`] = "Describe el producto";
        });
      }
    }
    if (n === 5) {
      if (password.length < 6) e.password = "La contraseña debe tener al menos 6 caracteres";
      if (password !== password2) e.password2 = "Las contraseñas no coinciden";
    }
    return e;
  }

  function createProfile() {
    const errs = validate(5);
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    const username = generateUsername(nombre);
    saveUser({
      username,
      passwordHash: hashPassword(password),
      nombre: nombre.trim(),
      fechaNac,
      profesion: profesion.trim(),
      ahorro: parseCurrency(ahorro),
      deudas: tieneDeudas === "si" ? deudas : [],
      inversiones: tieneInv === "si" ? inversiones : [],
      createdAt: new Date().toISOString(),
    });
    setSession(username);
    onComplete(username);
  }

  // Deudas handlers
  function addDeuda() { setDeudas([...deudas, { tipo: TIPOS_DEUDA[0], importe: 0, fechaFin: "" }]); }
  function removeDeuda(i: number) { setDeudas(deudas.filter((_, idx) => idx !== i)); }
  function updateDeuda(i: number, field: keyof Deuda, val: string | number) {
    setDeudas(prev => prev.map((d, idx) => idx === i ? { ...d, [field]: val } : d));
  }

  // Inversiones handlers
  function addInversion() { setInversiones([...inversiones, { producto: TIPOS_INV[0], cantidad: 0 }]); }
  function removeInversion(i: number) { setInversiones(inversiones.filter((_, idx) => idx !== i)); }
  function updateInversion(i: number, field: keyof Inversion, val: string | number) {
    setInversiones(prev => prev.map((inv, idx) => idx === i ? { ...inv, [field]: val } : inv));
  }

  const stepLabels = ["Datos personales", "Ahorro", "Financiación", "Inversiones", "Acceso"];

  return (
    <div className="min-h-screen flex" style={{ background: "var(--ivory)" }}>

      {/* Sidebar */}
      <aside className="hidden lg:flex flex-col w-[280px] flex-shrink-0 py-10 px-8"
        style={{ background: "var(--green-dark)", position: "relative", overflow: "hidden" }}>
        <div className="absolute bottom-0 right-0 w-48 h-48 opacity-10 rounded-full"
          style={{ background: "radial-gradient(circle, #c8763a, transparent)", transform: "translate(30%, 30%)" }} />
        <div className="mb-10 flex justify-center">
          <Logo size="sm" />
        </div>

        {/* Progress */}
        <div className="flex flex-col gap-1 flex-1">
          {stepLabels.map((label, idx) => {
            const n = idx + 1;
            const done = step > n;
            const active = step === n;
            return (
              <div key={n} className="flex items-center gap-3 py-3">
                <div style={{
                  width: 28, height: 28, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.75rem", fontWeight: 600, flexShrink: 0,
                  background: done ? "#c8763a" : active ? "#fff" : "rgba(255,255,255,0.15)",
                  color: done ? "#fff" : active ? "var(--green-dark)" : "rgba(255,255,255,0.5)",
                  transition: "all 0.3s",
                }}>
                  {done ? "✓" : n}
                </div>
                <span style={{ fontSize: "0.85rem", fontWeight: active ? 500 : 400, color: active ? "#fff" : done ? "rgba(255,255,255,0.7)" : "rgba(255,255,255,0.4)", transition: "color 0.3s" }}>
                  {label}
                </span>
              </div>
            );
          })}
        </div>

        <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.75rem", lineHeight: 1.7, fontStyle: "italic", borderTop: "1px solid rgba(255,255,255,0.1)", paddingTop: "1.5rem" }}>
          "Vamos a construir una primera imagen de tu situación financiera. Solo necesitaremos algunos datos básicos."
        </p>
      </aside>

      {/* Main */}
      <main className="flex-1 flex items-start justify-center py-10 px-4">
        {/* Mobile header */}
        <div className="lg:hidden fixed top-0 left-0 right-0 z-20 px-4 py-3 flex items-center gap-3"
          style={{ background: "var(--green-dark)", borderBottom: "1px solid rgba(255,255,255,0.1)" }}>
          <Logo size="xs" />
          <div className="flex gap-1 ml-auto">
            {[1,2,3,4,5].map(n => (
              <div key={n} style={{ width: 8, height: 8, borderRadius: "50%", background: step >= n ? "#c8763a" : "rgba(255,255,255,0.2)", transition: "background 0.3s" }} />
            ))}
          </div>
        </div>

        <div className="w-full max-w-xl mt-10 lg:mt-0">
          <div
            style={{
              background: "#fff",
              borderRadius: "20px",
              boxShadow: "0 4px 40px rgba(26,58,42,0.10)",
              border: "1px solid var(--gray-light)",
              padding: "clamp(1.5rem, 5vw, 2.5rem)",
              opacity: animating ? 0 : 1,
              transform: animating ? "translateY(8px)" : "translateY(0)",
              transition: "opacity 0.25s, transform 0.25s",
            }}
          >
            {/* ── STEP 1 ── */}
            {step === 1 && (
              <>
                <StepHeader num="01" title="Datos personales" sub="Empecemos por conocerte un poco mejor." />
                <FieldGroup>
                  <Field label="¿Cómo te llamas?" error={errors.nombre}>
                    <input type="text" value={nombre} onChange={e => setNombre(e.target.value)} placeholder="Tu nombre completo" style={IS} onFocus={focusStyle} onBlur={blurStyle} />
                  </Field>
                  <Field label="Fecha de nacimiento" error={errors.fechaNac}>
                    <input type="date" value={fechaNac} onChange={e => setFechaNac(e.target.value)} style={IS} onFocus={focusStyle} onBlur={blurStyle} max={new Date().toISOString().split("T")[0]} />
                  </Field>
                  <Field label="¿A qué te dedicas?" error={errors.profesion}>
                    <input type="text" value={profesion} onChange={e => setProfesion(e.target.value)} placeholder="Tu profesión o actividad" style={IS} onFocus={focusStyle} onBlur={blurStyle} />
                  </Field>
                </FieldGroup>
                <StepActions onNext={() => goNext(1)} />
              </>
            )}

            {/* ── STEP 2 ── */}
            {step === 2 && (
              <>
                <StepHeader num="02" title="Situación de ahorro" sub="¿Cuál es tu ahorro actual disponible?" />
                <FieldGroup>
                  <Field label="Ahorro actual disponible" error={errors.ahorro} hint="Incluye cuentas corrientes, cuentas de ahorro y efectivo disponible.">
                    <div style={{ position: "relative" }}>
                      <input
                        type="text" value={ahorro}
                        onChange={e => setAhorro(formatCurrency(e.target.value))}
                        placeholder="0" style={{ ...IS, paddingRight: "3rem", textAlign: "right" }}
                        onFocus={focusStyle} onBlur={blurStyle}
                      />
                      <span style={{ position: "absolute", right: "1rem", top: "50%", transform: "translateY(-50%)", color: "var(--gray-mid)", fontWeight: 500, fontSize: "1rem" }}>€</span>
                    </div>
                  </Field>
                </FieldGroup>
                <StepActions onPrev={() => goPrev(2)} onNext={() => goNext(2)} />
              </>
            )}

            {/* ── STEP 3 ── */}
            {step === 3 && (
              <>
                <StepHeader num="03" title="Financiación y deudas" sub="¿Tienes actualmente alguna financiación o deuda pendiente?" />
                {errors.deudas && <ErrorMsg>{errors.deudas}</ErrorMsg>}

                <div style={{ display: "flex", gap: "0.75rem", marginBottom: "1.5rem" }}>
                  <ChoiceBtn active={tieneDeudas === "no"} onClick={() => { setTieneDeudas("no"); setErrors({}); }}>
                    ✕ No tengo deudas
                  </ChoiceBtn>
                  <ChoiceBtn active={tieneDeudas === "si"} onClick={() => { setTieneDeudas("si"); setErrors({}); }}>
                    ✓ Sí, tengo financiación
                  </ChoiceBtn>
                </div>

                {tieneDeudas === "si" && (
                  <div>
                    {deudas.map((d, i) => (
                      <div key={i} style={{ background: "var(--ivory)", borderRadius: "12px", padding: "1.2rem", marginBottom: "1rem", border: "1px solid var(--gray-light)", position: "relative" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
                          <span style={{ fontSize: "0.78rem", fontWeight: 600, color: "var(--copper)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                            Financiación {i + 1}
                          </span>
                          {deudas.length > 1 && (
                            <button onClick={() => removeDeuda(i)} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--gray-mid)", fontSize: "1.1rem" }}>✕</button>
                          )}
                        </div>
                        <Field label="Tipo de financiación">
                          <select value={d.tipo} onChange={e => updateDeuda(i, "tipo", e.target.value)} style={{ ...IS, cursor: "pointer" }}>
                            {TIPOS_DEUDA.map(t => <option key={t}>{t}</option>)}
                          </select>
                        </Field>
                        {d.tipo === "Otra financiación" && (
                          <Field label="¿Cuál?" error={errors[`deuda_custom_${i}`]}>
                            <input type="text" value={d.tipoCustom || ""} onChange={e => updateDeuda(i, "tipoCustom", e.target.value)} placeholder="Describe el tipo de financiación" style={IS} onFocus={focusStyle} onBlur={blurStyle} />
                          </Field>
                        )}
                        <Field label="Importe pendiente" error={errors[`deuda_importe_${i}`]}>
                          <div style={{ position: "relative" }}>
                            <input
                              type="text"
                              value={d.importe ? d.importe.toLocaleString("es-ES") : ""}
                              onChange={e => updateDeuda(i, "importe", parseCurrency(e.target.value))}
                              placeholder="0" style={{ ...IS, paddingRight: "3rem", textAlign: "right" }}
                              onFocus={focusStyle} onBlur={blurStyle}
                            />
                            <span style={{ position: "absolute", right: "1rem", top: "50%", transform: "translateY(-50%)", color: "var(--gray-mid)" }}>€</span>
                          </div>
                        </Field>
                        <Field label="Fecha estimada de finalización" error={errors[`deuda_fecha_${i}`]}>
                          <input type="month" value={d.fechaFin} onChange={e => updateDeuda(i, "fechaFin", e.target.value)} style={IS} onFocus={focusStyle} onBlur={blurStyle} />
                        </Field>
                      </div>
                    ))}
                    <button onClick={addDeuda} style={{ display: "flex", alignItems: "center", gap: "0.5rem", background: "none", border: "1.5px dashed var(--gray-light)", borderRadius: "10px", padding: "0.7rem 1.2rem", cursor: "pointer", color: "var(--green-mid)", fontSize: "0.875rem", fontWeight: 500, width: "100%", justifyContent: "center", fontFamily: "inherit" }}>
                      + Añadir otra financiación
                    </button>
                  </div>
                )}

                <StepActions onPrev={() => goPrev(3)} onNext={() => goNext(3)} />
              </>
            )}

            {/* ── STEP 4 ── */}
            {step === 4 && (
              <>
                <StepHeader num="04" title="Inversiones activas" sub="¿Tienes alguna inversión activa actualmente?" />
                {errors.inversiones && <ErrorMsg>{errors.inversiones}</ErrorMsg>}

                <div style={{ display: "flex", gap: "0.75rem", marginBottom: "1.5rem" }}>
                  <ChoiceBtn active={tieneInv === "no"} onClick={() => { setTieneInv("no"); setErrors({}); }}>
                    ✕ No tengo inversiones
                  </ChoiceBtn>
                  <ChoiceBtn active={tieneInv === "si"} onClick={() => { setTieneInv("si"); setErrors({}); }}>
                    ✓ Sí, tengo inversiones
                  </ChoiceBtn>
                </div>

                {tieneInv === "si" && (
                  <div>
                    {inversiones.map((inv, i) => (
                      <div key={i} style={{ background: "var(--ivory)", borderRadius: "12px", padding: "1.2rem", marginBottom: "1rem", border: "1px solid var(--gray-light)", position: "relative" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
                          <span style={{ fontSize: "0.78rem", fontWeight: 600, color: "var(--copper)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                            Inversión {i + 1}
                          </span>
                          {inversiones.length > 1 && (
                            <button onClick={() => removeInversion(i)} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--gray-mid)", fontSize: "1.1rem" }}>✕</button>
                          )}
                        </div>
                        <Field label="Producto de inversión">
                          <select value={inv.producto} onChange={e => updateInversion(i, "producto", e.target.value)} style={{ ...IS, cursor: "pointer" }}>
                            {TIPOS_INV.map(t => <option key={t}>{t}</option>)}
                          </select>
                        </Field>
                        {inv.producto === "Otro producto" && (
                          <Field label="¿Cuál?" error={errors[`inv_custom_${i}`]}>
                            <input type="text" value={inv.productoCustom || ""} onChange={e => updateInversion(i, "productoCustom", e.target.value)} placeholder="Describe el producto" style={IS} onFocus={focusStyle} onBlur={blurStyle} />
                          </Field>
                        )}
                        <Field label="Cantidad invertida" error={errors[`inv_cantidad_${i}`]}>
                          <div style={{ position: "relative" }}>
                            <input
                              type="text"
                              value={inv.cantidad ? inv.cantidad.toLocaleString("es-ES") : ""}
                              onChange={e => updateInversion(i, "cantidad", parseCurrency(e.target.value))}
                              placeholder="0" style={{ ...IS, paddingRight: "3rem", textAlign: "right" }}
                              onFocus={focusStyle} onBlur={blurStyle}
                            />
                            <span style={{ position: "absolute", right: "1rem", top: "50%", transform: "translateY(-50%)", color: "var(--gray-mid)" }}>€</span>
                          </div>
                        </Field>
                      </div>
                    ))}
                    <button onClick={addInversion} style={{ display: "flex", alignItems: "center", gap: "0.5rem", background: "none", border: "1.5px dashed var(--gray-light)", borderRadius: "10px", padding: "0.7rem 1.2rem", cursor: "pointer", color: "var(--green-mid)", fontSize: "0.875rem", fontWeight: 500, width: "100%", justifyContent: "center", fontFamily: "inherit" }}>
                      + Añadir otra inversión
                    </button>
                  </div>
                )}

                <StepActions onPrev={() => goPrev(4)} onNext={() => goNext(4)} />
              </>
            )}

            {/* ── STEP 5 ── */}
            {step === 5 && (
              <>
                <StepHeader num="05" title="Crea tu acceso" sub="Establece una contraseña segura para acceder a tu área personal." />
                <FieldGroup>
                  <Field label="Contraseña" error={errors.password}>
                    <div style={{ position: "relative" }}>
                      <input type={showPass ? "text" : "password"} value={password} onChange={e => setPassword(e.target.value)} placeholder="Mínimo 6 caracteres" style={{ ...IS, paddingRight: "3rem" }} onFocus={focusStyle} onBlur={blurStyle} />
                      <button onClick={() => setShowPass(!showPass)} type="button" style={{ position: "absolute", right: "1rem", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "var(--gray-mid)", fontSize: "1.1rem" }}>
                        {showPass ? "🙈" : "👁"}
                      </button>
                    </div>
                  </Field>
                  <Field label="Confirmar contraseña" error={errors.password2}>
                    <div style={{ position: "relative" }}>
                      <input type={showPass2 ? "text" : "password"} value={password2} onChange={e => setPassword2(e.target.value)} placeholder="Repite la contraseña" style={{ ...IS, paddingRight: "3rem" }} onFocus={focusStyle} onBlur={blurStyle} />
                      <button onClick={() => setShowPass2(!showPass2)} type="button" style={{ position: "absolute", right: "1rem", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "var(--gray-mid)", fontSize: "1.1rem" }}>
                        {showPass2 ? "🙈" : "👁"}
                      </button>
                    </div>
                  </Field>
                </FieldGroup>
                <StepActions onPrev={() => goPrev(5)} onNext={createProfile} nextLabel="Crear mi perfil ✦" />
              </>
            )}
          </div>

          <button onClick={onBack} style={{ display: "block", margin: "1rem auto 0", background: "none", border: "none", cursor: "pointer", color: "var(--gray-mid)", fontSize: "0.85rem", fontFamily: "inherit" }}>
            ← Volver al inicio
          </button>
        </div>
      </main>
    </div>
  );
}

// ─── Sub-components ───────────────────────────────────────────

function StepHeader({ num, title, sub }: { num: string; title: string; sub: string }) {
  return (
    <div style={{ marginBottom: "1.8rem" }}>
      <span style={{ display: "inline-block", fontSize: "0.7rem", fontWeight: 700, color: "var(--copper)", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: "0.5rem" }}>
        Paso {num}
      </span>
      <h2 style={{ fontFamily: "var(--font-cormorant)", fontSize: "1.8rem", fontWeight: 500, color: "var(--green-dark)", marginBottom: "0.4rem", lineHeight: 1.2 }}>{title}</h2>
      <p style={{ color: "var(--gray-mid)", fontSize: "0.9rem" }}>{sub}</p>
    </div>
  );
}

function FieldGroup({ children }: { children: React.ReactNode }) {
  return <div style={{ display: "flex", flexDirection: "column", gap: "1.2rem", marginBottom: "0.5rem" }}>{children}</div>;
}

function Field({ label, children, error, hint }: { label: string; children: React.ReactNode; error?: string; hint?: string }) {
  return (
    <div>
      <label style={{ display: "block", fontSize: "0.78rem", fontWeight: 600, color: "var(--anthracite)", marginBottom: "0.5rem", letterSpacing: "0.03em", textTransform: "uppercase" }}>
        {label}
      </label>
      {children}
      {hint && <p style={{ fontSize: "0.78rem", color: "var(--gray-mid)", marginTop: "0.4rem" }}>{hint}</p>}
      {error && <p style={{ fontSize: "0.78rem", color: "#DC2626", marginTop: "0.3rem" }}>⚠ {error}</p>}
    </div>
  );
}

function ChoiceBtn({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      style={{
        flex: 1, padding: "0.9rem 1rem", borderRadius: "10px", fontSize: "0.875rem", fontWeight: 500, cursor: "pointer", fontFamily: "inherit", transition: "all 0.2s",
        background: active ? "var(--green-dark)" : "var(--ivory)",
        color: active ? "#fff" : "var(--gray-mid)",
        border: active ? "2px solid var(--green-dark)" : "2px solid var(--gray-light)",
      }}
    >
      {children}
    </button>
  );
}

function StepActions({ onPrev, onNext, nextLabel = "Continuar →" }: { onPrev?: () => void; onNext?: () => void; nextLabel?: string }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "2rem", paddingTop: "1.5rem", borderTop: "1px solid var(--gray-light)" }}>
      {onPrev ? (
        <button onClick={onPrev} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--gray-mid)", fontSize: "0.875rem", fontFamily: "inherit", padding: "0.6rem 0" }}>
          ← Anterior
        </button>
      ) : <div />}
      {onNext && (
        <button onClick={onNext} style={{ background: "var(--green-dark)", color: "#fff", border: "none", borderRadius: "10px", padding: "0.8rem 1.8rem", fontSize: "0.9rem", fontWeight: 500, cursor: "pointer", fontFamily: "inherit", transition: "background 0.2s" }}
          onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = "var(--green-mid)"; }}
          onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = "var(--green-dark)"; }}
        >
          {nextLabel}
        </button>
      )}
    </div>
  );
}

function ErrorMsg({ children }: { children: React.ReactNode }) {
  return <div style={{ background: "#FFF3F0", border: "1px solid #FECACA", borderRadius: "8px", padding: "0.6rem 0.9rem", fontSize: "0.84rem", color: "#DC2626", marginBottom: "1rem" }}>{children}</div>;
}

const IS: React.CSSProperties = {
  width: "100%",
  padding: "0.875rem 1rem",
  border: "1.5px solid var(--gray-light)",
  borderRadius: "10px",
  fontSize: "0.95rem",
  color: "var(--anthracite)",
  background: "var(--ivory)",
  outline: "none",
  transition: "border-color 0.2s, box-shadow 0.2s",
  fontFamily: "inherit",
  appearance: "none" as const,
  WebkitAppearance: "none" as const,
};

function focusStyle(e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) {
  e.currentTarget.style.borderColor = "var(--green-mid)";
  e.currentTarget.style.boxShadow = "0 0 0 3px rgba(45,90,61,0.1)";
}

function blurStyle(e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) {
  e.currentTarget.style.borderColor = "var(--gray-light)";
  e.currentTarget.style.boxShadow = "none";
}
