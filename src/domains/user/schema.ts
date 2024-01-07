import { Role } from "@prisma/client";
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

export type TUserBaseSchema = z.infer<typeof UserBaseSchema>;
export type TUserCreateFormSchema = z.infer<typeof UserCreateFormSchema>;
export type TUserCreatePostSchema = z.infer<typeof UserCreatePostSchema>;
export type TUserSignInSchema = z.infer<typeof UserSignInSchema>;
export type TUserProfileEditSchema = z.infer<typeof UserProfileEditSchema>;
export type TUserProfilePutSchema = z.infer<typeof UserProfilePutSchema>;

export const UserBaseSchema = z.object({
  memberId: z.string().length(MEMBER_ID_LENGTH, "不正な値です。"),
  name: z.string().nullish(),
  email: z.string().email("メールアドレスを入力してください。"),
  password: z
    .string()
    .regex(
      /^(?=.*?[a-z])(?=.*?[A-Z])(?=.*?\d)[a-zA-Z\d]{8,100}$/,
      "英字大文字小文字・数字を含めて8文字以上で入力してください。",
    ),
  role: z.nativeEnum(Role),
  authToken: z.string().nullish(),
  profileIcon: z.string().nullish(),
});

export const UserCreateFormSchema = UserBaseSchema.pick({
  email: true,
  password: true,
  role: true,
})
  .merge(
    z.object({
      name: z.string().optional(),
      confirmPassword: z.string().optional(),
      profileIcon: z
        .custom<FileList>()
        .transform((file) => file[0])
        .refine((file) => file === undefined || file?.size <= MAX_SIZE, {
          message: `ファイルサイズは${MAX_MB}MB以下にしてください。`,
        })
        .refine(
          (file) =>
            file === undefined || ACCEPTED_FILE_TYPES.includes(file?.type),
          {
            message:
              "ファイル形式が不正です。jpeg, png, svg, webpのいずれかを選択してください。",
          },
        )
        .optional(),
    }),
  )
  .refine((data) => data.password === data.confirmPassword, {
    message: "パスワードが一致しません。",
    path: ["confirmPassword"],
  });

export const UserCreatePostSchema = UserBaseSchema.pick({
  email: true,
  password: true,
  role: true,
})
  .merge(
    z.object({
      name: z.string().optional(),
      confirmPassword: z.string().optional(),
      profileIcon: z
        .custom<File>()
        .refine((file) => typeof file === "string" || file?.size <= MAX_SIZE, {
          message: `ファイルサイズは${MAX_MB}MB以下にしてください。`,
        })
        .refine(
          (file) =>
            typeof file === "string" ||
            ACCEPTED_FILE_TYPES.includes(file?.type),
          {
            message:
              "ファイル形式が不正です。jpeg, png, svg, webpのいずれかを選択してください。",
          },
        )
        .optional(),
    }),
  )
  .refine((data) => data.password === data.confirmPassword, {
    message: "パスワードが一致しません。",
    path: ["confirmPassword"],
  });

export const UserSignInSchema = UserBaseSchema.pick({
  email: true,
  password: true,
});

export const UserProfileEditSchema = UserBaseSchema.pick({
  name: true,
  email: true,
}).merge(
  z.object({
    profileIcon: z
      .custom<FileList>()
      .transform((file) => file[0])
      .refine((file) => file === undefined || file?.size <= MAX_SIZE, {
        message: `ファイルサイズは${MAX_MB}MB以下にしてください。`,
      })
      .refine(
        (file) =>
          file === undefined || ACCEPTED_FILE_TYPES.includes(file?.type),
        {
          message:
            "ファイル形式が不正です。jpeg, png, svg, webpのいずれかを選択してください。",
        },
      ),
  }),
);

export const UserProfilePutSchema = UserProfileEditSchema.merge(
  z.object({
    profileIcon: z
      .custom<File>()
      .refine((file) => typeof file === "string" || file?.size <= MAX_SIZE, {
        message: `ファイルサイズは${MAX_MB}MB以下にしてください。`,
      })
      .refine(
        (file) =>
          typeof file === "string" || ACCEPTED_FILE_TYPES.includes(file?.type),
        {
          message:
            "ファイル形式が不正です。jpeg, png, svg, webpのいずれかを選択してください。",
        },
      ),
  }),
);
