import { getPublicKeyFromPublicKeyJwk } from "./getPublicKeyFromPublicKeyJwk.js";
export const getKeyPairFromJwk = (keypair) => {
    return {
        publicKey: getPublicKeyFromPublicKeyJwk(keypair.publicKeyJwk),
        privateKey: Uint8Array.from(Buffer.concat([
            Buffer.from(keypair.privateKeyJwk.d, 'base64'),
            Buffer.from(keypair.publicKeyJwk.x, 'base64'),
        ])),
    };
};
//# sourceMappingURL=getKeyPairFromJwk.js.map