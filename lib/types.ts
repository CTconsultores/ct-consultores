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

export interface UserProfile {
  username: string;
  passwordHash: string;
  nombre: string;
  fechaNac: string;
  profesion: string;
  ahorro: number;
  deudas: Deuda[];
  inversiones: Inversion[];
  createdAt: string;
}
