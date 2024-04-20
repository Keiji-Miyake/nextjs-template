"use client";

import { useRouter } from "next/navigation";

import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { MemberRegisterFormSchema, TMemberRegisterFormSchema } from "@/domains/member/schema";

const RegisterForm = ({ email }: { email: string }) => {
  const router = useRouter();
  const form = useForm<TMemberRegisterFormSchema>({
    mode: "onChange",
    resolver: zodResolver(MemberRegisterFormSchema),
    defaultValues: {
      email: email,
      name: "",
      logo: undefined,
      password: "",
      confirmPassword: "",
    },
    values: {
      email: email,
      name: "",
      logo: undefined,
      password: "",
      confirmPassword: "",
    },
  });
  const logoRef = form.register("logo");
  const { errors, isSubmitting } = form.formState;

  // useFormのhandleSubmitを使ってフォームを送信する
  const onSubmit = form.handleSubmit(async (data: TMemberRegisterFormSchema) => {
    const formData = new FormData();
    // dataの各プロパティをFormDataに追加する
    Object.entries(data).forEach(([key, value]) => {
      if (value === undefined) return;
      // もしvalueがFileListだったら、各FileをFormDataに追加する
      if (value instanceof FileList) {
        for (let i = 0; i < value.length; i++) {
          formData.append(key, value[i]);
        }
        return;
      }
      formData.append(key, value as string | Blob);
    });

    try {
      // リクエストを送信する
      const response = await fetch("/api/v1/member", {
        method: "POST",
        body: formData,
      });

      const json = await response.json();
      if (!response.ok) {
        throw json;
      }

      //作成成功後、ログインしている状態にする
      const signInResponse = await signIn("root", {
        email: json?.data.email,
        password: data.password,
        redirect: false,
      });
      console.debug("signInResponse", signInResponse);

      if (signInResponse?.error) {
        router.push("/signin");
      }

      router.push("/");
    } catch (error: any) {
      if (error.fieldErrors) {
        Object.entries(error.fieldErrors).forEach(([key, value]) => {
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
                <FormDescription>This is your public display name.</FormDescription>
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
                  <Input type="file" accept="image/*" {...logoRef} />
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
                <FormLabel>パスワード確認</FormLabel>
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
