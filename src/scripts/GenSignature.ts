import fs from "fs";
import * as crypto from 'crypto';

const privateKey = process.env.PRIVATE_KEY;
const subscriberid = process.env.SUBSCRIBER_ID;
const uniquekey = process.env.UNIQUE_KEY;
function calculateBlake512Digest(data: Buffer): string {
    const hash = crypto.createHash('blake2b512');
    hash.update(data);
    return hash.digest('hex');
  }

function generateDigestFromFile(inputFileName: string): Promise<string> {
return new Promise((resolve, reject) => {
    fs.readFile(inputFileName, (err, data) => {
    if (err) {
        reject(`Error reading file ${inputFileName}: ${err.message}`);
    } else {
        const digest = calculateBlake512Digest(data);
        resolve(digest);
    }
    });
});
}


function signMessage(privateKey: any, message: string): string {
    const signature = crypto.sign(null, Buffer.from(message), privateKey);
    const signatureHex = signature.toString("hex");
    return signatureHex;
  }
  
  async function main() {
    try {
      if (process.argv.length !== 3) {
        console.error('Usage: ts-node script.ts <inputFileName>');
        process.exit(1);
      }
  
      const inputFileName = "";
      const created = Math.floor(new Date().getTime() / 1000);
      const expiry = created + 30 * 60;
  
      const digest = await generateDigestFromFile(inputFileName);
      console.log(`Digest of the request body: ${digest}`);
      console.log(`Created timestamp: ${created}`);
      console.log(`Expiry timestamp: ${expiry}`);
      let signString = `(created): ${created}\n(expires):${expiry}\ndigest:BLAKE-512=${digest}`;
      const signature = signMessage(privateKey,signString);
      const auth_header =`Signature keyId=${subscriberid}|${uniquekey}|ed25519",algorithm="ed25519",created="${created}",expires="${expiry}",headers=" (created)(expires)digest",signature="${signature}"`;
      return auth_header;


    } catch (error) {
      console.error(error);
      process.exit(1);
    }
  }
  
  main();


