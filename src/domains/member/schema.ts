import { z } from "zod";

import { MEMBER_ID_LENGTH } from "@/config/site";
import { customErrorMap, fileSchema } from "@/libs/zod";

z.setErrorMap(customErrorMap);

export type TMemberBaseSchema = z.infer<typeof MemberBaseSchema>;
export type TMemberSignUpSchema = z.infer<typeof MemberSignUpSchema>;
export type TMemberRegisterFormSchema = z.infer<
  typeof MemberRegisterFormSchema
>;
export type TMemberRegisterPostSchema = z.infer<
  typeof MemberRegisterPostSchema
>;

export const MemberBaseSchema = z.object({
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

export const MemberSignUpSchema = MemberBaseSchema.pick({
  email: true,
});

export const MemberRegisterFormSchema = MemberBaseSchema.pick({
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

export const MemberRegisterPostSchema = MemberBaseSchema.pick({
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
