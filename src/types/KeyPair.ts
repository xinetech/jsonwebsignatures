import { Signer } from "./Signer.js";
import { Verifier } from "./Verifier.js";
import { GetSecret } from "./GetSecret.js";

export interface KeyPair {
    fingerprint(): Promise<string>; // produce a fingerprint
    export({
      type,
      privateKey
    }: {
      type;
      privateKey?: boolean;
    }): Promise<unknown>; 
    signer?: Signer; 
    verifier?: Verifier;
    deriveSecret?: GetSecret; 
    getDerivedKeyPairs?: () => Promise<unknown[]>; 
    getPairedKeyPairs?: () => Promise<unknown[]>; 
  }
  
  export function staticImplements<T>() {
    return <U extends T>(constructor: U) => {
      //eslint-disable-next-line
      constructor;
    };
  }