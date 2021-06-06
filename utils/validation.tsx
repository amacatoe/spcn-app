export const validateEmail = (value: string):boolean => {
  let reg = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
  return reg.test(value);
}