// SignUpFormコンポーネント
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { SignUpUserSchema, TSignUpUserSchema } from "@/domains/user/schema";

const SignUpForm = () => {
  // useFormを使ったリクエストを作成する
  const form = useForm<TSignUpUserSchema>({ mode: "onChange", resolver: zodResolver(SignUpUserSchema) });
  const { errors, isSubmitting } = form.formState;
  const onSubmit = form.handleSubmit(async (data: TSignUpUserSchema) => {
    // リクエストを送信する
    await fetch("/api/signUp", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then(async (res) => {
        const result = await res.json();
        console.debug(result);

        if (!res.ok) {
          throw result.error;
        } else {
          if (result.data && result.data.existing) {
            form.setError("root.serverError", { message: "既に登録済みのメールアドレスです。" });
            return;
          }

          //作成成功後、ログインしている状態にする
          await signIn("user", {
            email: result.email,
            password: data.password,
            // redirect: false,
            callbackUrl: "/",
          });
        }
      })
      .catch((error) => {
        console.error("エラー:", error);
        if (error.zodErrors) {
          Object.entries(error.zodErrors).forEach(([key, value]) => {
            form.setError(key as keyof TSignUpUserSchema, {
              message: value as string,
            });
          });
        }

        form.setError("root.serverError", { message: error.messages });
      });
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
                  <Input type="email" {...field} placeholder="user@example.com" />
                </FormControl>
                <FormDescription></FormDescription>
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

export default SignUpForm;
