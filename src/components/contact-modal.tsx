import { Link } from "lucide-react";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
} from "@/components/ui/animated-modal";
import { cn } from "@/lib/utils";
import Form from "./contact-form";

export default function ContactModal({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Modal>
      <ModalBody>
        <ModalContent>
          <Form />
        </ModalContent>
        <ModalFooter className="flex items-center gap-2">
          <Link size={16} className="shrink-0" />
          Please feel free to contact me if you have any questions or ideas
          you'd like to discuss.
        </ModalFooter>
      </ModalBody>
      {children}
    </Modal>
  );
}

export const BottomGradient = () => {
  return (
    <>
      <span className="-bottom-px absolute inset-x-0 block h-px w-full bg-linear-to-r from-transparent via-blue-500 to-transparent opacity-0 transition duration-500 group-hover/btn:opacity-100" />
      <span className="-bottom-px absolute inset-x-10 mx-auto block h-px w-1/2 bg-linear-to-r from-transparent via-indigo-500 to-transparent opacity-0 blur-xs transition duration-500 group-hover/btn:opacity-100" />
    </>
  );
};

export const LabelInputContainer = ({
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
