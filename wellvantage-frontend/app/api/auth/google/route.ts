export const dynamic = "force-dynamic";

export async function GET() {
  const backendBase = process.env.NEXT_PUBLIC_BACKEND_URL ?? "http://localhost:3001";
  const target = `${backendBase.replace(/\/$/, "")}/auth/google`;
  return Response.redirect(target, 302);
}
