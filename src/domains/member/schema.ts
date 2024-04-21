import { z } from "zod";

import { MEMBER_ID_LENGTH } from "@/config/site";
import { fileSchema } from "@/libs/zod";

export const memberBaseSchema = z.object({
  id: z
    .string()
    .length(
      MEMBER_ID_LENGTH,
      `会員IDは${MEMBER_ID_LENGTH}文字で入力してください。`,
    ),
  email: z.string().email("メールアドレスを入力してください。"),
  name: z.string().optional(),
  logo: z.string().optional(),
  password: z
    .string()
    .regex(
      /^(?=.*?[a-z])(?=.*?[A-Z])(?=.*?\d)[a-zA-Z\d]{8,100}$/,
      "英字大文字小文字・数字を含めて8文字以上で入力してください。",
    ),
});

export const memberRegisterFormSchema = memberBaseSchema
  .pick({
    email: true,
    name: true,
    password: true,
  })
  .extend({
    logo: fileSchema(true).optional(),
    confirmPassword: z.string().optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "パスワードが一致しません。",
    path: ["confirmPassword"],
  });

export const memberRegisterSchema = memberBaseSchema
  .pick({
    email: true,
    name: true,
    password: true,
  })
  .extend({
    logo: fileSchema(false).optional(),
    confirmPassword: z.string().optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "パスワードが一致しません。",
    path: ["confirmPassword"],
  });
