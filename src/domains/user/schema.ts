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

export const MEMBER_ID_LENGTH = 8;

export type TBaseUserSchema = z.infer<typeof BaseUserSchema>;
export type TSignUpUserSchema = z.infer<typeof SignUpUserSchema>;
export type TSignInUserSchema = z.infer<typeof SignInUserSchema>;
export type TRegisterUserSchema = Pick<
  TBaseUserSchema,
  "memberId" | "email" | "password"
>;
export type TProfileEditSchema = z.infer<typeof ProfileEditSchema>;
export type TProfilePutSchema = z.infer<typeof ProfilePutSchema>;

export const BaseUserSchema = z.object({
  id: z.number().int().positive(),
  memberId: z
    .string()
    .length(
      MEMBER_ID_LENGTH,
      `会員IDは${MEMBER_ID_LENGTH}文字で入力してください。`,
    ),
  name: z.string().min(1, "名前を入力してください。").optional(),
  email: z.string().email("メールアドレスを入力してください。"),
  password: z
    .string()
    .regex(
      /^(?=.*?[a-z])(?=.*?[A-Z])(?=.*?\d)[a-zA-Z\d]{8,100}$/,
      "英字大文字小文字・数字を含めて8文字以上で入力してください。",
    ),
});

export const SignUpUserSchema = BaseUserSchema.pick({
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

export const SignInUserSchema = BaseUserSchema.pick({
  email: true,
  password: true,
});

export const ProfileEditSchema = BaseUserSchema.pick({
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

export const ProfilePutSchema = BaseUserSchema.pick({
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
