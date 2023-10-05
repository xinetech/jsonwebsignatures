import { Ed25519KeyPair } from "./ed25519Keypair.js";
import crypto from 'crypto';
import { JWS } from '@transmute/jose-ld';
/*import {
    JsonWebKey2020
  } from '@transmute/web-crypto-key-pair';
  
  export { JsonWebKey2020 };*/
const getKeyPairForKtyAndCrv = (kty, crv) => {
    if (kty === 'OKP') {
        if (crv === 'Ed25519') {
            return Ed25519KeyPair;
        }
    }
    throw new Error(`getKeyPairForKtyAndCrv does not support: ${kty} and ${crv}`);
};
const getKeyPairForType = (k) => {
    if (k.type === 'JsonWebKey2020') {
        return getKeyPairForKtyAndCrv(k.publicKeyJwk.kty, k.publicKeyJwk.crv);
    }
    if (k.type === 'Ed25519VerificationKey2018') {
        return Ed25519KeyPair;
    }
    throw new Error('getKeyPairForType does not support type: ' + k.type);
};
const getVerifier = async (k, options = { detached: true }) => {
    const { publicKeyJwk } = await k.export({ type: 'JsonWebKey2020' });
    const { kty, crv } = publicKeyJwk;
    if (kty === 'OKP') {
        if (crv === 'Ed25519') {
            return JWS.createVerifier(k.verifier('EdDsa'), 'EdDSA', options);
        }
    }
    throw new Error(`getVerifier does not suppport ${JSON.stringify(publicKeyJwk, null, 2)}`);
};
const getSigner = async (k, options = { detached: true }) => {
    const { publicKeyJwk } = await k.export({ type: 'JsonWebKey2020' });
    const { kty, crv } = publicKeyJwk;
    if (kty === 'OKP') {
        if (crv === 'Ed25519') {
            return JWS.createSigner(k.signer('EdDsa'), 'EdDSA', options);
        }
    }
    throw new Error(`getSigner does not suppport ${JSON.stringify(publicKeyJwk, null, 2)}`);
};
const applyJwa = async (k, options) => {
    const verifier = await getVerifier(k, options);
    k.verifier = () => verifier;
    if (k.privateKey) {
        const signer = await getSigner(k, options);
        k.signer = () => signer;
    }
    return k;
};
const useJwa = async (k, options) => {
    k.useJwa = async (options) => {
        return applyJwa(k, options);
    };
    return applyJwa(k, options);
};
export class JsonWebKey {
    id;
    type;
    controller;
    static generate = async (options = {
        kty: 'OKP',
        crv: 'Ed25519',
        detached: true,
        secureRandom: undefined
    }) => {
        const KeyPair = getKeyPairForKtyAndCrv(options.kty, options.crv);
        if (!options.secureRandom) {
            options.secureRandom = () => {
                return crypto.randomBytes(32);
            };
        }
        const kp = await KeyPair.generate({
            //kty: options.kty,
            //crvOrSize: options.crv,
            secureRandom: options.secureRandom
        });
        const { detached } = options;
        return useJwa(kp, { detached });
    };
    static from = async (k, options = { detached: true, header: undefined }) => {
        const KeyPair = getKeyPairForType(k);
        const kp = await KeyPair.from(k);
        // eslint-disable-next-line prefer-const
        let { detached, header } = options;
        if (detached === undefined) {
            detached = true;
        }
        return useJwa(kp, { detached, header });
    };
    signer;
    verifier;
}
//# sourceMappingURL=JsonWebKey.js.map