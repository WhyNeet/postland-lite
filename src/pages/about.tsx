import { getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]";
import type {
  InferGetServerSidePropsType,
  GetServerSidePropsContext,
} from "next";
import Head from "next/head";
import { NavBar } from "@/components/navbar";
import { Card } from "@/components/ui/card";
import { NextJs, TailwindCss } from "@/components/ui/logo";
import { HoverCard } from "@/components/ui/card";
import { TrpcLogo } from "@/components/logos";

export async function getServerSideProps({
  req,
  res,
}: GetServerSidePropsContext) {
  const session = await getServerSession(req, res, authOptions);
  return {
    props: {
      user: session?.user ?? null,
    },
  };
}

export default function About({
  user,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  return (
    <>
      <Head>
        <title>About | postland</title>
      </Head>
      <NavBar user={user} />
      <div className="px-5 sm:px-10 lg:px-20 py-24 max-w-7xl mx-auto text-center">
        <h1 className="font-bold text-3xl mb-6">Built with</h1>
        <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-2">
          <HoverCard className="h-40 card">
            <div className="flex items-center justify-center h-full w-full">
              <NextJs className="dark:invert w-40 h-16" />
            </div>
          </HoverCard>
          <HoverCard className="h-40 card">
            <div className="flex items-center justify-center h-full w-full">
              <TailwindCss className="w-40" />
            </div>
          </HoverCard>
          <HoverCard className="h-40 card">
            <div className="flex items-center justify-center h-full w-full">
              <TrpcLogo className="h-16" />
            </div>
          </HoverCard>
        </div>
      </div>
    </>
  );
}
