import { SHA256, GenerateKeys, Encryption_AES } from "../Encryption"
const SERVER_IP = process.env.SERVER_IP

export const handleVerifyOTP = async (user: any) => {
  try {
    const passHash = await SHA256(user.pass)
    const Keys = await GenerateKeys()
    const privKey = Keys.privKey
    const privKey_encrypt = await Encryption_AES(privKey.toString(), user.pass)
    const res = await fetch(
      SERVER_IP + "/users/login/first", {
      method: "POST",
      body: JSON.stringify({
        roll: user.id.id,
        authCode: (user.auth).trim(),
        passHash: passHash,
        pubKey: Keys.pubKey,
        privKey: privKey_encrypt,
        data: "FIRST_LOGIN"
      }),

      headers: {
        "Content-type": "application/json; charset=UTF-8"
      }
    }
    );

    return res;
  }
  catch (err) {
    console.log(err)
    throw err;
  }
}
