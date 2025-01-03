"use client";

import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
} from "@/components/ui/animated-modal";
import { cn } from "@/lib/utils";
import { Link } from "lucide-react";
import { Input, Textarea } from "./ui/input";
import { Label } from "./ui/label";

export default function ContactModal({
  children,
}: { children: React.ReactNode }) {
  return (
    <Modal>
      <ModalBody>
        <ModalContent>
          <form className="my-8">
            <h3 className="mb-4 text-center font-bold text-3xl">Contact me</h3>
            <LabelInputContainer className="mb-4">
              <Label htmlFor="name">Name</Label>
              <Input id="name" placeholder="John Doe" type="text" />
            </LabelInputContainer>
            <LabelInputContainer className="mb-4">
              <Label htmlFor="email">Email Address</Label>
              <Input id="email" placeholder="email@example.com" type="email" />
            </LabelInputContainer>
            <LabelInputContainer className="mb-4">
              <Label htmlFor="subject">Subject</Label>
              <Input
                id="subject"
                placeholder="Coffee machine website"
                type="text"
              />
            </LabelInputContainer>
            <LabelInputContainer className="mb-4">
              <Label htmlFor="message">Message</Label>
              <Textarea id="message" placeholder="Hi, I'm interested in..." />
            </LabelInputContainer>

            <div className="flex w-full gap-4">
              <button
                className="group/btn relative block h-10 w-full rounded-md bg-gradient-to-br bg-zinc-800 from-zinc-800 to-zinc-900 font-medium shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset]"
                type="button"
              >
                Cancel
                <BottomGradient />
              </button>

              <button
                className="group/btn relative block h-10 w-full rounded-md bg-gradient-to-br bg-zinc-800 from-blue-700 to-blue-800 font-medium shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset]"
                type="submit"
              >
                <div className="flex items-center justify-center gap-2">
                  Send
                  <span className="relative left-0 transition-all duration-200 ease-out group-hover/btn:left-1">
                    &rarr;
                  </span>
                </div>
                <BottomGradient />
              </button>
            </div>
          </form>
        </ModalContent>
        <ModalFooter className="flex items-center gap-2">
          <Link size={16} />
          Please feel free to contact me if you have any questions or ideas
          you'd like to discuss.
        </ModalFooter>
      </ModalBody>
      {children}
    </Modal>
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
