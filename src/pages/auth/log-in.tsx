import { Button } from "@/components/ui/button";
import { CrazyLogo } from "@/components/ui/logo";
import { ProviderLogo } from "@/components/logos";
import Head from "next/head";
import { ClientSafeProvider, getProviders, signIn } from "next-auth/react";
import { GetStaticProps } from "next";

export const getStaticProps = (async (context) => {
  const providers = await getProviders();
  return { props: { providers: Object.values(providers!) } };
}) satisfies GetStaticProps<{
  providers: ClientSafeProvider[];
}>;

export default function LogIn({
  providers,
}: {
  providers: ClientSafeProvider[];
}) {
  return (
    <>
      <Head>
        <title>Log in | postland</title>
      </Head>
      <div className="flex items-center justify-center flex-col h-screen">
        <CrazyLogo className="text-3xl mb-10 h-32 w-32" radius={24} />
        <h1 className="scroll-m-20 text-2xl font-semibold tracking-tight mb-2">
          Log in to your account.
        </h1>
        <p className="text-sm text-muted-foreground mb-10">
          Select a login option.
        </p>
        {Object.values(providers!).map((provider) => (
          <Button
            variant="outline"
            className="w-64 mb-2 flex items-center gap-2"
            key={provider.id}
            onClick={() => signIn(provider.id, { callbackUrl: "/" })}
          >
            <ProviderLogo name={provider.name} className="h-4 w-4" />
            {provider.name}
          </Button>
        ))}
      </div>
    </>
  );
}
