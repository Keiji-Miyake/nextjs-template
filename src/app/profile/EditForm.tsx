"use client";

import { useRouter } from "next/navigation";

import { zodResolver } from "@hookform/resolvers/zod";
import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { ProfileEditSchema, TProfileEditSchema } from "@/domains/member/schema";
import { useMember } from "@/hooks/useMember";

const EditForm = () => {
  const router = useRouter();
  // セッションデータの取得
  const { data: session, status } = useSession();
  useEffect(() => {
    if (status === "loading") return; // ローディング中は何もしない
    if (!session) {
      router.push("/login"); // セッションが存在しない場合はログインページにリダイレクト
    }
  }, [session, status, router]);

  // ログイン中（自身）のユーザーの会員情報を取得する
  const { member, isLoading, isError } = useMember(session?.user?.id);
  console.debug("member:", member);

  // useFormを使ったリクエストを作成する
  const form = useForm<TProfileEditSchema>({
    mode: "onChange",
    resolver: zodResolver(ProfileEditSchema),
    defaultValues: {
      name: "",
      email: "",
      profileIcon: undefined,
    },
    values: {
      name: member?.name ?? "",
      email: member?.email ?? "",
      profileIcon: member?.profileIcon ?? undefined,
    },
  });

  const profileIconRef = form.register("profileIcon");

  const { errors, isSubmitting } = form.formState;

  const onSubmit = form.handleSubmit(async (data: TProfileEditSchema) => {
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

    // リクエストを送信する
    await fetch("/api/profile/edit", {
      method: "PUT",
      body: formData,
    })
      .then(async (res) => {
        const result = await res.json();
        console.debug(result);

        if (!res.ok) {
          throw result.error;
        } else {
          router.push("/");
        }
      })
      .catch((error) => {
        console.error("エラー:", error);
        if (error.zodErrors) {
          Object.entries(error.zodErrors).forEach(([key, value]) => {
            form.setError(key as keyof TProfileEditSchema, {
              message: value as string,
            });
          });
        }

        form.setError("root.serverError", { message: error.messages });
      });
  });

  if (isError) return <div>{isError}</div>;
  if (isLoading) return <div>Loading...</div>;
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
                <Input {...field} placeholder="会員名" />
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
                <Input type="email" {...field} placeholder="member@example.com" />
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
