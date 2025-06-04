export const decodeBase64 = (content: string) => {
  return Buffer.from(content, 'base64').toString('utf-8');
};
