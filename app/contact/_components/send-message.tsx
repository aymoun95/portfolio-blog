"use client";

import { sendEmail } from "@/actions/email";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ContactSchema, contactSchema } from "@/schemas/contact";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTransition } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { SubmitBtn } from "./submit-btn";

export const SendMessage = () => {
  const [isPending, startTransition] = useTransition();

  const form = useForm<ContactSchema>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: "",
      email: "",
      subject: "",
      message: "",
    },
  });

  const onSubmit = (values: ContactSchema) => {
    startTransition(async () => {
      await sendEmail(values);
      toast.success("Message sent successfully");
      form.reset();
    });
  };
  return (
    <Card className="lg:order-2">
      <CardHeader>
        <CardTitle>Send me a message</CardTitle>
        <CardDescription>
          Fill out the form below and I'll get back to you as soon as possible.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FieldGroup className="grid sm:grid-cols-2 gap-4">
            <Controller
              name="name"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field className="space-y-2">
                  <FieldLabel> Name</FieldLabel>
                  <Input
                    aria-invalid={!!fieldState.error}
                    placeholder="Your name"
                    {...field}
                  />
                  {fieldState.error && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Controller
              name="email"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field className="space-y-2">
                  <FieldLabel> Email</FieldLabel>
                  <Input
                    aria-invalid={!!fieldState.error}
                    placeholder="email@example.com"
                    {...field}
                  />
                  {fieldState.error && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </FieldGroup>

          <FieldGroup className="space-y-2">
            <Controller
              name="subject"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field>
                  <FieldLabel> Subject</FieldLabel>
                  <Input
                    aria-invalid={!!fieldState.error}
                    placeholder="Subject"
                    {...field}
                  />
                  {fieldState.error && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </FieldGroup>

          <FieldGroup className="space-y-2">
            <Controller
              name="message"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field>
                  <FieldLabel> Message</FieldLabel>
                  <Textarea
                    aria-invalid={!!fieldState.error}
                    placeholder="Share your thoughts and feedback..."
                    rows={20}
                    className="h-30"
                    {...field}
                  />
                  {fieldState.error && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </FieldGroup>

          <SubmitBtn isPending={isPending} />
        </form>
      </CardContent>
    </Card>
  );
};
