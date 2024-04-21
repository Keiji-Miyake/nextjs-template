import { memberBaseSchema } from "../member/schema";

export const signUpSchema = memberBaseSchema.pick({
  email: true,
});
