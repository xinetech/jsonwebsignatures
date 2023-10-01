import { Ed25519KeyPair } from "./ed25519Keypair.js";
import crypto from "crypto";
const k = await Ed25519KeyPair.generate({
    secureRandom: () => {
        return crypto.randomBytes(32);
    },
});
console.log(k);
//# sourceMappingURL=main.js.map