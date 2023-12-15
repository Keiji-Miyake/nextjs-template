import bcrypt from "bcrypt";
export const passwordHash = async (password: string) =>
  await bcrypt.hash(password, 10);
