import { JsonWebKey2020 } from './types/JsonWebKey.js';

import { getPublicKeyFromPublicKeyJwk } from './getPublicKeyFromPublicKeyJwk.js';
import { getKeyPairFromJwk } from './getKeyPairFromJwk.js';

export const fromJsonWebKey2020 = (key: JsonWebKey2020): {publicKey:Uint8Array, privateKey:Uint8Array} =>{
   const publicKey = getPublicKeyFromPublicKeyJwk(key.publicKeyJwk);
   let privateKey = undefined;
   if (key.privateKeyJwk) {
     ({ privateKey } = getKeyPairFromJwk(key));
   }
  return { publicKey, privateKey };
}

export const importableTypes: unknown = {
    JsonWebKey2020: fromJsonWebKey2020
  };
  
  export const importFromType = (k): {publicKey: Uint8Array; privateKey?: Uint8Array} => {
    if (!importableTypes[k.type]) {
      throw new Error(
        `Cannot import from unsupported type: ${JSON.stringify(k, null, 2)}`
      );
    }
    return importableTypes[k.type](k);
  };