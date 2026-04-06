import { NextResponse } from "next/server";

interface BookingPayload {
  name: string;
  email: string;
  business: string;
  teamSize: string;
  painPoint: string;
  date: string;
  time: string;
}

const REQUIRED_FIELDS: (keyof BookingPayload)[] = [
  "name",
  "email",
  "business",
  "teamSize",
  "painPoint",
  "date",
  "time",
];

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Partial<BookingPayload>;

    for (const field of REQUIRED_FIELDS) {
      if (!body[field] || typeof body[field] !== "string") {
        return NextResponse.json(
          { error: `Missing required field: ${field}` },
          { status: 400 },
        );
      }
    }

    const payload = body as BookingPayload;

    const dateDisplay = new Date(payload.date + "T12:00:00").toLocaleDateString(
      "en-US",
      { weekday: "long", month: "long", day: "numeric", year: "numeric" },
    );

    // Send notification email via SMTP if configured
    const smtpHost = process.env.SMTP_HOST;
    const smtpUser = process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASS;
    const notifyEmail = process.env.NOTIFY_EMAIL || "hello@covenantai.consulting";

    if (smtpHost && smtpUser && smtpPass) {
      const nodemailer = await import("nodemailer");
      const port = Number(process.env.SMTP_PORT || "587");
      const secure = process.env.SMTP_SECURE === "true";
      const transporter = nodemailer.default.createTransport({
        host: smtpHost,
        port,
        secure,
        ...(!secure && { requireTLS: true }),
        auth: { user: smtpUser, pass: smtpPass },
      });

      // Notify you
      await transporter.sendMail({
        from: `"Covenant AI Booking" <${smtpUser}>`,
        to: notifyEmail,
        subject: `New Discovery Call: ${payload.business} — ${dateDisplay} at ${payload.time}`,
        html: `
          <h2 style="color:#001F3F;margin:0 0 16px;">New Discovery Call Booking</h2>
          <table style="border-collapse:collapse;width:100%;max-width:500px;">
            <tr><td style="padding:8px 12px;color:#666;font-size:14px;">Name</td><td style="padding:8px 12px;font-weight:600;">${payload.name}</td></tr>
            <tr style="background:#f8f8f8;"><td style="padding:8px 12px;color:#666;font-size:14px;">Email</td><td style="padding:8px 12px;">${payload.email}</td></tr>
            <tr><td style="padding:8px 12px;color:#666;font-size:14px;">Business</td><td style="padding:8px 12px;">${payload.business}</td></tr>
            <tr style="background:#f8f8f8;"><td style="padding:8px 12px;color:#666;font-size:14px;">Team Size</td><td style="padding:8px 12px;">${payload.teamSize}</td></tr>
            <tr><td style="padding:8px 12px;color:#666;font-size:14px;">Date</td><td style="padding:8px 12px;font-weight:600;">${dateDisplay}</td></tr>
            <tr style="background:#f8f8f8;"><td style="padding:8px 12px;color:#666;font-size:14px;">Time</td><td style="padding:8px 12px;font-weight:600;">${payload.time} ET</td></tr>
          </table>
          <h3 style="color:#001F3F;margin:24px 0 8px;">Pain Point</h3>
          <p style="color:#333;line-height:1.6;background:#f8f8f8;padding:12px;border-radius:8px;">${payload.painPoint}</p>
          <p style="color:#999;font-size:12px;margin-top:24px;">Reply to this email to respond directly to the prospect.</p>
        `,
        replyTo: payload.email,
      });

      // Confirm to prospect
      await transporter.sendMail({
        from: `"Covenant AI Consulting" <${smtpUser}>`,
        to: payload.email,
        subject: `Your Discovery Call — ${dateDisplay} at ${payload.time} ET`,
        html: `
          <h2 style="color:#001F3F;margin:0 0 16px;">You're Booked!</h2>
          <p style="color:#333;line-height:1.6;">
            Hi ${payload.name.split(" ")[0]}, thanks for your interest in Covenant AI Consulting.
          </p>
          <p style="color:#333;line-height:1.6;">
            Your discovery call is scheduled for:
          </p>
          <div style="background:#FAF7F2;border-left:4px solid #D4AF37;padding:16px 20px;margin:16px 0;border-radius:0 8px 8px 0;">
            <p style="margin:0;font-size:18px;font-weight:700;color:#001F3F;">${dateDisplay}</p>
            <p style="margin:4px 0 0;font-size:16px;color:#001F3F;">${payload.time} Eastern Time</p>
          </div>
          <p style="color:#333;line-height:1.6;">
            We'll send you a meeting link before the call. In the meantime,
            feel free to reply to this email if you have any questions.
          </p>
          <p style="color:#666;font-size:13px;margin-top:24px;">
            — Covenant AI Consulting<br/>
            <a href="https://covenantai.consulting" style="color:#D4AF37;">covenantai.consulting</a>
          </p>
        `,
      });
    } else {
      // No SMTP configured — log the booking for manual follow-up
      console.log("=== NEW BOOKING (no SMTP configured) ===");
      console.log(JSON.stringify(payload, null, 2));
      console.log("=========================================");
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Booking error:", err);
    return NextResponse.json(
      { error: "Failed to process booking" },
      { status: 500 },
    );
  }
}
