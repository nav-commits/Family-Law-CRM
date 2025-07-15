import { NextRequest, NextResponse } from "next/server";
import sgMail from "@sendgrid/mail";
import { adminDb } from "../../../lib/firebase-admin";
import admin from "firebase-admin"; // <-- import admin for FieldValue

sgMail.setApiKey(process.env.SENDER_API_KEY!);

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const { clientName, clientEmail } = data;

    if (!clientName || !clientEmail) {
      return NextResponse.json(
        { error: "Missing clientName or clientEmail in request body" },
        { status: 400 }
      );
    }

    const toEmail = process.env.LAWYER_EMAIL;
    const fromEmail = process.env.SENDER_EMAIL;

    if (!toEmail || !fromEmail) {
      console.error("Missing LAWYER_EMAIL or SENDER_EMAIL in .env");
      return NextResponse.json(
        { error: "Email configuration missing in environment variables" },
        { status: 500 }
      );
    }

    const msg = {
      to: toEmail,
      from: fromEmail,
      replyTo: fromEmail,
      subject: `New Client Intake Submitted: ${clientName}`,
      text: `A new client has submitted an intake form.\n\nName: ${clientName}\nEmail: ${clientEmail}`,
      html: `
          <p>A new client has submitted an intake form.</p>
          <p><strong>Name:</strong> ${clientName}</p>
          <p><strong>Email:</strong> ${clientEmail}</p>
        `,
      headers: {
        "X-Mailer": "SendGrid",
      },
    };

    await sgMail.send(msg);

    await adminDb.collection("notifications").add({
      message: `New client added: ${clientName}`,
      clientEmail,
      timestamp: admin.firestore.FieldValue.serverTimestamp(), // <-- here
      type: "intake_submission",
      read: false,
    });

    return NextResponse.json({ message: "Notification sent" }, { status: 200 });
  } catch (error: any) {
    console.error("SendGrid or Firestore error:", error);
    return NextResponse.json(
      { error: "Failed to send notification" },
      { status: 500 }
    );
  }
}
