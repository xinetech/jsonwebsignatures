import * as ed25519 from '@stablelib/ed25519';
import { exportableTypes } from "./exportTypes.js";
import { getMultibaseFingerprintFromPublicKeyBytes } from "./getMultibaseFromPublicKeyBytes.js";
import { ED25519_MULTICODEC_IDENTIFIER, VARIABLE_INTEGER_TRAILING_BYTE } from "./constants.js";
import { base58 } from "./encodings/base58.js";
import { importFromType } from "./importTypes.js";
import { X25519KeyPair } from '@transmute/x25519-key-pair';
import { suiteTypes } from './suites/index.js';
export class Ed25519KeyPair {
    id;
    type = 'JsonWebKey2020';
    controller;
    publicKey;
    privateKey;
    static async fingerprintFromPublicKey(importableType) {
        const { publicKey } = await Ed25519KeyPair.from(importableType);
        return getMultibaseFingerprintFromPublicKeyBytes(publicKey);
    }
    static async toX25519KeyPair(kp) {
        const publicKey = ed25519.convertPublicKeyToX25519(kp.publicKey);
        let privateKey = undefined;
        if (kp.privateKey) {
            privateKey = ed25519.convertSecretKeyToX25519(kp.privateKey);
        }
        const nk = new X25519KeyPair({
            id: '',
            type: 'X25519KeyAgreementKey2019',
            controller: kp.controller,
            publicKey,
            privateKey,
        });
        nk.id = kp.controller + '#' + (await nk.fingerprint());
        return nk;
    }
    static generate = async ({ secureRandom, }) => {
        const key = ed25519.generateKeyPair({
            isAvailable: true,
            randomBytes: secureRandom,
        });
        const fingerprint = getMultibaseFingerprintFromPublicKeyBytes(key.publicKey);
        const controller = `did:key:${fingerprint}`;
        const id = `${controller}#${fingerprint}`;
        return new Ed25519KeyPair({
            id: id,
            type: 'JsonWebKey2020',
            controller: controller,
            publicKey: key.publicKey,
            privateKey: key.secretKey,
        });
    };
    static from = async (k) => {
        const { publicKey, privateKey } = importFromType(k);
        return new Ed25519KeyPair({
            id: k.id,
            type: k.type,
            controller: k.controller,
            publicKey,
            privateKey,
        });
    };
    static async fromFingerprint({ fingerprint }) {
        const buffer = base58.decode(fingerprint.substring(1));
        if (buffer[0] === ED25519_MULTICODEC_IDENTIFIER &&
            buffer[1] === VARIABLE_INTEGER_TRAILING_BYTE) {
            const kp = await Ed25519KeyPair.from({
                id: '',
                controller: '',
                type: 'Ed25519VerificationKey2018',
                publicKeyBase58: base58.encode(Uint8Array.from(buffer).slice(2)),
            });
            const f = await kp.fingerprint();
            kp.id = `did:key:${f}#${f}`;
            kp.controller = `did:key:${f}`;
            return kp;
        }
        throw new Error('Unsupported fingerprint type: ' + fingerprint);
    }
    constructor(opts) {
        this.id = opts.id;
        this.type = opts.type || 'JsonWebKey2020';
        this.controller = opts.controller;
        this.publicKey = opts.publicKey;
        this.privateKey = opts.privateKey;
    }
    async fingerprint() {
        return getMultibaseFingerprintFromPublicKeyBytes(this.publicKey);
    }
    async export(options = {
        privateKey: false,
        type: 'JsonWebKey2020',
    }) {
        if (exportableTypes[options.type]) {
            return exportableTypes[options.type](this.id, this.controller, this.publicKey, options.privateKey ? this.privateKey : undefined);
        }
        throw new Error('Unsupported export options: ' + JSON.stringify(options));
    }
    signer(type = 'EdDsa') {
        if (!this.privateKey) {
            throw new Error('No private key to sign with.');
        }
        if (suiteTypes[type]) {
            return suiteTypes[type].signer(this.privateKey);
        }
        throw new Error('Unsupported suite type ' + type);
    }
    verifier(type = 'EdDsa') {
        if (!this.publicKey) {
            throw new Error('No public key to verify with.');
        }
        if (suiteTypes[type]) {
            return suiteTypes[type].verifier(this.publicKey);
        }
        throw new Error('Unsupported suite type ' + type);
    }
    async getDerivedKeyPairs() {
        return [this, await Ed25519KeyPair.toX25519KeyPair(this)];
    }
}
//# sourceMappingURL=ed25519Keypair.js.map