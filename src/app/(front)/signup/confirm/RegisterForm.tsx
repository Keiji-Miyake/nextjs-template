"use client";

import { useSearchParams } from "next/navigation";

import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import { useForm } from "react-hook-form";
import useSWR from "swr";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { AppError } from "@/domains/error/class/AppError";
import { MemberRegisterFormSchema, TMemberRegisterFormSchema } from "@/domains/member/schema";

const fetcher = async (url: string, token: string | null) => {
  if (!token) throw new AppError("BAD_REQUEST", "トークンがありません。");
  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "X-Auth-Token": token,
      },
    });
    const payload = await response.json();
    console.debug("会員申込情報取得:", payload);
    if (!response.ok) {
      throw new AppError(payload.error.code, payload.error.messages, payload.error.redirect);
    }
    return payload.data;
  } catch (error) {
    console.error("申込トークンエラー:", error);
    throw error;
  }
};

const RegisterForm = () => {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const { data, error, isLoading } = useSWR(["/api/signup/verify-registration-token", token], ([url, token]) =>
    fetcher(url, token),
  );
  const form = useForm<TMemberRegisterFormSchema>({
    mode: "onChange",
    resolver: zodResolver(MemberRegisterFormSchema),
    defaultValues: {},
    values: {
      email: data?.email,
      password: "",
      confirmPassword: "",
    },
  });
  const logoRef = form.register("logo");
  const { errors, isSubmitting } = form.formState;
  // useFormを使ったリクエストを作成する
  if (isLoading) return <div>Loading...</div>;
  if (error) throw error;

  const onSubmit = form.handleSubmit(async (data: TMemberRegisterFormSchema) => {
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
    try {
      const response = await fetch("/api/signup", {
        method: "POST",
        body: formData,
      });
      const payload = await response.json();
      console.debug("会員登録APIレスポンス:", payload);
      if (!response.ok) {
        throw payload.error;
      }

      //作成成功後、ログインしている状態にする
      await signIn("user", {
        email: payload.email,
        password: data.password,
        // redirect: false,
        callbackUrl: "/",
      });
    } catch (error: any) {
      console.error("新規登録APIエラー:", error);
      if (error.zodErrors) {
        Object.entries(error.zodErrors).forEach(([key, value]) => {
          form.setError(key as keyof TMemberRegisterFormSchema, {
            message: value as string,
          });
        });
      }

      form.setError("root.serverError", { message: error.messages });
    }
  });

  // useFormを使ったフォームを作成
  return (
    <Form {...form}>
      <form className="mt-8 space-y-6" onSubmit={onSubmit}>
        <div>
          {errors.root?.serverError && (
            <div className="mt-2 text-sm text-red-600" id="server-error">
              <p>{errors.root.serverError.message}</p>
            </div>
          )}
        </div>

        <div className="rounded-md shadow-sm -space-y-px">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>メールアドレス</FormLabel>
                <FormControl>
                  <Input
                    className="cursor-pointer focus-visible:ring-transparent"
                    readOnly
                    type="email"
                    {...field}
                    placeholder="user@example.com"
                  />
                </FormControl>
                <FormDescription></FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

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
            name="logo"
            render={({}) => (
              <FormItem>
                <FormLabel>プロフィール画像</FormLabel>
                <FormControl>
                  <Input type="file" accept="image/*" {...logoRef} value={undefined} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>パスワード</FormLabel>
                <FormControl>
                  <Input type="password" {...field} />
                </FormControl>
                <FormDescription></FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>パスワード</FormLabel>
                <FormControl>
                  <Input type="password" {...field} />
                </FormControl>
                <FormDescription></FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div>
          <Button disabled={isSubmitting} type="submit">
            送信
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default RegisterForm;
