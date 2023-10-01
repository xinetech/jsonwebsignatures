export const getPublicKeyFromPublicKeyJwk = (publicKeyJwk) => {
    return Uint8Array.from(Buffer.from(publicKeyJwk.x, 'base64'));
};
//# sourceMappingURL=getPublicKeyFromPublicKeyJwk.js.map