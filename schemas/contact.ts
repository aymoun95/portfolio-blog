import z from "zod";

export const contactSchema = z.object({
  name: z.string().min(3).max(30),
  email: z.email(),
  subject: z.string().min(3).max(30),
  message: z.string().min(10),
});

export type ContactSchema = z.infer<typeof contactSchema>;
