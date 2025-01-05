import { env } from "@/env";
import { logout } from "@/server/auth/actions";
import { getCurrentSession } from "@/server/auth/session";
import { db } from "@/server/db";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function AdminDashboard() {
  const { user } = await getCurrentSession();
  if (user?.githubId !== env.MY_GITHUB_ID) return redirect("/");

  const data = await db.query.contactPostTable.findMany();

  return (
    <div>
      <div className="mb-4 flex w-fit flex-col gap-2">
        <Link href="/">&larr; Home</Link>
        <button onClick={logout}>Sign out</button>
      </div>
      <h1>Admin Dashboard</h1>
      <ul>
        {data.map(post => (
          <li key={post.id} className="mb-4 bg-red-500">
            <h2>{post.name}</h2>
            <p>
              {post.message
                .split("")
                .map((char, i) =>
                  char === "\n" ? <br key={i} /> : <span key={i}>{char}</span>,
                )}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}
