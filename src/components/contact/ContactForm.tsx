"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, CheckCircle2 } from "lucide-react";

const contactSchema = z.object({
  name: z.string().min(2, "Tell us who you are."),
  email: z.string().email("That doesn't look like a valid email."),
  reason: z.enum(["support", "sales", "security", "other"]),
  message: z.string().min(10, "A little more detail helps us answer well.").max(2000),
});

type ContactValues = z.infer<typeof contactSchema>;

export function ContactForm() {
  const [status, setStatus] = useState<"idle" | "submitting" | "sent" | "error">("idle");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: { reason: "support" },
  });

  async function onSubmit(values: ContactValues) {
    setStatus("submitting");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      if (!res.ok) throw new Error("Request failed");
      setStatus("sent");
      reset();
    } catch {
      setStatus("error");
    }
  }

  if (status === "sent") {
    return (
      <div className="rounded-2xl border border-moss/30 bg-moss/[0.06] p-8 text-center">
        <CheckCircle2 className="mx-auto h-8 w-8 text-moss" />
        <p className="mt-3 font-display text-lg text-ink">Message sent.</p>
        <p className="mt-1 text-sm text-muted">We read every one of these ourselves — expect a reply within a day or two.</p>
        <button
          onClick={() => setStatus("idle")}
          className="mt-5 text-sm font-medium text-moss hover:underline"
        >
          Send another
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5" noValidate>
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className="font-mono text-xs uppercase tracking-widest text-muted">
            Name
          </label>
          <input
            id="name"
            {...register("name")}
            className="mt-2 w-full rounded-xl border border-border px-3 py-2.5 text-sm text-ink outline-none focus:border-moss"
            placeholder="Zine Eddine"
          />
          {errors.name && <p className="mt-1.5 text-xs text-gold">{errors.name.message}</p>}
        </div>
        <div>
          <label htmlFor="email" className="font-mono text-xs uppercase tracking-widest text-muted">
            Email
          </label>
          <input
            id="email"
            type="email"
            {...register("email")}
            className="mt-2 w-full rounded-xl border border-border px-3 py-2.5 text-sm text-ink outline-none focus:border-moss"
            placeholder="you@studio.com"
          />
          {errors.email && <p className="mt-1.5 text-xs text-gold">{errors.email.message}</p>}
        </div>
      </div>

      <div>
        <label htmlFor="reason" className="font-mono text-xs uppercase tracking-widest text-muted">
          What&apos;s this about
        </label>
        <select
          id="reason"
          {...register("reason")}
          className="mt-2 w-full rounded-xl border border-border bg-white px-3 py-2.5 text-sm text-ink outline-none focus:border-moss"
        >
          <option value="support">Product support</option>
          <option value="sales">Agency / team pricing</option>
          <option value="security">Security disclosure</option>
          <option value="other">Something else</option>
        </select>
      </div>

      <div>
        <label htmlFor="message" className="font-mono text-xs uppercase tracking-widest text-muted">
          Message
        </label>
        <textarea
          id="message"
          rows={5}
          {...register("message")}
          className="mt-2 w-full resize-none rounded-xl border border-border px-3 py-2.5 text-sm text-ink outline-none focus:border-moss"
          placeholder="What are you trying to do, and where's it getting stuck?"
        />
        {errors.message && <p className="mt-1.5 text-xs text-gold">{errors.message.message}</p>}
      </div>

      {status === "error" && (
        <p className="text-sm text-gold">
          Couldn&apos;t send that — try again, or email us directly at hello@ledger.dev.
        </p>
      )}

      <button
        type="submit"
        disabled={status === "submitting"}
        className="flex items-center justify-center gap-2 rounded-full bg-ink px-6 py-3 text-sm font-semibold text-paper transition hover:bg-moss-dark disabled:opacity-60"
      >
        {status === "submitting" && <Loader2 className="h-4 w-4 animate-spin" />}
        {status === "submitting" ? "Sending…" : "Send message"}
      </button>
    </form>
  );
}
