export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validateRequired = (value: string): boolean => {
  return value.trim().length > 0;
};

export const validateNumber = (value: string): boolean => {
  return !isNaN(Number(value)) && Number(value) >= 0;
};

export const validateQuantity = (value: number): boolean => {
  return value > 0 && Number.isInteger(value);
};

export const validatePassword = (password: string): boolean => {
  return password.length >= 6;
};
