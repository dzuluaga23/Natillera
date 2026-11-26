import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";

export type Session = Awaited<ReturnType<typeof auth.api.getSession>>;

export async function getSession(): Promise<Session> {
  return auth.api.getSession({ headers: await headers() });
}

export async function requireSession(): Promise<NonNullable<Session>> {
  const session = await getSession();

  if (!session) {
    redirect("/login");
  }

  return session;
}

export async function requireAdmin() {
  const session = await requireSession();

  if (session.user.role !== "admin") {
    redirect("/mi");
  }

  return session;
}

export async function requireSocio() {
  const session = await requireSession();

  if (session.user.role === "admin") {
    redirect("/admin");
  }

  return session;
}
