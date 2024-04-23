"use client";

import { useRouter, useSearchParams } from "next/navigation";

import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { BadRequestError } from "@/domains/error/class/BadRequestError";
import { TUserSignInSchema, UserSignInSchema } from "@/domains/user/schema";

const SignInForm = () => {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") ?? "/";
  const router = useRouter();
  const form = useForm<TUserSignInSchema>({
    mode: "onChange",
    resolver: zodResolver(UserSignInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const { errors, isSubmitting } = form.formState;

  const onSubmit = form.handleSubmit(async (data: TUserSignInSchema) => {
    try {
      const response = await signIn("root", {
        redirect: false,
        callbackUrl: callbackUrl,
        email: data.email,
        password: data.password,
      });
      if (response?.error) {
        console.error("ログイン失敗:", response.error);
        throw new BadRequestError();
      }
      console.log("ログイン成功:", response);
      router.push(callbackUrl);
    } catch (error: any) {
      console.error("ログインエラー:", error);
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
