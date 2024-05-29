// SignUpFormコンポーネント
"use client";

import { useState } from "react";

import { z } from "zod";

import customErrorMap from "@/libs/zod";

z.setErrorMap(customErrorMap);

const schema = z.object({
  name: z.string().min(1).max(255),
  email: z.string().email(),
  password: z.string().min(8),
  // .refine(
  //   (value) => {
  //     return /[A-Za-z]/.test(value) && /[0-9]/.test(value) && /[@$!%*?&]/.test(value);
  //   },
  //   {
  //     message: "英字、数字、および記号を含めてください。",
  //   },
  // ),
});

const SignUpForm = () => {
  // フォームの内容を管理するために、useStateフックを使用
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{ name?: string; email?: string; password?: string }>({});

  // フォームの内容に変更があったときに、それぞれの値を更新する関数
  const onChangeName = (event: React.ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value);
  };
  const onChangeEmail = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
  };
  const onChangePassword = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
  };

  // フォームの内容をサーバーに送信する関数
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const form = { name, email, password };
    try {
      schema.parse(form);
    } catch (error) {
      if (error instanceof z.ZodError) {
        console.error(error.issues);
        setErrors(error.formErrors.fieldErrors);
      }
    }

    // /api/registerエンドポイントにPOSTリクエストを送信する
    const response = await fetch("/api/signUp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    // レスポンスのステータスコードが400以上の場合は、エラーを表示する
    if (!response.ok) {
      const error = await response.json();
      console.error(error);
      return;
    }

    setErrors({});
  };

  return (
    <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
      <div className="rounded-md shadow-sm -space-y-px">
        <div>
          <label htmlFor="name" className="sr-only">
            名前
          </label>
          <input
            id="name"
            name="name"
            type="text"
            autoComplete="name"
            onChange={onChangeName}
            required
            className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
            placeholder="名前"
          />
          {errors.name && (
            <p className="mt-2 text-sm text-red-600" id="email-error">
              {errors.name}
            </p>
          )}
        </div>
        <div>
          <label htmlFor="email-address" className="sr-only">
            メールアドレス
          </label>
          <input
            id="email-address"
            name="email"
            type="email"
            autoComplete="email"
            onChange={onChangeEmail}
            required
            className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
            placeholder="メールアドレス"
          />
          {errors.email && (
            <p className="mt-2 text-sm text-red-600" id="email-error">
              {errors.email}
            </p>
          )}
        </div>
        <div>
          <label htmlFor="password" className="sr-only">
            パスワード
          </label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            onChange={onChangePassword}
            required
            className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
            placeholder="パスワード"
          />
        </div>
        {errors.password && (
          <p className="mt-2 text-sm text-red-600" id="email-error">
            {errors.password}
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
