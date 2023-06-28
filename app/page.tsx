import { cookies } from "next/headers";
import Image from "next/image";
import Link from "next/link";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";

import LogoutButton from "~/components/logout-button";

const resources = [
  {
    title: "Cookie-based Auth and the Next.js App Router",
    subtitle:
      "This free course by Jon Meyers, shows you how to configure Supabase Auth to use cookies, and steps through some common patterns.",
    url: "https://youtube.com/playlist?list=PL5S4mPUpp4OtMhpnp93EFSo42iQ40XjbF",
    icon: "youtube",
  },
  {
    title: "Supabase Next.js App Router Example",
    subtitle:
      "Want to see a code example containing some common patterns with Next.js and Supabase? Check out this repo!",
    url: "https://github.com/supabase/supabase/tree/master/examples/auth/nextjs",
    icon: "code",
  },
  {
    title: "Supabase Auth Helpers Docs",
    subtitle:
      "This template has configured Supabase Auth to use cookies for you, but the docs are a great place to learn more.",
    url: "https://supabase.com/docs/guides/auth/auth-helpers/nextjs",
    icon: "book",
  },
];

const examples = [
  { type: "Client Components", src: "app/_examples/client-component/page.tsx" },
  { type: "Server Components", src: "app/_examples/server-component/page.tsx" },
  { type: "Server Actions", src: "app/_examples/server-action/page.tsx" },
  { type: "Route Handlers", src: "app/_examples/route-handler.ts" },
  { type: "Middleware", src: "app/middleware.ts" },
  { type: "Protected Routes", src: "app/_examples/protected/page.tsx" },
];

export default async function Index() {
  const supabase = createServerComponentClient({ cookies });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className="mt-24 flex max-w-3xl flex-1 flex-col">
      <h1 className="mb-2 flex justify-between text-2xl">
        <span className="sr-only">Supabase and Next.js Starter Template</span>
      </h1>

      <div className="flex border-b py-3 text-sm text-neutral-100">
        <span className="ml-auto">
          {user ? (
            <span className="flex gap-4">
              Hey, {user.email}! <span className="border-r"></span>{" "}
              <LogoutButton />
            </span>
          ) : (
            <Link href="/login" className="text-neutral-100 hover:underline">
              Login
            </Link>
          )}
        </span>
      </div>

      <div className="mt-12 flex justify-center gap-8">
        <Image
          src="/supabase.svg"
          alt="Supabase Logo"
          width={225}
          height={45}
          priority
        />
        <div className="h-10 rotate-45 border-l"></div>
        <Image
          src="/next.svg"
          alt="Vercel Logo"
          width={150}
          height={36}
          priority
        />
      </div>

      <p className="mx-auto mt-8 max-w-2xl text-center text-3xl text-white">
        The fastest way to get started building apps with{" "}
        <strong>Supabase</strong> and <strong>Next.js</strong>
      </p>

      <div className="mt-16 flex justify-center">
        <span className="rounded-lg bg-neutral-100 px-6 py-3 font-mono text-sm text-neutral-900">
          Get started by editing <strong>app/page.tsx</strong>
        </span>
      </div>

      <p className="mt-28 text-center text-lg font-bold text-neutral-100">
        Everything you need to started
      </p>

      <div className="-mx-12 mb-16 mt-10 flex h-60 gap-12">
        {resources.map(({ title, subtitle, url, icon }) => (
          <a
            key={title}
            className="group grid gap-4 border-t-2 border-neutral-200 py-6 pr-2 text-neutral-100"
            href={url}
          >
            <h2 className="mb-2 min-h-[42px] font-bold group-hover:underline">
              {title}
            </h2>
            <p className="text-sm text-neutral-100">{subtitle}</p>
            <div className="mt-2">
              <Image
                src={`/${icon}.svg`}
                alt="Vercel Logo"
                width={20}
                height={25}
                priority
              />
            </div>
          </a>
        ))}
      </div>

      <div className="mx-auto mt-16 grid max-w-lg justify-center gap-3 text-center">
        <p className="text-center text-lg font-bold text-neutral-100">
          Examples
        </p>
        <p className="mb-2 text-white">
          Look in the <code>_examples</code> folder to see how to create a
          Supabase client in all the different contexts
        </p>
      </div>

      <div className=" mb-24 mt-8 grid justify-center border-t text-white">
        {examples.map(({ type, src }) => (
          <div className="" key={type}>
            <div className="grid grid-cols-2 gap-4 border-b">
              <span className="border-r py-4 pr-4 text-right font-bold">
                {type}{" "}
              </span>
              <span className="py-4">
                <code className="text-sm">{src}</code>
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
