import { getPublicKeyFromPublicKeyJwk } from './getPublicKeyFromPublicKeyJwk.js';
import { getKeyPairFromJwk } from './getKeyPairFromJwk.js';
export const fromJsonWebKey2020 = (key) => {
    const publicKey = getPublicKeyFromPublicKeyJwk(key.publicKeyJwk);
    let privateKey = undefined;
    if (key.privateKeyJwk) {
        ({ privateKey } = getKeyPairFromJwk(key));
    }
    return { publicKey, privateKey };
};
export const importableTypes = {
    JsonWebKey2020: fromJsonWebKey2020
};
export const importFromType = (k) => {
    if (!importableTypes[k.type]) {
        throw new Error(`Cannot import from unsupported type: ${JSON.stringify(k, null, 2)}`);
    }
    return importableTypes[k.type](k);
};
//# sourceMappingURL=importTypes.js.map