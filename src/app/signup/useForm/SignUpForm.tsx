// SignUpFormコンポーネント
"use client";

import { useRouter } from "next/navigation";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { SignUpMemberSchema, TSignUpMemberSchema } from "@/domains/member/schema";

const SignUpForm = () => {
  const router = useRouter();
  // useFormを使ったリクエストを作成する
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
    // reset,
  } = useForm<TSignUpMemberSchema>({ mode: "onChange", resolver: zodResolver(SignUpMemberSchema) });

  const onSubmit = handleSubmit(async (data: TSignUpMemberSchema) => {
    // リクエストを送信する
    await fetch("/api/signup", {
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
            setError("root.serverError", { message: "既に登録済みのメールアドレスです。" });
            return;
          }
          router.push("/");
        }
      })
      .catch((error) => {
        console.error("エラー:", error);
        if (error.zodErrors) {
          Object.entries(error.zodErrors).forEach(([key, value]) => {
            setError(key as keyof TSignUpMemberSchema, {
              message: value as string,
            });
          });
        }

        setError("root.serverError", { message: error.messages });
      });
  });

  // useFormを使ったフォームを作成
  return (
    <form className="mt-8 space-y-6" onSubmit={onSubmit}>
      <div>
        {errors.root?.serverError && (
          <div className="mt-2 text-sm text-red-600" id="server-error">
            <p>{errors.root.serverError.message}</p>
          </div>
        )}
      </div>

      <div className="rounded-md shadow-sm -space-y-px">
        <div>
          <label htmlFor="email-address" className="sr-only">
            メールアドレス
          </label>
          <input
            id="email-address"
            type="email"
            autoComplete="email"
            className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
            placeholder="メールアドレス"
            {...register("email")}
          />
          {errors.email && (
            <p className="mt-2 text-sm text-red-600" id="email-error">
              {errors.email?.message}
            </p>
          )}
        </div>
        <div>
          <label htmlFor="password" className="sr-only">
            パスワード
          </label>
          <input
            id="password"
            type="password"
            autoComplete="current-password"
            className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
            placeholder="パスワード"
            {...register("password")}
          />
          {errors.password && (
            <p className="mt-2 text-sm text-red-600" id="email-error">
              {errors.password?.message}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="confirmPassword" className="sr-only">
            パスワード確認
          </label>
          <input
            id="confirmPassword"
            type="password"
            autoComplete="current-password"
            className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
            placeholder="パスワード確認"
            {...register("confirmPassword")}
          />
          {errors.confirmPassword && (
            <p className="mt-2 text-sm text-red-600" id="email-error">
              {errors.confirmPassword?.message}
            </p>
          )}
        </div>
      </div>

      <div>
        <button
          disabled={isSubmitting}
          type="submit"
          className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700  focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          送信
        </button>
      </div>
    </form>
  );
};

export default SignUpForm;
