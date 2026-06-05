export interface Deuda {
  tipo: string;
  tipoCustom?: string;
  importe: number;
  fechaFin: string;
}

export interface Inversion {
  producto: string;
  productoCustom?: string;
  cantidad: number;
}

export interface Inmueble {
  nombre: string;
  valor: number;
  tieneHipoteca: boolean;
  hipotecaPendiente?: number;
  hipotecaCuota?: number;
  hipotecaTipo?: "fija" | "variable";
  hipotecaInteres?: number;
}

export type TipoEmpleado = "empleado" | "autonomo" | "";

export interface OtraFuenteIngreso {
  tipo: string;
  tipoCustom?: string;
  importe: number;
}

export interface Ingresos {
  tipoEmpleado: TipoEmpleado;
  ingresoMensual: number;
  otrasFuentes: OtraFuenteIngreso[];
}

export interface Objetivos {
  seleccionados: string[];
  otroTexto?: string;
}

export interface UserProfile {
  username: string;
  passwordHash: string;
  nombre: string;
  fechaNac: string;
  profesion: string;
  ahorro: number;
  inmuebles: Inmueble[];
  deudas: Deuda[];
  inversiones: Inversion[];
  ingresos: Ingresos;
  objetivos: Objetivos;
  createdAt: string;
}
