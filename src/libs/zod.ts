import { undefined, z } from "zod";

import { ACCEPTED_FILE_TYPES, MAX_FILE_SIZE, MAX_MB } from "@/config/site";

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

z.setErrorMap(customErrorMap);
export default z;

export const fileSchema = (isFileList: boolean) => {
  const base = isFileList
    ? z.custom<FileList>().transform((file) => (file ? file[0] : undefined))
    : z.custom<File>();
  return base
    .refine(
      (file) =>
        file === undefined ||
        (file instanceof File && file.size <= MAX_FILE_SIZE),
      {
        message: `ファイルサイズは${MAX_MB}MB以下にしてください。`,
      },
    )
    .refine(
      (file) =>
        file === undefined ||
        (file instanceof File && ACCEPTED_FILE_TYPES.includes(file.type)),
      {
        message: "png, jpg, jpeg, svg, webpのいずれかの画像を選択してください",
      },
    );
};
