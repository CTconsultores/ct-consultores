"use client";

import { useState } from "react";
import Logo from "./Logo";
import type { Deuda, Inversion, Inmueble, Ingresos, Objetivos, OtraFuenteIngreso } from "@/lib/types";
import { generateUsername, hashPassword, saveUser, setSession } from "@/lib/storage";

interface Props {
  onComplete: (username: string) => void;
  onBack: () => void;
}

const TIPOS_DEUDA = ["Hipoteca", "Préstamo personal", "Préstamo de coche", "Tarjeta de crédito", "Otra financiación"];
const TIPOS_INV   = ["Fondo de inversión", "Fondo indexado", "Acciones", "ETF", "Plan de pensiones", "Depósito", "Cuenta remunerada", "Criptomonedas", "Otro producto"];
const TIPOS_INGRESO_EXTRA = ["Alquiler", "Dividendos", "Pensión", "Rendimiento de capital", "Negocio propio", "Freelance / Consultoría", "Otro"];

const OBJETIVOS_OPCIONES = [
  { id: "estudios_hijos",      label: "Estudios de mis hijos",          icon: "🎓" },
  { id: "jubilacion",          label: "Jubilación / Retiro anticipado", icon: "🏖️" },
  { id: "cambiar_coche",       label: "Cambiar de coche",               icon: "🚗" },
  { id: "entrada_casa",        label: "Entrada para una casa",          icon: "🏠" },
  { id: "fondo_emergencia",    label: "Fondo de emergencia",            icon: "🛡️" },
  { id: "viajes",              label: "Viajes y experiencias",          icon: "✈️" },
  { id: "independencia",       label: "Independencia financiera",       icon: "🎯" },
  { id: "negocio",             label: "Montar un negocio",              icon: "💼" },
  { id: "ahorro_largo_plazo",  label: "Ahorro a largo plazo",           icon: "📈" },
  { id: "herencia",            label: "Dejar herencia / patrimonio",    icon: "🏛️" },
  { id: "otro",                label: "Otro objetivo",                  icon: "✦"  },
];

const TOTAL_STEPS = 8;
const STEP_LABELS = ["Datos personales", "Ahorro", "Inmuebles", "Financiación", "Inversiones", "Ingresos", "Objetivos", "Acceso"];

function parseCurrency(val: string): number {
  return parseFloat(val.replace(/\./g, "").replace(",", ".")) || 0;
}
function fmtInput(val: string): string {
  const num = val.replace(/[^\d]/g, "");
  if (!num) return "";
  return parseInt(num, 10).toLocaleString("es-ES");
}

