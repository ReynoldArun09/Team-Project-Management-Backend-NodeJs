import bcrypt from "bcryptjs";

export const generateHashValue = (password: string, salt = 10) => {
  return bcrypt.hash(password, salt);
};

export const compareHashValue = (enteredPassword: string, userPassword: string) => {
  return bcrypt.compare(enteredPassword, userPassword);
};
