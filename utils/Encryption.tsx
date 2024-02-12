import CryptoJS from 'crypto-js';
import { secp256k1 } from '@noble/curves/secp256k1';

export async function SHA256(password: string) {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const passHash = hashArray.map(byte => byte.toString(16).padStart(2, '0')).join('');
  return passHash;
}

export async function GenerateKeys() {
  const pri = await secp256k1.utils.randomPrivateKey();
  const pub = await secp256k1.getPublicKey(pri);

  return ({
    privKey: Buffer.from(pri).toString('base64'),pubKey: Buffer.from(pub).toString('base64')
  });
}

export async function SharedSecret(PrivateK: string, publicKey: string) {
  const publicKeyBuffer = Buffer.from(publicKey, 'base64');
  const privateKeyBuffer = Buffer.from(PrivateK, 'base64').toString('hex');
  const shared = secp256k1.getSharedSecret(privateKeyBuffer,publicKeyBuffer);
  return shared;
}

export async function Decryption(ENC: string, privateKey: string) {
  try {
    const privateKeyBuffer = Buffer.from(privateKey, 'base64');
    const privateKeyImported = await crypto.subtle.importKey(
      'pkcs8',
      privateKeyBuffer,
      { name: 'RSA-OAEP', hash: 'SHA-256' },
      false,
      ['decrypt']
    );

    const encryptedData = Buffer.from(ENC, 'base64');
    const decryptedArrayBuffer = await crypto.subtle.decrypt(
      { name: 'RSA-OAEP' },
      privateKeyImported,
      encryptedData
    );

    return new TextDecoder().decode(decryptedArrayBuffer);
  }
  catch (err) {
    return 'Fail'
  }
}

// AES encryption of pvtKey using password
export async function Encryption_AES(privateKey: string, pass: string) {
  const encrypted = CryptoJS.AES.encrypt(privateKey, pass)
  return encrypted.toString()
}

// AES decryption of pvtKey using password
export async function Decryption_AES(ENC: string, pass: string) {
  const decrypted = CryptoJS.AES.decrypt(ENC, pass)
  return decrypted.toString(CryptoJS.enc.Utf8)
}

export async function RandInt() {
  const randomBytes = new Uint32Array(1);
  crypto.getRandomValues(randomBytes);
  return randomBytes[0];
}
