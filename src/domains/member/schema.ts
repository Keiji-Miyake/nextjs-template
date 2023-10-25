import { z } from "zod";

import customErrorMap from "@/lib/zodErrorMap";

z.setErrorMap(customErrorMap);

export type TBaseMemberSchema = z.infer<typeof BaseMemberSchema>;
export type TSignUpMemberSchema = z.infer<typeof SignUpMemberSchema>;

// TSignUpMemberSchemaから、confirmPasswordを除外した型を作成する
// https://stackoverflow.com/questions/59115406/how-to-remove-a-property-from-a-type-in-typescript
export type TRegisterMemberSchema = Omit<
  TSignUpMemberSchema,
  "confirmPassword"
>;

export const BaseMemberSchema = z.object({
  memberName: z.string().min(1, "名前を入力してください。"),
  email: z.string().email("メールアドレスを入力してください。"),
  password: z
    .string()
    .regex(
      /^(?=.*?[a-z])(?=.*?[A-Z])(?=.*?\d)[a-zA-Z\d]{8,100}$/,
      "英字大文字小文字・数字を含めて8文字以上で入力してください。",
    ),
});

export const SignUpMemberSchema = BaseMemberSchema.pick({
  email: true,
  password: true,
})
  .merge(
    z.object({
      confirmPassword: z.string().optional(),
    }),
  )
  .refine((data) => data.password === data.confirmPassword, {
    message: "パスワードが一致しません。",
    path: ["confirmPassword"],
  });
