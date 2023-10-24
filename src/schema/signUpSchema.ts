import { z } from "zod";

import customErrorMap from "@/lib/zodErrorMap";

z.setErrorMap(customErrorMap);

export type SignUpFormSchema = z.infer<typeof signUpSchema>;

export const signUpSchema = z.object({
  name: z.string().min(1).max(255),
  email: z.string().email("メールアドレスを入力してください。"),
  password: z
    .string()
    .regex(
      /^(?=.*?[a-z])(?=.*?[A-Z])(?=.*?\d)[a-zA-Z\d]{8,100}$/,
      "英字大文字小文字・数字を含めて8文字以上で入力してください。",
    ),
});
