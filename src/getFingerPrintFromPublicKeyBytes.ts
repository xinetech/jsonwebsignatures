import bs58 from 'bs58';
  
export const getFingerprintFromPublicKeyBytes = (
    publicKey: Uint8Array
  ): string => {
   return bs58.encode(Buffer.from(publicKey.subarray(0,16)));
};