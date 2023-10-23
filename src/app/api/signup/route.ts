// 会員登録APIのルーティング
// メールアドレスとパスワードを受け取り、会員登録を行う

import { NextRequest, NextResponse } from "next/server";

import bcrypt from "bcrypt";
import { signIn } from "next-auth/react";
import { z } from "zod";

import { prisma } from "@/lib/prisma";
import customErrorMap from "@/lib/zodErrorMap";

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});
z.setErrorMap(customErrorMap);

export async function POST(req: NextRequest) {
  if (req.method !== "POST") {
    return NextResponse.json({ error: "Invalid method" }, { status: 405 });
  }

  const data = await req.json();

  // バリデーション
  try {
    schema.parse(data);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.formErrors.fieldErrors },
        { status: 400 },
      );
    }
    return NextResponse.json({ error: "Invalid data" }, { status: 400 });
  }

  // 会員登録処理
  try {
    const existingOwner = await prisma.owner.findUnique({
      where: { email: data.email },
    });

    // 既に登録されているメールアドレスの場合はエラー
    if (existingOwner) {
      return NextResponse.json(
        { error: "このメールアドレスはすでに登録されております。" },
        { status: 409 },
      );
    }

    // パスワードをハッシュ化
    const hashedPassword = await bcrypt.hash(data.password, 10);

    // データベースに登録
    await prisma.owner.create({
      data: {
        email: data.email,
        password: hashedPassword,
      },
    });

    // NextAuthでログイン済みの状態で返す
    const result = await signIn("owner", {
      redirect: false,
      email: data.email,
      password: data.password,
    });

    // ログインに失敗した場合はエラー
    if (!result) {
      return NextResponse.json(
        { error: "ログインに失敗しました。" },
        { status: 401 },
      );
    }

    // ログインに成功した場合200を返す
    return NextResponse.json({ message: "OK" }, { status: 200 });
  } catch (error: unknown) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  } finally {
    await prisma.$disconnect();
  }
}
