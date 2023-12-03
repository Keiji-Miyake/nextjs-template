"use client";

import { useRouter } from "next/navigation";

import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { SignInMemberSchema, TSignInMemberSchema } from "@/domains/member/schema";

const SignInForm = () => {
  const router = useRouter();
  const form = useForm<TSignInMemberSchema>({
    mode: "onChange",
    resolver: zodResolver(SignInMemberSchema),
  });
  const { errors, isSubmitting } = form.formState;

  const onSubmit = form.handleSubmit(async (data: TSignInMemberSchema) => {
    try {
      await signIn("member", {
        redirect: false,
        email: data.email,
        password: data.password,
      }).then((res) => {
        if (res?.error) {
          console.error("ログイン失敗:", res.error);
          throw new Error("ログインに失敗しました。メールアドレスかパスワードが間違っています。");
        } else {
          router.push("/");
        }
      });
    } catch (error: any) {
      console.error("エラー:", error);
      form.setError("root.serverError", { message: error.message });
    }
  });

  return (
    <Form {...form}>
      <form onSubmit={onSubmit}>
        {errors.root?.serverError && <p className="text-red-400">{errors.root.serverError.message}</p>}
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>メールアドレス</FormLabel>
              <FormControl>
                <Input {...field} placeholder="user@example.com" />
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
        <Button disabled={isSubmitting}>ログイン</Button>
      </form>
    </Form>
  );
};

export default SignInForm;
