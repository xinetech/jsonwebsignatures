import { getPublicKeyFromPublicKeyJwk } from "./getPublicKeyFromPublicKeyJwk.js";

export const getKeyPairFromPrivateKeyJwk = (privateKeyJwk) => {
  return {
    publicKey: getPublicKeyFromPublicKeyJwk(privateKeyJwk),
    privateKey: Uint8Array.from(
      Buffer.concat([
        Buffer.from(privateKeyJwk.d, 'base64'),
        Buffer.from(privateKeyJwk.x, 'base64'),
      ])
    ),
  };
};
