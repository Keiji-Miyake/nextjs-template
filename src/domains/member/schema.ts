import { z } from "zod";

import customErrorMap from "@/lib/zodErrorMap";

z.setErrorMap(customErrorMap);

const MAX_MB = 5;
const MAX_SIZE = 1024 * 1024 * MAX_MB; // 5MB
const ACCEPTED_FILE_TYPES = [
  "image/png",
  "image/jpg",
  "image/jpeg",
  "image/svg+xml",
  "image/webp",
];

export type TBaseMemberSchema = z.infer<typeof BaseMemberSchema>;
export type TSignUpMemberSchema = z.infer<typeof SignUpMemberSchema>;

// TSignUpMemberSchemaから、confirmPasswordを除外した型を作成する
// https://stackoverflow.com/questions/59115406/how-to-remove-a-property-from-a-type-in-typescript
export type TRegisterMemberSchema = Omit<
  TSignUpMemberSchema,
  "confirmPassword"
>;
export type TProfileEditSchema = z.infer<typeof ProfileEditSchema>;
export type TProfilePutSchema = z.infer<typeof ProfilePutSchema>;

export const BaseMemberSchema = z.object({
  id: z.number().int().positive(),
  name: z.string().min(1, "名前を入力してください。").optional(),
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

export const ProfileEditSchema = BaseMemberSchema.pick({
  name: true,
  email: true,
}).merge(
  z.object({
    profileIcon: z
      .custom<FileList>()
      .transform((file) => file[0])
      .refine((file) => file?.size <= MAX_SIZE, {
        message: `ファイルサイズは${MAX_MB}MB以下にしてください。`,
      })
      .refine((file) => ACCEPTED_FILE_TYPES.includes(file?.type), {
        message:
          "ファイル形式が不正です。jpeg, png, svg, webpのいずれかを選択してください。",
      })
      .optional(),
  }),
);

export const ProfilePutSchema = BaseMemberSchema.pick({
  name: true,
  email: true,
}).merge(
  z.object({
    profileIcon: z
      .custom<File>()
      .refine((file) => file?.size <= MAX_SIZE, {
        message: `ファイルサイズは${MAX_MB}MB以下にしてください。`,
      })
      .refine((file) => ACCEPTED_FILE_TYPES.includes(file?.type), {
        message:
          "ファイル形式が不正です。jpeg, png, svg, webpのいずれかを選択してください。",
      })
      .optional(),
  }),
);
