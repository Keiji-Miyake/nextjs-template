export type TErrorData = {
  code?: string;
  message: string;
  error: unknown;
  zodErrors?: {
    [x: string]: string[] | undefined;
    [x: number]: string[] | undefined;
    [x: symbol]: string[] | undefined;
  };
  redirect?: string;
};
