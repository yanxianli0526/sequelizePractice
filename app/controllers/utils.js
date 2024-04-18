import uuidValidate from "uuid-validate";

export const isValidUUID = (value) => {
  const isValidUUID = uuidValidate(value, 4);
  return isValidUUID;
};
