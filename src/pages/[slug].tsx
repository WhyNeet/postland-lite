import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
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
import { authOptions } from "./api/auth/[...nextauth]";
import Head from "next/head";
import { useState } from "react";
import { ProfileEditDialog } from "@/components/profile-edit-dialog";
import { CheckIcon, ExitIcon, Pencil1Icon } from "@radix-ui/react-icons";
import { trpc } from "@/utils/trpc";
import { useToast } from "@/components/ui/use-toast";
import { Spinner } from "@/components/ui/spinner";
import { TextArea } from "@/components/ui/textarea";
import { prisma } from "@/utils/prisma";
import { useRouter } from "next/router";
import Link from "next/link";
import { InfinitePostsList, PostsList } from "@/components/posts-list";
import { PostsLoader } from "@/components/loader";

export async function getServerSideProps({
  req,
  res,
  query,
}: GetServerSidePropsContext) {
  const session = await getServerSession(req, res, authOptions);
  if (!query.slug) return { props: { session, user: null } };
  const username =
    typeof query.slug === "string"
      ? query.slug.slice(1)
      : query.slug[0].slice(1);

  const user = await prisma.user.findFirst({
    where: { username },
    include: {
      _count: { select: { posts: true, followers: true, following: true } },
    },
  });

  return {
    props: {
      sessionUser: session?.user ?? null,
      user: user
        ? { ...user, createdAt: user?.createdAt.toDateString() }
        : null,
    },
  };
}

export default function User({
  sessionUser,
  user,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const { query } = useRouter();

  if (!user)
    return (
      <div className="h-screen w-screen flex items-center justify-center flex-col">
        <h1 className="text-3xl font-bold mb-4">User not found</h1>
        <p className="text-sm text-muted-foreground">
          Failed to find user{" "}
          <span className="font-semibold">{query.slug}</span>.{" "}
          <Link href="/" className="text-primary font-semibold hover:underline">
            Homepage
          </Link>
        </p>
      </div>
    );

  const isCurrentUser = sessionUser?.id === user.id;

  return (
    <>
      <Head>
        <title>Profile | postland</title>
      </Head>
      <div className="min-h-screen w-screen flex items-center flex-col pt-[20vh] px-5 sm:px-10 lg:px-20 max-w-7xl mx-auto">
        <Logo className="text-xl mb-10" />
        <div className="flex items-stretch justify-stretch gap-2 w-full flex-col lg:flex-row">
          <UserCard sessionUser={user} isEditable={isCurrentUser} />
          <Bio user={user} isEditable={isCurrentUser} />
        </div>
        <UserPostsList userId={sessionUser?.id ?? null} user={user} />
      </div>
    </>
  );
}

const UserPostsList = ({
  user,
  userId,
}: {
  user: NonNullable<
    InferGetServerSidePropsType<typeof getServerSideProps>["user"]
  >;
  userId: string | null;
}) => {
  const {
    data: posts,
    refetch,
    fetchNextPage,
    isFetchingNextPage,
    hasNextPage,
    isError,
  } = trpc.post.getList.useInfiniteQuery(
    { take: 20, fromUser: user.id, withReplies: true },
    {
      getNextPageParam: (_, all) => {
        if (all.at(-1)?.length === 0) return undefined;
        return all.length * 20;
      },
      initialCursor: 0,
    }
  );

  return (
    <div className="w-full">
      {isError && (
        <div className="text-sm text-destructive font-semibold">
          Failed to load this user&apos;s posts.
        </div>
      )}
      <InfinitePostsList
        fetchNextPage={fetchNextPage}
        hasNextPage={hasNextPage}
        isFetchingNextPage={isFetchingNextPage}
        posts={posts as any}
        withReplies
        refetch={refetch}
        userId={user?.id ?? null}
      />
    </div>
  );
};

const UserCard = ({
  sessionUser,
  isEditable,
}: {
  sessionUser: NonNullable<
    InferGetServerSidePropsType<typeof getServerSideProps>["user"]
  >;
  isEditable: boolean;
}) => {
  const [user, setUser] = useState(sessionUser);

  return (
    <HoverCard className="w-full relative card">
      <CardHeader className="flex items-center flex-row gap-6 pointer-events-none">
        <Avatar className="h-20 w-20">
          <AvatarImage src={user.image!} />
          <AvatarFallback>{user.name?.charAt(0)}</AvatarFallback>
        </Avatar>
        <div>
          <CardTitle className="text-lg">{user.name!}</CardTitle>
          <CardDescription>@{user.username}</CardDescription>
        </div>
      </CardHeader>
      <CardFooter className="grid grid-cols-3">
        <div className="text-center">
          <div className="text-lg font-semibold">{user._count.followers}</div>
          <p className="text-sm text-muted-foreground">Followers</p>
        </div>
        <div className="text-center">
          <div className="text-lg font-semibold">{user._count.following}</div>
          <p className="text-sm text-muted-foreground">Following</p>
        </div>
        <div className="text-center">
          <div className="text-lg font-semibold">{user._count.posts}</div>
          <p className="text-sm text-muted-foreground">Posts</p>
        </div>
      </CardFooter>
      {isEditable ? (
        <div className="absolute top-2 right-2 flex gap-2">
          <ProfileEditDialog
            user={user}
            updatePreview={(data) => setUser((prev) => ({ ...prev, ...data }))}
          />
          <Button variant="secondary" size="icon" onClick={() => signOut()}>
            <ExitIcon />
          </Button>
        </div>
      ) : null}
    </HoverCard>
  );
};

export const Bio = ({
  user: { bio, username, name, image },
  isEditable,
}: {
  user: Session["user"];
  isEditable: boolean;
}) => {
  const [currentBio, setCurrentBio] = useState(bio);
  const [isEditing, setIsEditing] = useState(false);

  const { toast } = useToast();

  const { mutateAsync, isLoading } = trpc.user.update.useMutation({
    onSuccess({ message }) {
      toast({ description: message });
    },
    onError({ message }) {
      toast({ description: message });
    },
  });

  const updateBio = async () => {
    if (bio === currentBio) return;
    await mutateAsync({
      name: name!,
      username,
      image: image ?? null,
      bio: currentBio?.trim().length === 0 ? null : currentBio!,
    }).catch(console.log);
  };

  return (
    <HoverCard className="w-full card">
      {isEditable ? (
        <Button
          onClick={() => {
            setIsEditing((prev) => !prev);
            updateBio();
          }}
          size="icon"
          variant="ghost"
          className="absolute top-2 right-2 backdrop-blur"
          disabled={isLoading}
        >
          {isLoading ? (
            <Spinner />
          ) : isEditing ? (
            <CheckIcon />
          ) : (
            <Pencil1Icon />
          )}
        </Button>
      ) : null}
      <CardContent className="p-4">
        {isEditing && isEditable ? (
          <TextArea
            content={currentBio ?? ""}
            onChange={(e) =>
              setCurrentBio(
                e.currentTarget.value.trim().length > 0
                  ? e.currentTarget.value
                  : null
              )
            }
            placeholder="No bio."
            className="mb-[-6px]"
          ></TextArea>
        ) : (
          currentBio ?? <span className="text-muted-foreground">No bio.</span>
        )}
      </CardContent>
    </HoverCard>
  );
};
