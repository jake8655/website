"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  type FieldError,
  type UseFormRegister,
  useForm,
} from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { useSaveForm } from "@/lib/hooks";
import {
  type ContactFormSchema,
  cn,
  contactFormSchema,
  msToTime,
} from "@/lib/utils";
import { api } from "@/trpc/react";
import { BottomGradient, LabelInputContainer } from "./contact-modal";
import { useModal } from "./ui/animated-modal";
import { Input, Textarea } from "./ui/input";
import { Label } from "./ui/label";

export default function Form() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    subscribe,
    setValue,
  } = useForm<ContactFormSchema>({
    resolver: zodResolver(contactFormSchema),
  });

  useSaveForm(
    "contactForm",
    z.object(
      Object.fromEntries(
        Object.keys(contactFormSchema.shape).map(key => [key, z.string()]),
      ) as Record<keyof ContactFormSchema, z.ZodString>,
    ),
    setValue,
    subscribe,
  );

  const { setOpen } = useModal();

  const { mutate, isPending } = api.contact.createContactMessage.useMutation({
    onSuccess: () => {
      toast.success("Successfully sent contact message", {
        description: "Thank you for reaching out! I will get back to you soon.",
      });
      reset();
      setTimeout(() => setOpen(false), 1000);
    },

    onError: err => {
      if (err.data?.ratelimit) {
        const resetTimestamp = err.data.ratelimit.resetTimestamp;
        const timeStamp = msToTime(resetTimestamp - Date.now());

        toast.error("Error sending message", {
          description: `You have exceeded the rate limit for sending messages. Please try again in ${timeStamp}.`,
        });
        return;
      }

      toast.error("Error sending message", {
        description:
          "There was an internal server error while sending the message.",
      });
    },
  });

  return (
    <form className="mt-8" onSubmit={handleSubmit(data => mutate(data))}>
      <h3 className="mb-4 text-center font-bold text-3xl">Contact me</h3>
      <div className="space-y-4">
        <Field
          name="name"
          label="Name"
          placeholder="John Doe"
          error={errors["name"]}
          register={register}
        />
        <Field
          name="email"
          label="Email Address"
          placeholder="email@example.com"
          error={errors["email"]}
          register={register}
        />
        <Field
          name="subject"
          label="Subject"
          placeholder="Coffee machine website"
          error={errors["subject"]}
          register={register}
        />
        <Field
          name="message"
          label="Message"
          placeholder="Hi, I'm interested in..."
          error={errors["message"]}
          register={register}
          textarea
        />

        <div className="flex w-full gap-4">
          <CancelButton />
          <SendButton isSubmitting={isPending} />
        </div>
      </div>
    </form>
  );
}

function Field({
  name,
  label,
  placeholder,
  error,
  register,
  textarea = false,
}: {
  name: keyof ContactFormSchema;
  label: string;
  placeholder: string;
  error: FieldError | undefined;
  register: UseFormRegister<ContactFormSchema>;
  textarea?: boolean;
}) {
  return (
    <LabelInputContainer>
      <Label htmlFor={name}>{label}</Label>
      {textarea ? (
        <Textarea
          id={name}
          placeholder={placeholder}
          className={cn({
            "outline-[2px] outline-red-500 ring-0 focus-visible:outline": error,
          })}
          {...register(name)}
        />
      ) : (
        <Input
          id={name}
          placeholder={placeholder}
          className={cn({
            "outline-[2px] outline-red-500 ring-0 focus-visible:outline": error,
          })}
          {...register(name)}
        />
      )}
      {error?.message && (
        <p className="text-red-500 text-xs md:text-sm">{error.message}</p>
      )}
    </LabelInputContainer>
  );
}

function CancelButton() {
  const { setOpen } = useModal();

  return (
    <button
      className="group/btn relative block h-10 w-full rounded-md bg-linear-to-br bg-zinc-800 from-zinc-800 to-zinc-900 font-medium shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset]"
      type="button"
      onClick={() => setOpen(false)}
    >
      Cancel
      <BottomGradient />
    </button>
  );
}

function SendButton({ isSubmitting }: { isSubmitting: boolean }) {
  return (
    <button
      className={cn(
        "group/btn relative block h-10 w-full rounded-md bg-linear-to-br from-blue-700 to-blue-800 font-medium shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset]",
        {
          "cursor-not-allowed from-blue-800 to-blue-900": isSubmitting,
        },
      )}
      type="submit"
    >
      <div className="flex items-center justify-center gap-2">
        Send
        {isSubmitting ? (
          <svg
            className="-ml-1 mr-3 h-5 w-5 animate-spin"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
        ) : (
          <span className="relative left-0 transition-all duration-200 ease-out group-hover/btn:left-1">
            &rarr;
          </span>
        )}
      </div>
      <BottomGradient />
    </button>
  );
}
