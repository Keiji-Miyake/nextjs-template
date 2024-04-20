import { TypeOf } from "zod";

import { signUpSchema } from "./schema";

export type SignUpSchema = TypeOf<typeof signUpSchema>;
