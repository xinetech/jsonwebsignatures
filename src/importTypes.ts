import { Ed25519VerificationKey2018, JsonWebKey2020 } from './types/EdVerificationKey.js';

import { base58 } from './encodings/base58.js';
import { getPublicKeyFromPublicKeyJwk } from './getPublicKeyFromPublicKeyJwk.js';
import { getKeyPairFromPrivateKeyJwk } from './getKeyPairFromPrivateKeyJwk.js';


export const fromJsonWebKey2020 = (
  k: JsonWebKey2020
): { publicKey: Uint8Array; privateKey?: Uint8Array } => {
  const publicKey = getPublicKeyFromPublicKeyJwk(k.publicKeyJwk);
  let privateKey = undefined;
  if (k.privateKeyJwk) {
    ({ privateKey } = getKeyPairFromPrivateKeyJwk(k.privateKeyJwk));
  }
  return { publicKey, privateKey };
};

export const fromX25519KeyAgreementKey2019 = (
  k: Ed25519VerificationKey2018
): { publicKey: Uint8Array; privateKey?: Uint8Array } => {
  const publicKey = base58.decode(k.publicKeyBase58);
  let privateKey = undefined;
  if (k.privateKeyBase58) {
    privateKey = Uint8Array.from(base58.decode(k.privateKeyBase58));
  }
  return { publicKey, privateKey };
};

export const importableTypes = {
  JsonWebKey2020: fromJsonWebKey2020,
  Ed25519VerificationKey2018: fromX25519KeyAgreementKey2019,
};

export const importFromType = (k):{publicKey: Uint8Array; privateKey?: Uint8Array} => {
  if (!importableTypes[k.type]) {
    throw new Error(
      `Cannot import from unsupported type: ${JSON.stringify(k, null, 2)}`
    );
  }
  return importableTypes[k.type](k);
};