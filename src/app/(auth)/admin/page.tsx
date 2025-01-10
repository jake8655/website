import { AdminNavbar } from "@/components/navbar";
import Wrapper from "@/components/wrapper";
import { env } from "@/env";
import { getCurrentSession } from "@/server/auth/session";
import { db } from "@/server/db";
import { redirect } from "next/navigation";

export default async function AdminDashboard() {
  const { user } = await getCurrentSession();
  if (user?.githubId !== env.MY_GITHUB_ID) return redirect("/");

  const data = await db.query.contactPostTable.findMany();

  return (
    <div className="relative z-30">
      <AdminNavbar />
      <Wrapper className="pt-16 md:pt-32 lg:pt-48">
        <h1 className="mb-8 text-center font-bold text-4xl md:text-5xl">
          Contact Posts
        </h1>
        <ul>
          {data.map(post => (
            <li
              key={post.id}
              className="mb-4 rounded-lg bg-brand p-4 text-brand-darker"
            >
              <h2>
                <span className="font-semibold">Name</span>: {post.name}
              </h2>
              <h2>
                <span className="font-semibold">Email</span>: {post.email}
              </h2>
              <h2>
                <span className="font-semibold">Subject</span>: {post.subject}
              </h2>
              <p className="my-2 rounded-lg bg-popover p-2 text-brand-light">
                {post.message
                  .split("")
                  .map((char, i) =>
                    char === "\n" ? (
                      <br key={i} />
                    ) : (
                      <span key={i}>{char}</span>
                    ),
                  )}
              </p>
              <p className="text-gray-800 text-sm italic">
                {post.createdAt.toLocaleString()}
              </p>
            </li>
          ))}
        </ul>
      </Wrapper>
    </div>
  );
}
