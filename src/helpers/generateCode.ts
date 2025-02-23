import { v4 as uuidv4 } from "uuid";

export const generateCode = () => {
  return uuidv4().split("-").pop();
};
