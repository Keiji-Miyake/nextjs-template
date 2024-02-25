"use client";

import { useRouter } from "next/navigation";

import { zodResolver } from "@hookform/resolvers/zod";
import { Role } from "@prisma/client";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { TUserCreateFormSchema, UserCreateFormSchema } from "@/domains/user/schema";
import { ROLE_NAME } from "@/domains/user/type";

const CreateForm = () => {
  const router = useRouter();
  const form = useForm<TUserCreateFormSchema>({
    mode: "onChange",
    resolver: zodResolver(UserCreateFormSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      role: Role.MEMBER,
      profileIcon: undefined,
    },
  });
  const profileIconRef = form.register("profileIcon");
  const { errors, isSubmitting } = form.formState;

  const onSubmit = async (data: TUserCreateFormSchema) => {
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
      formData.append(key, value as string);
    });

    try {
      // リクエストを送信する
      const response = await fetch("/api/users/create", {
        method: "POST",
        body: formData,
      });
      const json = await response.json();
      if (!response.ok) {
        throw json;
      }

      router.push("/member/users/");
      router.refresh();
    } catch (error: any) {
      console.error("ユーザー登録エラー:", error);
      if (error.fieldErrors) {
        Object.entries(error.fieldErrors).forEach(([key, value]) => {
          form.setError(key as keyof TUserCreateFormSchema, {
            message: value as string,
          });
        });
      }

      form.setError("root.serverError", { message: error.message });
    }
  };

  return (
    <Form {...form}>
      <form className="mt-8 space-y-6" onSubmit={form.handleSubmit((data) => onSubmit(data))}>
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
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>名前</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="ユーザー名" />
                </FormControl>
                <FormDescription>表示される名前です。</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

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
                <FormLabel>パスワード確認</FormLabel>
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
            name="role"
            render={({ field }) => (
              <FormItem className="space-y-3">
                <FormLabel>権限</FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    className="flex flex-col space-y-1"
                  >
                    {Object.entries(ROLE_NAME).map(([value, name], index) => {
                      return (
                        <FormItem key={index} className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value={value} />
                          </FormControl>
                          <FormLabel className="font-normal">{name}</FormLabel>
                        </FormItem>
                      );
                    })}
                  </RadioGroup>
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
                  <Input type="file" accept="image/*" {...profileIconRef} />
                </FormControl>
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

export default CreateForm;
