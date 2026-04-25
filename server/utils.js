//not needed for now, but may be useful in the future
export const base64ToBuffer = (base64) => {
  const data = base64.replace(/^data:image\/\w+;base64,/, "");
  return Buffer.from(data, "base64");
};