export type Rol = "admin" | "socio";

export function esAdmin(rol: string | null | undefined): boolean {
  return rol === "admin";
}

export function esSocio(rol: string | null | undefined): boolean {
  return rol === "socio";
}

export function rutaInicio(rol: string | null | undefined): string {
  return esAdmin(rol) ? "/admin" : "/mi";
}

export function etiquetaRol(rol: string | null | undefined): string {
  return esAdmin(rol) ? "Administrador" : "Socio";
}
