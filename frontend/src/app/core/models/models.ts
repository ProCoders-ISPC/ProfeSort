// Interfaces para los modelos de datos

export interface Docente {
  id: number;
  name: string;
  email: string;
  legajo: string;
  estado: string;
}

export interface User {
  id: number;
  email: string;
  name: string;
  role: 'student' | 'admin' | 'teacher';
  isLoggedIn: boolean;
}
