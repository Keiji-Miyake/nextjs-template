import { Role } from "@prisma/client";
import { z } from "zod";

import { MEMBER_ID_LENGTH } from "@/config/site";
import { customErrorMap, fileSchema } from "@/libs/zod";

z.setErrorMap(customErrorMap);

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
  .extend({
    name: z.string().optional(),
    confirmPassword: z.string().optional(),
    profileIcon: fileSchema(true).optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "パスワードが一致しません。",
    path: ["confirmPassword"],
  });

export const UserCreatePostSchema = UserBaseSchema.pick({
  email: true,
  password: true,
  role: true,
})
  .extend({
    name: z.string().optional(),
    profileIcon: fileSchema(false).optional(),
    confirmPassword: z.string().optional(),
  })
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
}).extend({
  profileIcon: fileSchema(true).optional(),
  useProfileIcon: z.boolean().optional(),
});

export const UserProfilePutSchema = UserProfileEditSchema.merge(
  z.object({
    profileIcon: fileSchema(false).optional(),
  }),
);
