import { AppErrorConfig } from "./config";

export type AppErrorCode = keyof typeof AppErrorConfig;

export type TErrorData = {
  code?: string;
  messages: string[];
  zodErrors?: {
    [x: string]: string[] | undefined;
    [x: number]: string[] | undefined;
    [x: symbol]: string[] | undefined;
  };
};
