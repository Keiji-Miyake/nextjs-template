import { z } from "zod";

import customErrorMap from "@/lib/zodErrorMap";

z.setErrorMap(customErrorMap);

const LOGO_CONFIG = {
  MAX_MB: 5,
  MAX_SIZE: 1024 * 1024 * 5, // 5MB
  ACCEPTED_FILE_TYPES: [
    "image/png",
    "image/jpg",
    "image/jpeg",
    "image/svg+xml",
    "image/webp",
  ],
};
export const MEMBER_ID_LENGTH = 8;

export type TMemberBaseSchema = z.infer<typeof MemberBaseSchema>;
export type TMemberSignUpSchema = z.infer<typeof MemberSignUpSchema>;
export type TMemberSignInSchema = z.infer<typeof MemberSignInSchema>;
export type TMemberRegisterFormSchema = z.infer<
  typeof MemberRegisterFormSchema
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

export const MemberSignInSchema = MemberBaseSchema.pick({
  email: true,
  password: true,
});

export const MemberRegisterFormSchema = MemberBaseSchema.pick({
  email: true,
  name: true,
  password: true,
})
  .merge(
    z.object({
      logo: z
        .custom<FileList>()
        .transform((file) => file[0])
        .refine((file) => file?.size <= LOGO_CONFIG.MAX_SIZE, {
          message: `ファイルサイズは${LOGO_CONFIG.MAX_MB}MB以下にしてください。`,
        })
        .refine(
          (file) => LOGO_CONFIG.ACCEPTED_FILE_TYPES.includes(file?.type),
          {
            message:
              "ファイル形式が不正です。jpeg, png, svg, webpのいずれかを選択してください。",
          },
        )
        .optional(),
      confirmPassword: z.string().optional(),
    }),
  )
  .refine((data) => data.password === data.confirmPassword, {
    message: "パスワードが一致しません。",
    path: ["confirmPassword"],
  });

export const MemberRegisterPostSchema = MemberBaseSchema.pick({
  email: true,
  name: true,
  password: true,
})
  .merge(
    z.object({
      logo: z
        .custom<File>()
        .refine((file) => file?.size <= LOGO_CONFIG.MAX_SIZE, {
          message: `ファイルサイズは${LOGO_CONFIG.MAX_MB}MB以下にしてください。`,
        })
        .refine(
          (file) => LOGO_CONFIG.ACCEPTED_FILE_TYPES.includes(file?.type),
          {
            message:
              "ファイル形式が不正です。jpeg, png, svg, webpのいずれかを選択してください。",
          },
        )
        .optional(),
      confirmPassword: z.string().optional(),
    }),
  )
  .refine((data) => data.password === data.confirmPassword, {
    message: "パスワードが一致しません。",
    path: ["confirmPassword"],
  });
