import ArrowTitle from "@/components/arrow-title";
import ContactModal from "@/components/contact-modal";
import CustomErrorToast from "@/components/custom-error-toast";
import Footer from "@/components/footer";
import Navbar from "@/components/navbar";
import Experience from "@/components/sections/experience";
import Hero from "@/components/sections/hero";
import Projects from "@/components/sections/projects";
import { StarsBackground } from "@/components/ui/stars-background";
import Wrapper from "@/components/wrapper";
import dynamic from "next/dynamic";
import { cookies } from "next/headers";
import { Suspense } from "react";

const BackgroundBeams = dynamic(
  () => import("@/components/ui/background-beams"),
);

export default function Home() {
  return (
    <ContactModal>
      <div id="home" className="relative z-10">
        <div
          id="background"
          className="-z-20 absolute min-h-full w-full rounded-b-[100px]"
        ></div>
        <Suspense>
          <CustomError />
        </Suspense>
        <div className="-z-1 absolute h-[100dvh] w-full">
          <div className="relative h-full w-full">
            <BackgroundBeams />
          </div>
        </div>
        <Navbar />
        <Wrapper>
          <Hero className="pt-16 md:pt-32 lg:pt-48" />
        </Wrapper>
        <div className="grid place-items-center">
          <ArrowTitle
            text="My Experience"
            slideDirection="bottom"
            key="experience"
            id="experience"
            priority
          />
        </div>
        <Experience />
        <div className="relative">
          <div className="mt-64 grid place-items-center">
            <ArrowTitle text="My Projects" slideDirection="top" id="projects" />
          </div>
          <Wrapper>
            <Projects className="mt-32 w-full" />
          </Wrapper>
          <StarsBackground className="-z-10" />
        </div>
      </div>
      <div className="-mt-[100dvh] min-h-[180dvh] bg-linear-to-br from-20% from-slate-700 to-slate-900 md:min-h-[160dvh]">
        <Footer className="sticky top-[20dvh] w-full pt-[40dvh]" />
      </div>
    </ContactModal>
  );
}

async function CustomError() {
  const cookieStore = await cookies();
  const error = cookieStore.get("custom_error")?.value;

  return <CustomErrorToast error={error} />;
}
