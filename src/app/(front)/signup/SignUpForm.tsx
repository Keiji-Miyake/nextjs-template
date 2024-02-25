"use client";

import { useRouter } from "next/navigation";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { MemberSignUpSchema, TMemberSignUpSchema } from "@/domains/member/schema";

const SignUpForm = () => {
  const router = useRouter();
  const form = useForm<TMemberSignUpSchema>({
    mode: "onChange",
    resolver: zodResolver(MemberSignUpSchema),
    defaultValues: { email: "" },
  });
  const { errors, isSubmitting } = form.formState;

  const onSubmit = form.handleSubmit(async (data: TMemberSignUpSchema) => {
    try {
      const response = await fetch("/api/signup/sendmail", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      const json = await response.json();

      if (!response.ok) {
        throw json;
      }

      return router.push("/signup/email-sent");
    } catch (error: any) {
      if (error.fieldErrors) {
        Object.entries(error.fieldErrors).forEach(([key, value]) => {
          form.setError(key as keyof TMemberSignUpSchema, {
            message: value as string,
          });
        });
      }

      form.setError("root.serverError", { type: "root", message: error.message });
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
                  <Input type="email" {...field} placeholder="member@example.com" />
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
