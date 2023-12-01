import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Logo } from "@/components/ui/logo";
import { Session, getServerSession } from "next-auth";
import { signOut } from "next-auth/react";
import {
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
} from "next/types";
import { authOptions } from "../api/auth/[...nextauth]";
import Head from "next/head";
import { useEffect, useRef, useState } from "react";
import { mouseHandler } from "@/utils/mouseHandler";
import { ProfileEditDialog } from "@/components/profile-edit-dialog";

export async function getServerSideProps({
  req,
  res,
}: GetServerSidePropsContext) {
  const session = await getServerSession(req, res, authOptions);

  if (!session) {
    res.writeHead(307, { Location: "/auth/log-in" });
    res.end();
    return { props: {} as { user: Session["user"] } };
  }

  return { props: { user: session.user } };
}

export default function Me({
  user: sessionUser,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const [user, setUser] = useState(sessionUser);
  const card = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!card.current) return;

    const listener = (e: MouseEvent) => mouseHandler(e, card.current!);

    window.addEventListener("mousemove", listener);

    return () => window.removeEventListener("mousemove", listener);
  }, []);

  return (
    <>
      <Head>
        <title>Profile | postland</title>
      </Head>
      <div className="min-h-screen w-screen flex items-center justify-center flex-col">
        <Logo className="text-xl mb-10" />
        <Card
          ref={card}
          className="w-[350px] relative card overflow-hidden before:absolute before:-z-10 before:pointer-events-none before:top-[var(--mouse-y)] before:left-[var(--mouse-x)] before:h-20 before:w-20 before:rounded-full before:blur-2xl before:bg-primary"
        >
          <div className="m-[1px] rounded-xl bg-background/80">
            <CardHeader className="flex flex-col items-center pointer-events-none">
              <Avatar className="mb-4 h-16 w-16">
                <AvatarImage src={user.image!} />
                <AvatarFallback>{user.name?.charAt(0)}</AvatarFallback>
              </Avatar>
              <CardTitle>{user.name!}</CardTitle>
              <CardDescription>@{user.username}</CardDescription>
            </CardHeader>
            <CardFooter className="flex items-center justify-center gap-2">
              <ProfileEditDialog
                name={user.name ?? ""}
                username={user.username}
                imageUrl={user.image ?? null}
                updatePreview={(data) =>
                  setUser((prev) => ({ ...prev, ...data }))
                }
              />
              <Button variant="secondary" onClick={() => signOut()}>
                Sign out
              </Button>
            </CardFooter>
          </div>
        </Card>
      </div>
    </>
  );
}
