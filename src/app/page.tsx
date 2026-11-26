import { redirect } from "next/navigation";
import { rutaInicio } from "@/lib/permissions";
import { getSession } from "@/lib/session";

export default async function HomePage() {
  const session = await getSession();

  redirect(session ? rutaInicio(session.user.role) : "/login");
}
