"use client";

import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  useModal,
} from "@/components/ui/animated-modal";
import {
  type ContactFormSchema,
  cn,
  contactFormSchema,
  msToTime,
} from "@/lib/utils";
import { api } from "@/trpc/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from "lucide-react";
import {
  type FieldError,
  type UseFormRegister,
  useForm,
} from "react-hook-form";
import { toast } from "sonner";
import { Input, Textarea } from "./ui/input";
import { Label } from "./ui/label";

export default function ContactModal({
  children,
}: { children: React.ReactNode }) {
  return (
    <Modal>
      <ModalBody>
        <ModalContent>
          <Form />
        </ModalContent>
        <ModalFooter className="flex items-center gap-2">
          {/* TODO: On specific viewports, the Link icon is shrunken */}
          <Link size={16} />
          Please feel free to contact me if you have any questions or ideas
          you'd like to discuss.
        </ModalFooter>
      </ModalBody>
      {children}
    </Modal>
  );
}

function Form() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ContactFormSchema>({
    resolver: zodResolver(contactFormSchema),
  });

  const { setOpen } = useModal();

  const { mutate, isPending } = api.contact.createContactMessage.useMutation({
    onSuccess: () => {
      toast("✅ Successfully sent contact message", {
        description: "Thank you for reaching out! I will get back to you soon.",
      });
      reset();
      setTimeout(() => setOpen(false), 1000);
    },

    onError: err => {
      if (err.data?.ratelimit) {
        const resetTimestamp = err.data.ratelimit.resetTimestamp;
        const timeStamp = msToTime(resetTimestamp - Date.now());

        return toast("❌ Error sending message", {
          description: `You have exceeded the rate limit for sending messages. Please try again in ${timeStamp}.`,
        });
      }

      toast("❌ Error sending message", {
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

const BottomGradient = () => {
  return (
    <>
      <span className="-bottom-px absolute inset-x-0 block h-px w-full bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-0 transition duration-500 group-hover/btn:opacity-100" />
      <span className="-bottom-px absolute inset-x-10 mx-auto block h-px w-1/2 bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-0 blur-sm transition duration-500 group-hover/btn:opacity-100" />
    </>
  );
};

const LabelInputContainer = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div className={cn("flex w-full flex-col space-y-2", className)}>
      {children}
    </div>
  );
};

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
            "outline outline-[2px] outline-red-500 ring-0 focus-visible:outline":
              error,
          })}
          {...register(name)}
        />
      ) : (
        <Input
          id={name}
          placeholder={placeholder}
          className={cn({
            "outline outline-[2px] outline-red-500 ring-0 focus-visible:outline":
              error,
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
      className="group/btn relative block h-10 w-full rounded-md bg-gradient-to-br bg-zinc-800 from-zinc-800 to-zinc-900 font-medium shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset]"
      type="button"
      onClick={() => setOpen(false)}
    >
      Cancel
      <BottomGradient />
    </button>
  );
}

function SendButton({
  isSubmitting,
}: {
  isSubmitting: boolean;
}) {
  return (
    <button
      className={cn(
        "group/btn relative block h-10 w-full rounded-md bg-gradient-to-br from-blue-700 to-blue-800 font-medium shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset]",
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
