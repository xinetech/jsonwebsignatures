import ed25519 from '@stablelib/ed25519';
import { randomBytes } from 'crypto';
import { KeyPair } from './types/KeyPair.js';
import { getFingerprintFromPublicKeyBytes } from './getFingerPrintFromPublicKeyBytes.js';
import { JsonWebKey2020 } from './types/JsonWebKey.js';
import { exportableTypes } from './exportTypes.js';
import { importFromType } from './importTypes.js';
import { suiteTypes } from './suites/index.js';

export class JWK implements KeyPair {
    public id: string;
    public type: string = 'JsonWebKey2020';
    public controller: string;
    public publicKey: Uint8Array;
    public privateKey?: Uint8Array;

    constructor(opts: {
        id: string;
        type: string;
        controller: string;
        publicKey: Uint8Array;
        privateKey?: Uint8Array;
      }) {
        this.id = opts.id;
        this.type = opts.type || 'JsonWebKey2020';
        this.controller = opts.controller;
        this.publicKey = opts.publicKey;
        this.privateKey = opts.privateKey;
     }

    async fingerprint(): Promise<string> {
        return getFingerprintFromPublicKeyBytes(this.publicKey);
    }

    static generate = async() : Promise<JWK> => {
       const seed = randomBytes(32);
       const keys = ed25519.generateKeyPairFromSeed(seed);

       const fingerPrint = getFingerprintFromPublicKeyBytes(keys.publicKey);
       const controller = `did:key:${fingerPrint}`;
       const id = `${controller}#${fingerPrint}`;

       return new JWK({
         id: id,
         type: 'JsonWebKey2020',
         controller: controller,
         publicKey: keys.publicKey,
         privateKey: keys.secretKey
       })
    }

    static from = async(key: JsonWebKey2020) : Promise<JWK> => {
       const { publicKey, privateKey } = importFromType(key);
       return new JWK({
        id: key.id,
        type: key.type,
        controller: key.controller,
        publicKey,
        privateKey
       })
    }

    async export(
        options: {
          privateKey?: boolean;
          type: 'JsonWebKey2020';
        } = {
          privateKey: false,
          type: 'JsonWebKey2020',
        }
      ): Promise<JsonWebKey2020> {
        if (exportableTypes[options.type]) {
            return exportableTypes[options.type](
              this.id,
              this.controller,
              this.publicKey,
              options.privateKey ? this.privateKey : undefined
            );
          }
          throw new Error('Unsupported export options: ' + JSON.stringify(options));
      }
    
      signer(type: 'EdDsa' = 'EdDsa') {
        if (!this.privateKey) {
          throw new Error('No private key to sign with.');
        }
        if (suiteTypes[type]) {
          return suiteTypes[type].signer(this.privateKey);
        }
        throw new Error('Unsupported suite type ' + type);
      }
      verifier(type: 'EdDsa' = 'EdDsa') {
        if (!this.publicKey) {
          throw new Error('No public key to verify with.');
        }
        if (suiteTypes[type]) {
          return suiteTypes[type].verifier(this.publicKey);
        }
        throw new Error('Unsupported suite type ' + type);
      }
}
