import DataTable from "@/components/admin/data-table";
import { AdminNavbar } from "@/components/navbar";
import Wrapper from "@/components/wrapper";
import { env } from "@/env";
import { getCurrentSession } from "@/server/auth/session";
import { HydrateClient, api } from "@/trpc/server";
import dynamic from "next/dynamic";
import { redirect } from "next/navigation";

const BackgroundBeams = dynamic(
  () => import("@/components/ui/background-beams"),
);

export const metadata = {
  title: "Admin Dashboard",
  description: "Admin Dashboard of Dominik Tóth.",
};

export default async function AdminDashboard() {
  const { user } = await getCurrentSession();
  if (user?.githubId !== env.MY_GITHUB_ID) return redirect("/");

  return (
    <div className="relative z-30">
      <div className="-z-1 absolute h-[100dvh] w-full">
        <div className="relative h-full w-full">
          <BackgroundBeams />
        </div>
      </div>
      <AdminNavbar />
      <Wrapper className="pt-16 pb-16 md:pt-32 lg:pt-48">
        <h1 className="mb-8 text-center font-bold text-4xl md:text-5xl">
          Contact Posts
        </h1>
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
