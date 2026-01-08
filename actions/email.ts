"use server";

import EmailTemplate from "@/app/(main)/contact/_components/email-template";
import { contactSchema } from "@/schemas/contact";
import { Resend } from "resend";
import z from "zod";

const resend = new Resend(process.env.RESEND_API_KEY);
const email = process.env.EMAIL;

export async function sendEmail(values: z.infer<typeof contactSchema>) {
  try {
    const parsed = contactSchema.safeParse(values);
    if (!parsed.success) {
      throw new Error("Something went wrong");
    }

    await resend.emails.send({
      from: `Portfolio Contact Form <onboarding@resend.dev>`,
      to: [email!],
      replyTo: parsed.data.email,
      subject: `New message from ${parsed.data.name}: ${parsed.data.subject}`,
      react: EmailTemplate({
        name: parsed.data.name,
        message: parsed.data.message,
      }) as React.ReactElement,
    });
  } catch (error) {
    return {
      error: "Failed to send email",
    };
  }
}
