// SignUpFormコンポーネント
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

// import customErrorMap from "@/lib/zodErrorMap";
import { signUpSchema } from "@/schema/signUpSchema";

import type { SignUpFormSchema } from "@/schema/signUpSchema";

// z.setErrorMap(customErrorMap);

const SignUpForm = () => {
  // useFormを使ったリクエストを作成する
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpFormSchema>({ mode: "onChange", resolver: zodResolver(signUpSchema) });
  const onSubmit = handleSubmit((data) => console.log(data));

  // useFormを使ったフォームを作成
  return (
    <form className="mt-8 space-y-6" onSubmit={onSubmit}>
      <div className="rounded-md shadow-sm -space-y-px">
        <div>
          <label htmlFor="name" className="sr-only">
            名前
          </label>
          <input
            id="name"
            type="text"
            autoComplete="name"
            {...register("name")}
            className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
            placeholder="名前"
            required
          />
          {errors.name && (
            <p className="mt-2 text-sm text-red-600" id="email-error">
              {errors.name?.message}
            </p>
          )}
        </div>
        <div>
          <label htmlFor="email-address" className="sr-only">
            メールアドレス
          </label>
          <input
            id="email-address"
            type="email"
            autoComplete="email"
            {...register("email")}
            className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
            placeholder="メールアドレス"
            required
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
            {...register("password")}
            className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
            placeholder="パスワード"
            required
          />
        </div>
        {errors.password && (
          <p className="mt-2 text-sm text-red-600" id="email-error">
            {errors.password?.message}
          </p>
        )}
      </div>

      <div>
        <button
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
