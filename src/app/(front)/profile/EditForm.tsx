"use client";

import { useRouter } from "next/navigation";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { AppError } from "@/domains/error/class/AppError";
import { TUserProfileEditSchema, UserProfileEditSchema } from "@/domains/user/schema";
import { UserProfile } from "@/domains/user/type";

const EditForm = ({ profile }: { profile: UserProfile }) => {
  const router = useRouter();

  const form = useForm<TUserProfileEditSchema>({
    mode: "onChange",
    resolver: zodResolver(UserProfileEditSchema),
    defaultValues: {
      name: profile.name || "",
      email: profile.email || "",
      profileIcon: profile.profileIcon || undefined,
    },
  });

  const profileIconRef = form.register("profileIcon");

  const { errors, isSubmitting } = form.formState;

  const onSubmit = form.handleSubmit(async (data: TUserProfileEditSchema) => {
    // FormDataを作成する
    const formData = new FormData();
    // dataの各プロパティをFormDataに追加する
    Object.entries(data).forEach(([key, value]) => {
      // もしvalueがFileListだったら、各FileをFormDataに追加する
      if (value instanceof FileList) {
        for (let i = 0; i < value.length; i++) {
          formData.append(key, value[i]);
        }
        return;
      }
      formData.append(key, value as string);
    });

    try {
      const response = await fetch("/api/profile/edit", {
        method: "PUT",
        body: formData,
      });
      const json = await response.json();

      if (!response.ok) {
        throw new AppError(json.code, json.error.message);
      }

      return router.push("/profile");
    } catch (error: any) {
      console.error("エラー:", error);
      if (error.zodErrors) {
        Object.entries(error.zodErrors).forEach(([key, value]) => {
          form.setError(key as keyof TUserProfileEditSchema, {
            message: value as string,
          });
        });
      }

      form.setError("root.serverError", { message: error.message });
    }
  });

  return (
    <Form {...form}>
      <form onSubmit={onSubmit}>
        {errors.root?.serverError && <p className="text-red-400">{errors.root.serverError.message}</p>}
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>名前</FormLabel>
              <FormControl>
                <Input {...field} value={field.value || ""} placeholder="ユーザー名" />
              </FormControl>
              <FormDescription>This is your publid display name.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" {...field} placeholder="user@example.com" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="profileIcon"
          render={({}) => (
            <FormItem>
              <FormLabel>プロフィール画像</FormLabel>
              <FormControl>
                <Input type="file" accept="image/*" {...profileIconRef} value={undefined} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          disabled={isSubmitting}
          className="mt-4 w-full bg-primary hover:ring-2 ring-primary hover:bg-transparent"
        >
          登録
        </Button>
      </form>
    </Form>
  );
};

export default EditForm;
