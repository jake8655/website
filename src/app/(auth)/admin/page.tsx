import DataTable from "@/components/admin/data-table";
import { AdminNavbar } from "@/components/navbar";
import RevealOnScroll from "@/components/reveal-on-scroll";
import { BackgroundBeams } from "@/components/ui/background-beams";
import Wrapper from "@/components/wrapper";
import { env } from "@/env";
import { getCurrentSession } from "@/server/auth/session";
import { HydrateClient, api } from "@/trpc/server";
import { redirect } from "next/navigation";

export default async function AdminDashboard() {
  const { user } = await getCurrentSession();
  if (user?.githubId !== env.MY_GITHUB_ID) return redirect("/");

  return (
    <div className="relative z-30">
      <div className="-z-[1] absolute h-screen w-full">
        <div className="relative h-full w-full">
          <BackgroundBeams />
        </div>
      </div>
      <AdminNavbar />
      <Wrapper className="pt-16 pb-16 md:pt-32 lg:pt-48">
        <RevealOnScroll
          once
          variants={{
            hidden: { y: "-100%", opacity: 0 },
            visible: { y: 0, opacity: 1 },
          }}
          transition={{
            delay: 0.6,
          }}
        >
          <h1 className="mb-8 text-center font-bold text-4xl md:text-5xl">
            Contact Posts
          </h1>
        </RevealOnScroll>
        <DataTableWithPrefetching />
      </Wrapper>
    </div>
  );
}

// Prefetch the data on the server and stream in result
async function DataTableWithPrefetching() {
  void api.admin.getMessageData.prefetch();

  return (
    <HydrateClient>
      <DataTable />
    </HydrateClient>
  );
}
