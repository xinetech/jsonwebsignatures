import ed25519 from '@stablelib/ed25519';
import { randomBytes } from 'crypto';
import { exportJWK, base64url } from "jose";


export class JSONWebKey {
    static generate = async() => {
       const seed = randomBytes(32);
       const keys = ed25519.generateKeyPairFromSeed(seed);
       console.log(keys);
       const publicKey = exportJWK(keys.publicKey);
       console.log(publicKey);
       console.log((await publicKey).k);
       console.log(base64url.encode(keys.publicKey));
    }
}