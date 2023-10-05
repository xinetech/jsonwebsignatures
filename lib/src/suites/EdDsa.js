import * as ed25519 from '@stablelib/ed25519';
// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export const signer = (privateKey) => {
    return {
        async sign({ data }) {
            return ed25519.sign(privateKey, data);
        },
    };
};
// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export const verifier = (publicKey) => {
    return {
        async verify({ data, signature }) {
            let verified = false;
            try {
                verified = ed25519.verify(publicKey, data, signature);
            }
            catch (e) {
                // console.error('An error occurred when verifying signature: ', e);
            }
            return verified;
        },
    };
};
//# sourceMappingURL=EdDsa.js.map