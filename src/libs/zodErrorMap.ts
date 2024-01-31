import { z } from "zod";

const customErrorMap: z.ZodErrorMap = (issue, ctx) => {
  switch (issue.code) {
    case z.ZodIssueCode.too_small:
      return { message: `${issue.minimum}文字以上を入力してください。` };
    case z.ZodIssueCode.too_big:
      return { message: `${issue.maximum}文字以内で入力してください。` };
    case z.ZodIssueCode.invalid_string:
      return { message: "正しい形式で入力してください。" };
  }
  return { message: ctx.defaultError };
};

export default customErrorMap;