export default function OnboardingScreen({ onComplete, onBack }: Props) {
  const [step, setStep]         = useState(1);
  const [animating, setAnimating] = useState(false);

  // Step 1
  const [nombre,    setNombre]    = useState("");
  const [fechaNac,  setFechaNac]  = useState("");
  const [profesion, setProfesion] = useState("");

  // Step 2
  const [ahorro, setAhorro] = useState("");

  // Step 3 — Inmuebles
  const [tieneInmuebles, setTieneInmuebles] = useState<"si"|"no"|null>(null);
  const [inmuebles,      setInmuebles]      = useState<Inmueble[]>([emptyInmueble()]);

  // Step 4 — Deudas
  const [tieneDeudas, setTieneDeudas] = useState<"si"|"no"|null>(null);
  const [deudas,      setDeudas]      = useState<Deuda[]>([{ tipo: TIPOS_DEUDA[0], importe: 0, fechaFin: "" }]);

  // Step 5 — Inversiones
  const [tieneInv,    setTieneInv]    = useState<"si"|"no"|null>(null);
  const [inversiones, setInversiones] = useState<Inversion[]>([{ producto: TIPOS_INV[0], cantidad: 0 }]);

  // Step 6 — Ingresos
  const [tipoEmpleado,    setTipoEmpleado]    = useState<"empleado"|"autonomo"|"">("");
  const [ingresoMensual,  setIngresoMensual]  = useState("");
  const [tieneOtrosIngresos, setTieneOtrosIngresos] = useState<"si"|"no"|null>(null);
  const [otrasFuentes,    setOtrasFuentes]    = useState<OtraFuenteIngreso[]>([{ tipo: TIPOS_INGRESO_EXTRA[0], importe: 0 }]);

  // Step 7 — Objetivos
  const [objSeleccionados, setObjSeleccionados] = useState<string[]>([]);
  const [otroTexto,        setOtroTexto]        = useState("");

  // Step 8 — Password
  const [password,  setPassword]  = useState("");
  const [password2, setPassword2] = useState("");
  const [showPass,  setShowPass]  = useState(false);
  const [showPass2, setShowPass2] = useState(false);

  const [errors, setErrors] = useState<Record<string, string>>({});

  /* ─── Navigation ─── */
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

  /* ─── Validation ─── */
  function validate(n: number): Record<string, string> {
    const e: Record<string, string> = {};
    if (n === 1) {
      if (!nombre.trim())    e.nombre    = "Introduce tu nombre";
      if (!fechaNac)         e.fechaNac  = "Introduce tu fecha de nacimiento";
      if (!profesion.trim()) e.profesion = "Introduce tu profesión";
    }
    if (n === 2) {
      if (!ahorro) e.ahorro = "Introduce tu ahorro actual";
    }
    if (n === 3) {
      if (tieneInmuebles === null) e.inmuebles = "Selecciona una opción";
      if (tieneInmuebles === "si") {
        inmuebles.forEach((im, i) => {
          if (!im.nombre.trim()) e[`im_nombre_${i}`] = "Introduce el nombre del inmueble";
          if (!im.valor)         e[`im_valor_${i}`]  = "Introduce el valor aproximado";
          if (im.tieneHipoteca) {
            if (!im.hipotecaPendiente) e[`im_hpend_${i}`]  = "Introduce el importe pendiente";
            if (!im.hipotecaCuota)     e[`im_hcuota_${i}`] = "Introduce la cuota mensual";
            if (!im.hipotecaInteres)   e[`im_hint_${i}`]   = "Introduce el tipo de interés";
          }
        });
      }
    }
    if (n === 4) {
      if (tieneDeudas === null) e.deudas = "Selecciona una opción";
      if (tieneDeudas === "si") {
        deudas.forEach((d, i) => {
          if (!d.importe)  e[`deuda_importe_${i}`] = "Introduce el importe";
          if (!d.fechaFin) e[`deuda_fecha_${i}`]   = "Introduce la fecha de finalización";
          if (d.tipo === "Otra financiación" && !d.tipoCustom?.trim()) e[`deuda_custom_${i}`] = "Describe el tipo";
        });
      }
    }
    if (n === 5) {
      if (tieneInv === null) e.inversiones = "Selecciona una opción";
      if (tieneInv === "si") {
        inversiones.forEach((inv, i) => {
          if (!inv.cantidad) e[`inv_cantidad_${i}`] = "Introduce la cantidad";
          if (inv.producto === "Otro producto" && !inv.productoCustom?.trim()) e[`inv_custom_${i}`] = "Describe el producto";
        });
      }
    }
    if (n === 6) {
      if (!tipoEmpleado)    e.tipoEmpleado   = "Indica tu situación laboral";
      if (!ingresoMensual)  e.ingresoMensual = "Introduce tu ingreso mensual";
      if (tieneOtrosIngresos === null) e.otrosIngresos = "Selecciona una opción";
      if (tieneOtrosIngresos === "si") {
        otrasFuentes.forEach((f, i) => {
          if (!f.importe) e[`fuente_imp_${i}`] = "Introduce el importe";
          if (f.tipo === "Otro" && !f.tipoCustom?.trim()) e[`fuente_custom_${i}`] = "Describe la fuente";
        });
      }
    }
    if (n === 7) {
      if (objSeleccionados.length === 0) e.objetivos = "Selecciona al menos un objetivo";
      if (objSeleccionados.includes("otro") && !otroTexto.trim()) e.otroTexto = "Describe tu objetivo";
    }
    if (n === 8) {
      if (password.length < 6)   e.password  = "La contraseña debe tener al menos 6 caracteres";
      if (password !== password2) e.password2 = "Las contraseñas no coinciden";
    }
    return e;
  }

  /* ─── Create profile ─── */
  function createProfile() {
    const errs = validate(8);
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    const username = generateUsername(nombre);
    const ingresos: Ingresos = {
      tipoEmpleado,
      ingresoMensual: parseCurrency(ingresoMensual),
      otrasFuentes: tieneOtrosIngresos === "si" ? otrasFuentes : [],
    };
    const objetivos: Objetivos = {
      seleccionados: objSeleccionados,
      otroTexto: objSeleccionados.includes("otro") ? otroTexto : undefined,
    };
    saveUser({
      username,
      passwordHash: hashPassword(password),
      nombre: nombre.trim(),
      fechaNac,
      profesion: profesion.trim(),
      ahorro: parseCurrency(ahorro),
      inmuebles: tieneInmuebles === "si" ? inmuebles : [],
      deudas: tieneDeudas === "si" ? deudas : [],
      inversiones: tieneInv === "si" ? inversiones : [],
      ingresos,
      objetivos,
      createdAt: new Date().toISOString(),
    });
    setSession(username);
    onComplete(username);
  }

  /* ─── Handlers ─── */
  function updInmueble(i: number, field: keyof Inmueble, val: string|number|boolean) {
    setInmuebles(prev => prev.map((im, idx) => idx === i ? { ...im, [field]: val } : im));
  }
  function updDeuda(i: number, field: keyof Deuda, val: string|number) {
    setDeudas(prev => prev.map((d, idx) => idx === i ? { ...d, [field]: val } : d));
  }
  function updInversion(i: number, field: keyof Inversion, val: string|number) {
    setInversiones(prev => prev.map((inv, idx) => idx === i ? { ...inv, [field]: val } : inv));
  }
  function updFuente(i: number, field: keyof OtraFuenteIngreso, val: string|number) {
    setOtrasFuentes(prev => prev.map((f, idx) => idx === i ? { ...f, [field]: val } : f));
  }
  function toggleObjetivo(id: string) {
    setObjSeleccionados(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  }

  /* ─── Render ─── */
  return (
    <div style={{ minHeight: "100vh", width: "100%", display: "flex" }}>

      {/* SIDEBAR */}
      <aside style={{ display: "flex", flexDirection: "column", width: 260, flexShrink: 0, padding: "2.5rem 2rem", background: "var(--green-dark)", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", bottom: 0, right: 0, width: 200, height: 200, borderRadius: "50%", background: "radial-gradient(circle, rgba(200,118,58,0.15), transparent 70%)", transform: "translate(30%,30%)" }} />
        <div style={{ marginBottom: "2.5rem", display: "flex", justifyContent: "center" }}>
          <Logo size="sm" />
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "0.15rem", flex: 1 }}>
          {STEP_LABELS.map((label, idx) => {
            const n = idx + 1;
            const done = step > n; const active = step === n;
            return (
              <div key={n} style={{ display: "flex", alignItems: "center", gap: "0.75rem", padding: "0.5rem 0" }}>
                <div style={{ width: 26, height: 26, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.68rem", fontWeight: 700, flexShrink: 0, transition: "all 0.3s", background: done ? "#c8763a" : active ? "#fff" : "rgba(255,255,255,0.1)", color: done ? "#fff" : active ? "var(--green-dark)" : "rgba(255,255,255,0.35)" }}>
                  {done ? "✓" : n}
                </div>
                <span style={{ fontSize: "0.8rem", transition: "color 0.3s", fontWeight: active ? 600 : 400, color: active ? "#fff" : done ? "rgba(255,255,255,0.6)" : "rgba(255,255,255,0.3)" }}>
                  {label}
                </span>
              </div>
            );
          })}
        </div>
        <p style={{ color: "rgba(255,255,255,0.3)", fontSize: "0.7rem", lineHeight: 1.7, fontStyle: "italic", borderTop: "1px solid rgba(255,255,255,0.1)", paddingTop: "1.25rem", position: "relative", zIndex: 1 }}>
          "Vamos a construir una primera imagen de tu situación financiera."
        </p>
      </aside>

      {/* MAIN */}
      <main style={{ flex: 1, display: "flex", alignItems: "flex-start", justifyContent: "center", padding: "3rem 2rem", overflowY: "auto" }}>
        <div style={{ width: "100%", maxWidth: 580 }}>
          <div style={{ background: "#fff", borderRadius: "20px", padding: "2.5rem", boxShadow: "0 4px 40px rgba(26,58,42,0.09)", border: "1px solid var(--gray-light)", opacity: animating ? 0 : 1, transform: animating ? "translateY(8px)" : "translateY(0)", transition: "opacity 0.25s, transform 0.25s" }}>

            {/* ── STEP 1 ── */}
            {step === 1 && <>
              <SH num="01" title="Datos personales" sub="Empecemos por conocerte un poco mejor." />
              <FG>
                <F label="¿Cómo te llamas?" error={errors.nombre}>
                  <input type="text" value={nombre} onChange={e => setNombre(e.target.value)} placeholder="Tu nombre completo" style={IS} onFocus={oF} onBlur={oB} />
                </F>
                <F label="Fecha de nacimiento" error={errors.fechaNac}>
                  <input type="date" value={fechaNac} onChange={e => setFechaNac(e.target.value)} style={IS} onFocus={oF} onBlur={oB} max={new Date().toISOString().split("T")[0]} />
                </F>
                <F label="¿A qué te dedicas?" error={errors.profesion}>
                  <input type="text" value={profesion} onChange={e => setProfesion(e.target.value)} placeholder="Tu profesión o actividad" style={IS} onFocus={oF} onBlur={oB} />
                </F>
              </FG>
              <SA onNext={() => goNext(1)} />
            </>}

            {/* ── STEP 2 ── */}
            {step === 2 && <>
              <SH num="02" title="Situación de ahorro" sub="¿Cuál es tu ahorro actual disponible?" />
              <FG>
                <F label="Ahorro actual disponible" error={errors.ahorro} hint="Incluye cuentas corrientes, cuentas de ahorro y efectivo disponible.">
                  <CI value={ahorro} onChange={setAhorro} />
                </F>
              </FG>
              <SA onPrev={() => goPrev(2)} onNext={() => goNext(2)} />
            </>}

            {/* ── STEP 3: Inmuebles ── */}
            {step === 3 && <>
              <SH num="03" title="Patrimonio inmobiliario" sub="¿Tiene usted algún inmueble en propiedad?" />
              {errors.inmuebles && <EM>{errors.inmuebles}</EM>}
              <CR>
                <CB active={tieneInmuebles==="no"} onClick={() => { setTieneInmuebles("no"); setErrors({}); }}>No, no tengo inmuebles</CB>
                <CB active={tieneInmuebles==="si"} onClick={() => { setTieneInmuebles("si"); setErrors({}); }}>Sí, tengo inmuebles</CB>
              </CR>
              {tieneInmuebles === "si" && <div style={{ marginTop: "1.25rem" }}>
                {inmuebles.map((im, i) => (
                  <InmuebleCard key={i} index={i} inmueble={im} errors={errors} canRemove={inmuebles.length > 1} onRemove={() => setInmuebles(p => p.filter((_,j)=>j!==i))} onChange={(f,v) => updInmueble(i,f,v)} />
                ))}
                <AB onClick={() => setInmuebles(p => [...p, emptyInmueble()])}>+ Añadir otro inmueble</AB>
              </div>}
              <SA onPrev={() => goPrev(3)} onNext={() => goNext(3)} />
            </>}

            {/* ── STEP 4: Otras financiaciones ── */}
            {step === 4 && <>
              <SH num="04" title="Otras financiaciones" sub="¿Tienes alguna otra financiación o deuda pendiente?" />
              {errors.deudas && <EM>{errors.deudas}</EM>}
              <CR>
                <CB active={tieneDeudas==="no"} onClick={() => { setTieneDeudas("no"); setErrors({}); }}>No tengo otras deudas</CB>
                <CB active={tieneDeudas==="si"} onClick={() => { setTieneDeudas("si"); setErrors({}); }}>Sí, tengo financiación</CB>
              </CR>
              {tieneDeudas === "si" && <div style={{ marginTop: "1.25rem" }}>
                {deudas.map((d, i) => (
                  <SC key={i} label={`Financiación ${i+1}`} canRemove={deudas.length>1} onRemove={() => setDeudas(p => p.filter((_,j)=>j!==i))}>
                    <F label="Tipo de financiación">
                      <select value={d.tipo} onChange={e => updDeuda(i,"tipo",e.target.value)} style={{...IS,cursor:"pointer"}} onFocus={oF} onBlur={oB}>
                        {TIPOS_DEUDA.map(t=><option key={t}>{t}</option>)}
                      </select>
                    </F>
                    {d.tipo==="Otra financiación" && <F label="¿Cuál?" error={errors[`deuda_custom_${i}`]}><input type="text" value={d.tipoCustom||""} onChange={e=>updDeuda(i,"tipoCustom",e.target.value)} placeholder="Describe el tipo" style={IS} onFocus={oF} onBlur={oB}/></F>}
                    <TC>
                      <F label="Importe pendiente" error={errors[`deuda_importe_${i}`]}><CI value={d.importe?d.importe.toLocaleString("es-ES"):""} onChange={v=>updDeuda(i,"importe",parseCurrency(v))}/></F>
                      <F label="Fecha finalización" error={errors[`deuda_fecha_${i}`]}><input type="month" value={d.fechaFin} onChange={e=>updDeuda(i,"fechaFin",e.target.value)} style={IS} onFocus={oF} onBlur={oB}/></F>
                    </TC>
                  </SC>
                ))}
                <AB onClick={()=>setDeudas(p=>[...p,{tipo:TIPOS_DEUDA[0],importe:0,fechaFin:""}])}>+ Añadir otra financiación</AB>
              </div>}
              <SA onPrev={() => goPrev(4)} onNext={() => goNext(4)} />
            </>}

            {/* ── STEP 5: Inversiones ── */}
            {step === 5 && <>
              <SH num="05" title="Inversiones activas" sub="¿Tienes alguna inversión activa actualmente?" />
              {errors.inversiones && <EM>{errors.inversiones}</EM>}
              <CR>
                <CB active={tieneInv==="no"} onClick={() => { setTieneInv("no"); setErrors({}); }}>No tengo inversiones</CB>
                <CB active={tieneInv==="si"} onClick={() => { setTieneInv("si"); setErrors({}); }}>Sí, tengo inversiones</CB>
              </CR>
              {tieneInv === "si" && <div style={{ marginTop: "1.25rem" }}>
                {inversiones.map((inv, i) => (
                  <SC key={i} label={`Inversión ${i+1}`} canRemove={inversiones.length>1} onRemove={() => setInversiones(p=>p.filter((_,j)=>j!==i))}>
                    <F label="Producto de inversión">
                      <select value={inv.producto} onChange={e=>updInversion(i,"producto",e.target.value)} style={{...IS,cursor:"pointer"}} onFocus={oF} onBlur={oB}>
                        {TIPOS_INV.map(t=><option key={t}>{t}</option>)}
                      </select>
                    </F>
                    {inv.producto==="Otro producto" && <F label="¿Cuál?" error={errors[`inv_custom_${i}`]}><input type="text" value={inv.productoCustom||""} onChange={e=>updInversion(i,"productoCustom",e.target.value)} placeholder="Describe el producto" style={IS} onFocus={oF} onBlur={oB}/></F>}
                    <F label="Cantidad invertida" error={errors[`inv_cantidad_${i}`]}><CI value={inv.cantidad?inv.cantidad.toLocaleString("es-ES"):""} onChange={v=>updInversion(i,"cantidad",parseCurrency(v))}/></F>
                  </SC>
                ))}
                <AB onClick={()=>setInversiones(p=>[...p,{producto:TIPOS_INV[0],cantidad:0}])}>+ Añadir otra inversión</AB>
              </div>}
              <SA onPrev={() => goPrev(5)} onNext={() => goNext(5)} />
            </>}

            {/* ── STEP 6: Ingresos ── */}
            {step === 6 && <>
              <SH num="06" title="Fuentes de ingresos" sub="Cuéntanos sobre tus ingresos para completar tu perfil financiero." />

              {/* Tipo de empleado */}
              <F label="Situación laboral" error={errors.tipoEmpleado}>
                <div style={{ display: "flex", gap: "0.75rem", marginTop: "0.25rem" }}>
                  <CB active={tipoEmpleado==="empleado"} onClick={() => { setTipoEmpleado("empleado"); setErrors({}); }}>Empleado por cuenta ajena</CB>
                  <CB active={tipoEmpleado==="autonomo"} onClick={() => { setTipoEmpleado("autonomo"); setErrors({}); }}>Autónomo / Empresario</CB>
                </div>
              </F>

              {tipoEmpleado !== "" && <div style={{ marginTop: "1.25rem" }}>
                <F label={tipoEmpleado === "empleado" ? "Nómina neta mensual" : "Ingresos mensuales aproximados"} error={errors.ingresoMensual} hint={tipoEmpleado === "autonomo" ? "Indica el promedio mensual de los últimos 12 meses." : undefined}>
                  <CI value={ingresoMensual} onChange={setIngresoMensual} />
                </F>
              </div>}

              {tipoEmpleado !== "" && <>
                <div style={{ marginTop: "1.5rem", marginBottom: "0.5rem" }}>
                  <label style={LS}>¿Tienes otras fuentes de ingresos?</label>
                  <p style={{ fontSize: "0.76rem", color: "var(--gray-mid)", marginBottom: "0.5rem" }}>Alquileres, dividendos, pensiones, rendimiento de capital…</p>
                  {errors.otrosIngresos && <p style={{ fontSize: "0.76rem", color: "#DC2626", marginBottom: "0.5rem" }}>⚠ {errors.otrosIngresos}</p>}
                  <div style={{ display: "flex", gap: "0.75rem" }}>
                    <CB active={tieneOtrosIngresos==="no"} onClick={() => { setTieneOtrosIngresos("no"); setErrors({}); }}>No, solo los anteriores</CB>
                    <CB active={tieneOtrosIngresos==="si"} onClick={() => { setTieneOtrosIngresos("si"); setErrors({}); }}>Sí, tengo otras fuentes</CB>
                  </div>
                </div>

                {tieneOtrosIngresos === "si" && <div style={{ marginTop: "1rem" }}>
                  {otrasFuentes.map((f, i) => (
                    <SC key={i} label={`Fuente ${i+1}`} canRemove={otrasFuentes.length>1} onRemove={() => setOtrasFuentes(p=>p.filter((_,j)=>j!==i))}>
                      <TC>
                        <F label="Tipo de ingreso">
                          <select value={f.tipo} onChange={e=>updFuente(i,"tipo",e.target.value)} style={{...IS,cursor:"pointer"}} onFocus={oF} onBlur={oB}>
                            {TIPOS_INGRESO_EXTRA.map(t=><option key={t}>{t}</option>)}
                          </select>
                        </F>
                        <F label="Importe mensual" error={errors[`fuente_imp_${i}`]}>
                          <CI value={f.importe?f.importe.toLocaleString("es-ES"):""} onChange={v=>updFuente(i,"importe",parseCurrency(v))}/>
                        </F>
                      </TC>
                      {f.tipo==="Otro" && <F label="Describe la fuente" error={errors[`fuente_custom_${i}`]}><input type="text" value={f.tipoCustom||""} onChange={e=>updFuente(i,"tipoCustom",e.target.value)} placeholder="Ej: Royalties, renta vitalicia…" style={IS} onFocus={oF} onBlur={oB}/></F>}
                    </SC>
                  ))}
                  <AB onClick={()=>setOtrasFuentes(p=>[...p,{tipo:TIPOS_INGRESO_EXTRA[0],importe:0}])}>+ Añadir otra fuente de ingreso</AB>
                </div>}
              </>}

              <SA onPrev={() => goPrev(6)} onNext={() => goNext(6)} />
            </>}

            {/* ── STEP 7: Objetivos ── */}
            {step === 7 && <>
              <SH num="07" title="Objetivos financieros" sub="¿Cuáles son tus principales metas financieras? Puedes elegir varias." />
              {errors.objetivos && <EM>{errors.objetivos}</EM>}

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.6rem", marginBottom: "1rem" }}>
                {OBJETIVOS_OPCIONES.map(obj => {
                  const selected = objSeleccionados.includes(obj.id);
                  return (
                    <button
                      key={obj.id}
                      onClick={() => toggleObjetivo(obj.id)}
                      style={{
                        display: "flex", alignItems: "center", gap: "0.6rem",
                        padding: "0.8rem 1rem", borderRadius: "10px", cursor: "pointer",
                        fontFamily: "inherit", fontSize: "0.84rem", fontWeight: 500,
                        textAlign: "left", transition: "all 0.15s",
                        background: selected ? "var(--green-dark)" : "var(--ivory)",
                        color: selected ? "#fff" : "var(--anthracite)",
                        border: selected ? "2px solid var(--green-dark)" : "2px solid var(--gray-light)",
                      }}
                    >
                      <span style={{ fontSize: "1rem", flexShrink: 0 }}>{obj.icon}</span>
                      <span>{obj.label}</span>
                    </button>
                  );
                })}
              </div>

              {objSeleccionados.includes("otro") && (
                <F label="Describe tu objetivo" error={errors.otroTexto}>
                  <input type="text" value={otroTexto} onChange={e => setOtroTexto(e.target.value)} placeholder="Ej: Comprar un velero, financiar una startup…" style={IS} onFocus={oF} onBlur={oB} />
                </F>
              )}

              <SA onPrev={() => goPrev(7)} onNext={() => goNext(7)} />
            </>}

            {/* ── STEP 8: Acceso ── */}
            {step === 8 && <>
              <SH num="08" title="Crea tu acceso" sub="Establece una contraseña segura para acceder a tu área personal." />
              <FG>
                <F label="Contraseña" error={errors.password}>
                  <PI value={password} onChange={setPassword} show={showPass} onToggle={() => setShowPass(p=>!p)} placeholder="Mínimo 6 caracteres" />
                </F>
                <F label="Confirmar contraseña" error={errors.password2}>
                  <PI value={password2} onChange={setPassword2} show={showPass2} onToggle={() => setShowPass2(p=>!p)} placeholder="Repite la contraseña" />
                </F>
              </FG>
              <SA onPrev={() => goPrev(8)} onNext={createProfile} nextLabel="Crear mi perfil ✦" />
            </>}

          </div>
          <button onClick={onBack} style={{ display: "block", margin: "1rem auto 0", background: "none", border: "none", cursor: "pointer", color: "var(--gray-mid)", fontSize: "0.85rem", fontFamily: "inherit" }}>
            ← Volver al inicio
          </button>
        </div>
      </main>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   InmuebleCard
═══════════════════════════════════════════════════════════ */
interface InmuebleCardProps {
  index: number; inmueble: Inmueble; errors: Record<string,string>;
  canRemove: boolean; onRemove: () => void;
  onChange: (field: keyof Inmueble, val: string|number|boolean) => void;
}
function InmuebleCard({ index: i, inmueble: im, errors, canRemove, onRemove, onChange }: InmuebleCardProps) {
  return (
    <div style={{ background: "var(--ivory)", borderRadius: "14px", padding: "1.4rem", marginBottom: "1rem", border: "1px solid var(--gray-light)" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.2rem" }}>
        <span style={{ fontSize: "0.72rem", fontWeight: 700, color: "var(--copper)", textTransform: "uppercase", letterSpacing: "0.06em" }}>Inmueble {i+1}</span>
        {canRemove && <button onClick={onRemove} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--gray-mid)", fontSize: "1rem", padding: "0.2rem 0.4rem" }}>✕</button>}
      </div>
      <TC>
        <F label="Nombre del inmueble" error={errors[`im_nombre_${i}`]}>
          <input type="text" value={im.nombre} onChange={e=>onChange("nombre",e.target.value)} placeholder="Ej: Piso en Madrid" style={IS} onFocus={oF} onBlur={oB}/>
        </F>
        <F label="Valor aproximado" error={errors[`im_valor_${i}`]}>
          <CI value={im.valor?im.valor.toLocaleString("es-ES"):""} onChange={v=>onChange("valor",parseCurrency(v))}/>
        </F>
      </TC>
      <div style={{ marginTop: "1rem" }}>
        <label style={LS}>¿Tiene hipoteca sobre este inmueble?</label>
        <div style={{ display: "flex", gap: "0.6rem", marginTop: "0.5rem" }}>
          <CB active={im.tieneHipoteca===false} onClick={()=>onChange("tieneHipoteca",false)} small>No</CB>
          <CB active={im.tieneHipoteca===true}  onClick={()=>onChange("tieneHipoteca",true)}  small>Sí, tiene hipoteca</CB>
        </div>
      </div>
      {im.tieneHipoteca && (
        <div style={{ marginTop: "1.2rem", paddingTop: "1.2rem", borderTop: "1px dashed var(--gray-light)" }}>
          <p style={{ fontSize: "0.72rem", fontWeight: 700, color: "var(--green-mid)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "0.9rem" }}>Datos de la hipoteca</p>
          <TC>
            <F label="Importe pendiente" error={errors[`im_hpend_${i}`]}><CI value={im.hipotecaPendiente?im.hipotecaPendiente.toLocaleString("es-ES"):""} onChange={v=>onChange("hipotecaPendiente",parseCurrency(v))}/></F>
            <F label="Cuota mensual"     error={errors[`im_hcuota_${i}`]}><CI value={im.hipotecaCuota?im.hipotecaCuota.toLocaleString("es-ES"):""}       onChange={v=>onChange("hipotecaCuota",parseCurrency(v))}/></F>
          </TC>
          <div style={{ marginTop: "1rem" }}>
            <label style={LS}>Tipo de hipoteca</label>
            <div style={{ display: "flex", gap: "0.6rem", marginTop: "0.5rem" }}>
              <CB active={im.hipotecaTipo==="fija"}     onClick={()=>onChange("hipotecaTipo","fija")}     small>Fija</CB>
              <CB active={im.hipotecaTipo==="variable"} onClick={()=>onChange("hipotecaTipo","variable")} small>Variable</CB>
            </div>
          </div>
          <div style={{ marginTop: "1rem" }}>
            <F label="Tipo de interés (%)" error={errors[`im_hint_${i}`]}>
              <div style={{ position: "relative" }}>
                <input type="number" step="0.01" min="0" max="20" value={im.hipotecaInteres??""} onChange={e=>onChange("hipotecaInteres",parseFloat(e.target.value)||0)} placeholder="Ej: 3.25" style={{...IS,paddingRight:"3rem"}} onFocus={oF} onBlur={oB}/>
                <span style={{ position: "absolute", right: "1rem", top: "50%", transform: "translateY(-50%)", color: "var(--gray-mid)", fontWeight: 500 }}>%</span>
              </div>
            </F>
          </div>
        </div>
      )}
    </div>
  );
}

function emptyInmueble(): Inmueble { return { nombre: "", valor: 0, tieneHipoteca: false }; }

/* ═══════════════════════════════════════════════════════════
   Shared sub-components
═══════════════════════════════════════════════════════════ */
function SH({ num, title, sub }: { num:string; title:string; sub:string }) {
  return (
    <div style={{ marginBottom: "1.8rem" }}>
      <span style={{ display: "inline-block", fontSize: "0.67rem", fontWeight: 700, color: "var(--copper)", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: "0.5rem" }}>
        Paso {num} / 0{TOTAL_STEPS}
      </span>
      <h2 style={{ fontFamily: "var(--font-cormorant)", fontSize: "1.75rem", fontWeight: 500, color: "var(--green-dark)", marginBottom: "0.4rem", lineHeight: 1.2 }}>{title}</h2>
      <p style={{ color: "var(--gray-mid)", fontSize: "0.88rem" }}>{sub}</p>
    </div>
  );
}
function FG({ children }: { children: React.ReactNode }) {
  return <div style={{ display: "flex", flexDirection: "column", gap: "1.2rem", marginBottom: "0.5rem" }}>{children}</div>;
}
function F({ label, children, error, hint }: { label:string; children:React.ReactNode; error?:string; hint?:string }) {
  return (
    <div>
      <label style={LS}>{label}</label>
      {children}
      {hint  && <p style={{ fontSize:"0.76rem", color:"var(--gray-mid)", marginTop:"0.35rem" }}>{hint}</p>}
      {error && <p style={{ fontSize:"0.76rem", color:"#DC2626", marginTop:"0.3rem" }}>⚠ {error}</p>}
    </div>
  );
}
function TC({ children }: { children: React.ReactNode }) {
  return <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"0.9rem" }}>{children}</div>;
}
function CR({ children }: { children: React.ReactNode }) {
  return <div style={{ display:"flex", gap:"0.75rem", marginBottom:"0.5rem" }}>{children}</div>;
}
function CB({ active, onClick, children, small }: { active:boolean; onClick:()=>void; children:React.ReactNode; small?:boolean }) {
  return (
    <button onClick={onClick} style={{ flex:1, padding: small?"0.6rem 0.75rem":"0.875rem 1rem", borderRadius:"10px", fontSize: small?"0.82rem":"0.875rem", fontWeight:500, cursor:"pointer", fontFamily:"inherit", transition:"all 0.2s", background: active?"var(--green-dark)":"var(--ivory)", color: active?"#fff":"var(--gray-mid)", border: active?"2px solid var(--green-dark)":"2px solid var(--gray-light)" }}>
      {children}
    </button>
  );
}
function SC({ label, children, canRemove, onRemove }: { label:string; children:React.ReactNode; canRemove:boolean; onRemove:()=>void }) {
  return (
    <div style={{ background:"var(--ivory)", borderRadius:"14px", padding:"1.2rem", marginBottom:"1rem", border:"1px solid var(--gray-light)" }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"1rem" }}>
        <span style={{ fontSize:"0.72rem", fontWeight:700, color:"var(--copper)", textTransform:"uppercase", letterSpacing:"0.06em" }}>{label}</span>
        {canRemove && <button onClick={onRemove} style={{ background:"none", border:"none", cursor:"pointer", color:"var(--gray-mid)", fontSize:"1rem" }}>✕</button>}
      </div>
      <div style={{ display:"flex", flexDirection:"column", gap:"0.9rem" }}>{children}</div>
    </div>
  );
}
function CI({ value, onChange }: { value:string; onChange:(v:string)=>void }) {
  return (
    <div style={{ position:"relative" }}>
      <input type="text" value={value} onChange={e=>onChange(fmtInput(e.target.value))} placeholder="0" style={{...IS,paddingRight:"3rem",textAlign:"right"}} onFocus={oF} onBlur={oB}/>
      <span style={{ position:"absolute", right:"1rem", top:"50%", transform:"translateY(-50%)", color:"var(--gray-mid)", fontWeight:500 }}>€</span>
    </div>
  );
}
function PI({ value, onChange, show, onToggle, placeholder }: { value:string; onChange:(v:string)=>void; show:boolean; onToggle:()=>void; placeholder:string }) {
  return (
    <div style={{ position:"relative" }}>
      <input type={show?"text":"password"} value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder} style={{...IS,paddingRight:"3rem"}} onFocus={oF} onBlur={oB}/>
      <button onClick={onToggle} type="button" style={{ position:"absolute", right:"1rem", top:"50%", transform:"translateY(-50%)", background:"none", border:"none", cursor:"pointer", color:"var(--gray-mid)", fontSize:"1rem" }}>
        {show?"🙈":"👁"}
      </button>
    </div>
  );
}
function AB({ onClick, children }: { onClick:()=>void; children:React.ReactNode }) {
  return (
    <button onClick={onClick} style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:"0.5rem", width:"100%", padding:"0.7rem", background:"none", border:"1.5px dashed var(--gray-light)", borderRadius:"10px", cursor:"pointer", color:"var(--green-mid)", fontSize:"0.875rem", fontWeight:500, fontFamily:"inherit", marginBottom:"0.5rem" }}>
      {children}
    </button>
  );
}
function SA({ onPrev, onNext, nextLabel="Continuar →" }: { onPrev?:()=>void; onNext?:()=>void; nextLabel?:string }) {
  return (
    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginTop:"2rem", paddingTop:"1.5rem", borderTop:"1px solid var(--gray-light)" }}>
      {onPrev ? <button onClick={onPrev} style={{ background:"none", border:"none", cursor:"pointer", color:"var(--gray-mid)", fontSize:"0.875rem", fontFamily:"inherit" }}>← Anterior</button> : <div/>}
      {onNext && <button onClick={onNext} style={{ background:"var(--green-dark)", color:"#fff", border:"none", borderRadius:"10px", padding:"0.8rem 1.8rem", fontSize:"0.9rem", fontWeight:500, cursor:"pointer", fontFamily:"inherit" }} onMouseEnter={e=>{(e.currentTarget as HTMLButtonElement).style.background="var(--green-mid)";}} onMouseLeave={e=>{(e.currentTarget as HTMLButtonElement).style.background="var(--green-dark)";}}>
        {nextLabel}
      </button>}
    </div>
  );
}
function EM({ children }: { children:React.ReactNode }) {
  return <div style={{ background:"#FFF3F0", border:"1px solid #FECACA", borderRadius:"8px", padding:"0.6rem 0.9rem", fontSize:"0.83rem", color:"#DC2626", marginBottom:"1rem" }}>{children}</div>;
}

const IS: React.CSSProperties = { width:"100%", padding:"0.875rem 1rem", border:"1.5px solid var(--gray-light)", borderRadius:"10px", fontSize:"0.92rem", color:"var(--anthracite)", background:"#fff", outline:"none", transition:"border-color 0.2s, box-shadow 0.2s", fontFamily:"inherit" };
const LS: React.CSSProperties = { display:"block", fontSize:"0.74rem", fontWeight:600, color:"var(--anthracite)", marginBottom:"0.45rem", letterSpacing:"0.04em", textTransform:"uppercase" };
function oF(e: React.FocusEvent<HTMLInputElement|HTMLSelectElement>) { e.currentTarget.style.borderColor="var(--green-mid)"; e.currentTarget.style.boxShadow="0 0 0 3px rgba(45,90,61,0.1)"; }
function oB(e: React.FocusEvent<HTMLInputElement|HTMLSelectElement>) { e.currentTarget.style.borderColor="var(--gray-light)"; e.currentTarget.style.boxShadow="none"; }
