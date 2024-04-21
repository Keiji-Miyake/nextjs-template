import { TypeOf } from "zod";

import { memberRegisterFormSchema, memberRegisterSchema } from "./schema";

export type MemberRegisterFormSchema = TypeOf<typeof memberRegisterFormSchema>;

export type MemberRegisterSchema = TypeOf<typeof memberRegisterSchema>;
