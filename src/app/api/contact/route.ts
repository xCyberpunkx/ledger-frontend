import { NextResponse } from "next/server";
import { z } from "zod";

const contactSchema = z.object({
  name: z.string().min(2).max(200),
  email: z.string().email(),
  reason: z.enum(["support", "sales", "security", "other"]),
  message: z.string().min(10).max(2000),
});

// Runs server-side only — RESEND_API_KEY never reaches the client bundle.
// Re-validating here on purpose: client-side zod is a UX nicety, not a
// trust boundary. Anyone can POST directly to this route.
export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const parsed = contactSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ message: "Invalid submission" }, { status: 400 });
  }

  const { name, email, reason, message } = parsed.data;
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_EMAIL_TO;

  if (!apiKey || !to) {
    // No Resend key configured yet (e.g. local dev, or before you've set
    // production env vars) — don't 500 and lose the submission, log it
    // server-side so it's still visible in Vercel/Railway logs.
    console.warn("[contact] RESEND_API_KEY or CONTACT_EMAIL_TO not set — logging instead of sending", {
      name,
      email,
      reason,
      message,
    });
    return NextResponse.json({ ok: true, delivered: false });
  }

  const { Resend } = await import("resend");
  const resend = new Resend(apiKey);

  const { error } = await resend.emails.send({
    from: "Ledger <onboarding@resend.dev>",
    to,
    replyTo: email,
    subject: `[Ledger contact — ${reason}] ${name}`,
    text: `From: ${name} <${email}>\nReason: ${reason}\n\n${message}`,
  });

  if (error) {
    console.error("[contact] Resend error", error);
    return NextResponse.json({ message: "Delivery failed" }, { status: 502 });
  }

  return NextResponse.json({ ok: true, delivered: true });
}
