import { MemberBaseSchema } from "../member/schema";

export const signUpSchema = MemberBaseSchema.pick({
  email: true,
});
