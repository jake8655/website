import { cn } from "@/lib/utils";
import React from "react";
import Wrapper from "./wrapper";

export default function Footer({ className }: { className?: string }) {
  return (
    <footer className={cn("min-h-[70vh] bg-blue-600", className)}>
      <div className="text-slate-100">
        <Wrapper size="sm">
          <h4 className="mb-12 text-center font-semibold text-4xl">
            Let's connect!
          </h4>
          <div className="grid grid-cols-3">
            <p>ajs j ahsjdk hkasjdh asj hdkasjh djsah kjdhs a</p>
            <p>ajs j ahsjdk hkasjdh asj hdkasjh djsah kjdhs a</p>
            <p>ajs j ahsjdk hkasjdh asj hdkasjh djsah kjdhs a</p>
          </div>
        </Wrapper>
      </div>
    </footer>
  );
}
