import { Pencil1Icon } from "@radix-ui/react-icons";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { trpc } from "@/utils/trpc";
import { Button } from "./ui/button";
import { SubmitHandler, UseFormRegisterReturn, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Spinner } from "./ui/spinner";
import { HTMLAttributes, forwardRef, useEffect, useState } from "react";
import { profileEditSchema } from "@/server/schema/profileEditSchema";
import { object } from "@/utils/validation";
import { useToast } from "./ui/use-toast";
import { cn } from "@/utils";

export const ProfileEditDialog = ({
  name,
  username,
  imageUrl,
  updatePreview,
}: z.infer<typeof profileEditSchema> & {
  updatePreview?: (data: z.infer<typeof profileEditSchema>) => void;
}) => {
  const { toast } = useToast();

  const { mutateAsync: updateUserAsync, isLoading } =
    trpc.user.update.useMutation({
      onSuccess({ message }) {
        toast({ description: message });
      },
      onError({ message }) {
        toast({ description: message, variant: "destructive" });
      },
    });

  const {
    register,
    formState: { errors },
    handleSubmit,
    watch,
  } = useForm<z.infer<typeof profileEditSchema>>({
    resolver: zodResolver(profileEditSchema),
    defaultValues: { name, username, imageUrl },
  });

  const fields: ProfileEditFieldData[] = [
    {
      name: "name",
      label: "Name",
      registerProps: register("name"),
      error: errors.name?.message,
    },
    {
      name: "username",
      label: "Username",
      registerProps: register("username"),
      error: errors.username?.message,
    },
    {
      name: "imageUrl",
      label: "Avatar URL",
      registerProps: register("imageUrl"),
      error: errors.imageUrl?.message,
    },
  ];

  const onSubmit: SubmitHandler<z.infer<typeof profileEditSchema>> = async (
    data
  ) => {
    await updateUserAsync(data)
      .then(() => {
        setIsOpen(false);
        updatePreview?.(data);
      })
      .catch(() => console.log("an error occured."));
  };

  const [isChanged, setIsChanged] = useState(false);

  useEffect(() => {
    const sub = watch((values) => {
      if (object.equal({ name, username, imageUrl }, values))
        setIsChanged(false);
      else setIsChanged(true);
    });

    return () => sub.unsubscribe();
  }, []);

  const [isOpen, setIsOpen] = useState(false);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon">
          <Pencil1Icon className="h-4 w-4 pointer-events-none" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Update profile.</DialogTitle>
          <DialogDescription>
            Update profile details for everyone to see.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid gap-4 pt-4 mb-8">
            {fields.map((field, idx) => (
              <ProfileEditField {...field} key={idx} />
            ))}
          </div>
          <DialogFooter>
            <Button type="submit" disabled={isLoading || !isChanged}>
              {isLoading ? (
                <Spinner className="h-5 w-5 text-primary-foreground" />
              ) : (
                "Update"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export type ProfileEditFieldData = {
  label: string;
  name: keyof z.infer<typeof profileEditSchema>;
  error?: string;
  registerProps: UseFormRegisterReturn;
};

const ProfileEditField = forwardRef<
  HTMLDivElement,
  HTMLAttributes<HTMLDivElement> & ProfileEditFieldData
>(function ProfileEditField(
  { error, label, name, registerProps, className, ...props },
  ref
) {
  return (
    <div
      className={cn(
        "grid grid-cols-4 items-center gap-4",
        error ? "mb-4" : "",
        className
      )}
      ref={ref}
      {...props}
    >
      <Label htmlFor={name} className="text-right">
        {label}
      </Label>
      <div className="col-span-3 relative">
        <Input id={name} {...registerProps} />
        <span className="text-destructive absolute top-[calc(100%+4px)] left-0 text-xs font-semibold">
          {error}
        </span>
      </div>
    </div>
  );
});
