//import { Ed25519KeyPair } from "./ed25519Keypair.js";
//import { JsonWebKey } from "./JsonWebKey.js";
//import crypto from "crypto";
import { JWK } from './ed25519JWKKeypair.js';
//import { getKeyPairFromJwk } from './getKeyPairFromJwk.js';


/*const k = await Ed25519KeyPair.generate({
    secureRandom: () => {
      return crypto.randomBytes(32)
    },
});*/

const k = await JWK.generate();

/*const j = await JsonWebKey.generate({
  kty: 'OKP',
  crv: 'Ed25519',
  detached: true,
  secureRandom: crypto.randomBytes(32)
});*/

console.log(k);

console.log("----------------------");

const data = "Hello World";
const data1 = "Hello World";

const signature = await k.signer();
const bytes = await signature.sign({data:data});
console.log(bytes);

const verifier = await k.verifier();
const verify = await verifier.verify({data: data1,signature:bytes});
console.log(verify);


//const keyPair = await k.export({privateKey:true,type:"JsonWebKey2020"});

//console.log(getKeyPairFromJwk(keyPair));

//console.log(j);