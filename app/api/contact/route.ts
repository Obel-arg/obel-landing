import { Resend } from "resend";
import { NextResponse } from "next/server";

// Simple in-memory rate limiter
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT = 3; // max requests
const RATE_WINDOW = 60 * 1000; // per minute

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const record = rateLimitMap.get(ip);

  if (!record || now > record.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + RATE_WINDOW });
    return false;
  }

  if (record.count >= RATE_LIMIT) {
    return true;
  }

  record.count++;
  return false;
}

export async function POST(request: Request) {
  try {
    // Get IP for rate limiting
    const ip = request.headers.get("x-forwarded-for") || "unknown";

    // Rate limit check
    if (isRateLimited(ip)) {
      return NextResponse.json(
        { error: "Too many requests. Please try again later." },
        { status: 429 }
      );
    }

    const { firstName, lastName, email, message, company, role, website } = await request.json();

    // Honeypot check - if filled, it's a bot
    if (website) {
      // Silently reject but return success to not tip off bots
      return NextResponse.json({ success: true });
    }

    // Validate required fields
    if (!firstName || !lastName || !email || !message) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Check for API key
    if (!process.env.RESEND_API_KEY) {
      console.error("RESEND_API_KEY is not configured");
      return NextResponse.json(
        { error: "Email service not configured" },
        { status: 500 }
      );
    }

    const resend = new Resend(process.env.RESEND_API_KEY);

    // Send email with excellent formatting
    await resend.emails.send({
      from: "OBEL Contact <onboarding@resend.dev>", // Change to contact@obel.la after domain verification
      to: "hello@obel.la",
      replyTo: email,
      subject: `New Contact: ${firstName} ${lastName}`,
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff;">
          <div style="background: #090E19; padding: 30px 40px;">
            <h1 style="color: #FFFAF8; margin: 0; font-size: 24px; font-weight: 400; letter-spacing: -0.5px;">
              New Contact Form Submission
            </h1>
          </div>

          <div style="padding: 40px;">
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 16px 0; border-bottom: 1px solid #f0f0f0; color: #666; font-size: 13px; text-transform: uppercase; letter-spacing: 1px; width: 120px; vertical-align: top;">
                  Name
                </td>
                <td style="padding: 16px 0; border-bottom: 1px solid #f0f0f0; color: #090E19; font-size: 16px;">
                  ${firstName} ${lastName}
                </td>
              </tr>
              <tr>
                <td style="padding: 16px 0; border-bottom: 1px solid #f0f0f0; color: #666; font-size: 13px; text-transform: uppercase; letter-spacing: 1px; vertical-align: top;">
                  Email
                </td>
                <td style="padding: 16px 0; border-bottom: 1px solid #f0f0f0; color: #090E19; font-size: 16px;">
                  <a href="mailto:${email}" style="color: #090E19; text-decoration: none; border-bottom: 1px solid #090E19;">
                    ${email}
                  </a>
                </td>
              </tr>
              ${company ? `
              <tr>
                <td style="padding: 16px 0; border-bottom: 1px solid #f0f0f0; color: #666; font-size: 13px; text-transform: uppercase; letter-spacing: 1px; vertical-align: top;">
                  Company
                </td>
                <td style="padding: 16px 0; border-bottom: 1px solid #f0f0f0; color: #090E19; font-size: 16px;">
                  ${company}
                </td>
              </tr>
              ` : ''}
              ${role ? `
              <tr>
                <td style="padding: 16px 0; border-bottom: 1px solid #f0f0f0; color: #666; font-size: 13px; text-transform: uppercase; letter-spacing: 1px; vertical-align: top;">
                  Role
                </td>
                <td style="padding: 16px 0; border-bottom: 1px solid #f0f0f0; color: #090E19; font-size: 16px;">
                  ${role}
                </td>
              </tr>
              ` : ''}
            </table>

            <div style="margin-top: 32px;">
              <p style="color: #666; font-size: 13px; text-transform: uppercase; letter-spacing: 1px; margin: 0 0 12px 0;">
                Message
              </p>
              <div style="background: #FFFAF8; padding: 24px; border-radius: 8px; border-left: 3px solid #090E19;">
                <p style="color: #090E19; font-size: 16px; line-height: 1.6; margin: 0; white-space: pre-wrap;">
                  ${message}
                </p>
              </div>
            </div>
          </div>

          <div style="background: #f9f9f9; padding: 20px 40px; border-top: 1px solid #f0f0f0;">
            <p style="color: #999; font-size: 12px; margin: 0;">
              Sent from OBEL Contact Form · <a href="https://obel.la" style="color: #666; text-decoration: none;">obel.la</a>
            </p>
          </div>
        </div>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Email error:", error);
    return NextResponse.json(
      { error: "Failed to send email" },
      { status: 500 }
    );
  }
}
