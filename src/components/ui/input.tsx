// Input component extends from shadcnui - https://ui.shadcn.com/docs/components/input

"use client";

import { motion, useMotionTemplate, useMotionValue } from "framer-motion";
import * as React from "react";
import { cn } from "@/lib/utils";

const Input = ({
  ref,
  className,
  type,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & {
  ref?: React.Ref<HTMLInputElement>;
}) => {
  const radius = 100; // change this to increase the radius of the hover effect
  const [visible, setVisible] = React.useState(false);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  function handleMouseMove({
    currentTarget,
    clientX,
    clientY,
  }: React.MouseEvent<HTMLDivElement, MouseEvent>) {
    const { left, top } = currentTarget.getBoundingClientRect();

    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }
  return (
    <motion.div
      style={{
        background: useMotionTemplate`
        radial-gradient(
          ${visible ? radius + "px" : "0px"} circle at ${mouseX}px ${mouseY}px,
          var(--color-blue-500),
          transparent 80%
        )
      `,
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
      className="group/input rounded-lg p-[2px] transition duration-300"
    >
      <input
        type={type}
        className={cn(
          `flex h-10 w-full rounded-md border-none bg-zinc-800 px-3 py-2 text-sm shadow-input shadow-sm transition duration-400 file:border-0 file:bg-transparent file:font-medium file:text-sm placeholder:text-gray-400 focus-visible:outline-hidden focus-visible:ring-[2px] focus-visible:ring-neutral-600 disabled:cursor-not-allowed disabled:opacity-50 group-hover/input:shadow-none`,
          className,
        )}
        ref={ref}
        {...props}
      />
    </motion.div>
  );
};
Input.displayName = "Input";

const Textarea = ({
  ref,
  className,
  ...props
}: React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
  ref?: React.Ref<HTMLTextAreaElement>;
}) => {
  const radius = 400; // change this to increase the radius of the hover effect
  const [visible, setVisible] = React.useState(false);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  function handleMouseMove({
    currentTarget,
    clientX,
    clientY,
  }: React.MouseEvent<HTMLDivElement, MouseEvent>) {
    const { left, top } = currentTarget.getBoundingClientRect();

    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }
  return (
    <motion.div
      style={{
        background: useMotionTemplate`
        radial-gradient(
          ${visible ? radius + "px" : "0px"} circle at ${mouseX}px ${mouseY}px,
          var(--color-blue-500),
          transparent 80%
        )
      `,
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
      className="group/input rounded-lg p-[2px] transition duration-300"
    >
      <textarea
        className={cn(
          `flex h-48 w-full rounded-md border-none bg-zinc-800 px-3 py-2 text-sm shadow-input shadow-sm transition duration-400 file:border-0 file:bg-transparent file:font-medium file:text-sm placeholder:text-gray-400 focus-visible:outline-hidden focus-visible:ring-[2px] focus-visible:ring-neutral-600 disabled:cursor-not-allowed disabled:opacity-50 group-hover/input:shadow-none`,
          className,
        )}
        ref={ref}
        {...props}
      />
    </motion.div>
  );
};
Textarea.displayName = "Textarea";

export { Input, Textarea };
