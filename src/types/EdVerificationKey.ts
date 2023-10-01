export interface Ed25519VerificationKey2020 {
    id: string;
    type: 'Ed25519VerificationKey2020';
    controller: string;
    publicKeyMultibase: string;
    privateKeyMultibase?: string;
  }

  export interface Ed25519VerificationKey2018 {
    id: string;
    type: 'Ed25519VerificationKey2018';
    controller: string;
    publicKeyBase58: string;
    privateKeyBase58?: string;
  }

  export interface JsonWebKey2020 {
    id: string;
    type: 'JsonWebKey2020';
    controller: string;
    publicKeyJwk: unknown;
    privateKeyJwk?: unknown;
  }