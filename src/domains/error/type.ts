import { User } from "@prisma/client";

import { ErrorInfo } from "@/config/error";

export type TFetchUsersPageResult = {
  success: boolean;
  users?: User[] | null;
  totalCount?: number;
  errorInfo?: ErrorInfo;
};
