import bs58 from 'bs58';
export const getFingerprintFromPublicKeyBytes = (publicKey) => {
    return bs58.encode(Buffer.from(publicKey.subarray(0, 16)));
};
//# sourceMappingURL=getFingerPrintFromPublicKeyBytes.js.map