import bcrypt from "bcrypt";

export async function hashing(plain) {
  return await bcrypt.hash(plain,10);
}