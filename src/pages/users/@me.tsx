import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  HoverCard,
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
// import { mouseHandler } from "@/utils/mouseHandler";
import { ProfileEditDialog } from "@/components/profile-edit-dialog";
import { mouseHandler } from "@/utils/mouseHandler";
import { CheckIcon, Pencil1Icon } from "@radix-ui/react-icons";
import { trpc } from "@/utils/trpc";
import { useToast } from "@/components/ui/use-toast";
import { Spinner } from "@/components/ui/spinner";
import { object } from "@/utils/validation";

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

  return (
    <>
      <Head>
        <title>Profile | postland</title>
      </Head>
      <div className="min-h-screen w-screen flex items-center justify-center flex-col">
        <Logo className="text-xl mb-10" />
        <HoverCard className="mb-4">
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
        </HoverCard>
        <Bio user={user} />
      </div>
    </>
  );
}

export const Bio = ({
  user: { bio, username, name, image },
}: {
  user: Session["user"];
}) => {
  const [currentBio, setCurrentBio] = useState(bio);
  const [isEditing, setIsEditing] = useState(false);

  const inputRef = useRef<HTMLTextAreaElement | null>(null);

  const { toast } = useToast();

  const { mutateAsync, isLoading } = trpc.user.update.useMutation({
    onSuccess({ message }) {
      toast({ description: message });
    },
    onError({ message }) {
      toast({ description: message });
    },
  });

  useEffect(() => {
    if (!inputRef.current) return;
    inputRef.current.style.height = "0px";
    const scrollHeight = inputRef.current.scrollHeight;
    inputRef.current.style.height = scrollHeight + "px";
  }, [currentBio]);

  useEffect(() => {
    if (isEditing || bio === currentBio) return;
    updateBio();
  }, [isEditing]);

  const updateBio = async () => {
    await mutateAsync({
      name: name!,
      username,
      imageUrl: image ?? null,
      bio: currentBio,
    }).catch(console.log);
  };

  return (
    <HoverCard>
      <Button
        onClick={() => setIsEditing((prev) => !prev)}
        size="icon"
        variant="ghost"
        className="absolute top-2 right-2 backdrop-blur"
        disabled={isLoading}
      >
        {isLoading ? <Spinner /> : isEditing ? <CheckIcon /> : <Pencil1Icon />}
      </Button>
      <CardContent className="p-4">
        {isEditing ? (
          <textarea
            ref={inputRef}
            value={currentBio ?? ""}
            onChange={(e) => setCurrentBio(e.currentTarget.value)}
            placeholder="Write something about yourself..."
            className="w-full resize-none bg-transparent outline-none"
          ></textarea>
        ) : (
          currentBio ?? "No bio."
        )}
      </CardContent>
    </HoverCard>
  );
};
