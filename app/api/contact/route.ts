import { Resend } from "resend";
import { NextResponse } from "next/server";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  let body: { email?: unknown; message?: unknown; _gotcha?: unknown };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Bad request" }, { status: 400 });
  }

  // Honeypot filled: pretend it worked, send nothing
  if (body._gotcha) return NextResponse.json({ ok: true });

  const clean = (s: string) => s.replace(/[\r\n]+/g, " ").trim();
  const email = clean(String(body.email ?? ""));
  const message = String(body.message ?? "").trim();

  if (
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ||
    !message ||
    message.length > 4000
  ) {
    return NextResponse.json({ ok: false, error: "Invalid input" }, { status: 400 });
  }

  if (!process.env.RESEND_API_KEY || !process.env.CONTACT_TO_EMAIL) {
    console.error("Missing RESEND_API_KEY or CONTACT_TO_EMAIL");
    return NextResponse.json({ ok: false, error: "Server misconfigured" }, { status: 500 });
  }

  const { error } = await resend.emails.send({
    from: "Portfolio <onboarding@resend.dev>",
    to: process.env.CONTACT_TO_EMAIL,
    replyTo: email, // older SDK versions call this reply_to
    subject: `Portfolio message from ${email}`,
    text: `From: ${email}\n\n${message}`,
  });

  if (error) {
    console.error("Resend error:", error);
    return NextResponse.json({ ok: false, error: "Send failed" }, { status: 502 });
  }
  return NextResponse.json({ ok: true });
}