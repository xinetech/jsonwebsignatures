import { ED25519_MULTICODEC_IDENTIFIER, VARIABLE_INTEGER_TRAILING_BYTE, } from './constants.js';
import { base58 } from './encodings/base58.js';
import { base64url } from './encodings/base64url.js';
export const getMultibaseFingerprintFromPublicKeyBytes = (publicKey, encoding = 'base58btc') => {
    const buffer = new Uint8Array(2 + publicKey.length);
    buffer[0] = ED25519_MULTICODEC_IDENTIFIER;
    buffer[1] = VARIABLE_INTEGER_TRAILING_BYTE;
    buffer.set(publicKey, 2);
    if (encoding === 'base58btc') {
        return `z${base58.encode(buffer)}`;
    }
    if (encoding === 'base64url') {
        return `u${base64url.encode(buffer)}`;
    }
    throw new Error('Unsupported encoding: ' + encoding);
};
//# sourceMappingURL=getMultibaseFromPublicKeyBytes.js.map