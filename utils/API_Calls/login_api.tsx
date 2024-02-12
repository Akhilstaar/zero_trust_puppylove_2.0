import { SHA256, Decryption_AES } from "../Encryption"
import { Set_PrivK, Set_PubK, Set_S1Data, Set_S2Data, Set_Certgiven, Set_S1submit, Set_S2submit, Set_Id } from "../UserData"
const SERVER_IP = process.env.SERVER_IP

// Admin Permit to Send Hearts
export var stage = 0

export const handleLog = async (data: any, recaptchaToken: any) => {
  try {
    Set_Id(data.id);
    const myHeaders = new Headers();
    myHeaders.append("g-recaptcha-response", recaptchaToken);
    const passHash = await SHA256(data.password);
    const bdy = JSON.stringify({
      id: data.id,
      passHash: passHash
    });

    const requestOptions: RequestInit = {
      method: 'POST',
      headers: myHeaders,
      credentials: "include",
      body: bdy,
      redirect: 'follow'
    };

    const res = await fetch(`${SERVER_IP}/captcha/user/login`, requestOptions);

    if (!res.ok) {
      console.log(`HTTP Error: ${res.status} - ${res.statusText} - URL: ${SERVER_IP}/captcha/user/login`);
      return { "success": false, "credentialError": true };
    }
    const res_json = await res.json()
    const pvtKey_Enc: string = res_json.pvtKey_Enc
    const pvtKey_login = await Decryption_AES(pvtKey_Enc, data.password)
    stage = res_json.stage
    Set_PrivK(pvtKey_login)
    Set_PubK(res_json.pubKey)
    Set_S1submit(res_json.s1submit)
    Set_S2submit(res_json.s2submit)
    Set_Certgiven(res_json.certgiven)
    await Set_S1Data(res_json.s1data)
    await Set_S2Data(res_json.s2data)
    console.log(pvtKey_login)

    if (res_json.s1submit === true) {
      if (stage === 1) {
        // TODO: Implement this function
        // await
      }
      else if (stage === 2) {
        // TODO: Implement this function
      }
    }

    // For Debugging
    // await new Promise(resolve => setTimeout(resolve, 10000));

    return { "success": true, "stage": res_json.s1submit}
  }
  catch (err) {
    console.log(err)
    return { "success": false, "credentialError": false }
  }
}

export const handle_Logout = async () => {
  try {
    const res = await fetch(`${SERVER_IP}/session/logout`, {method: "GET"})
    if (!res.ok) {
      throw new Error(`HTTP Error: ${res.status} - ${res.statusText}`);
    }
    return true;
  }
  catch (err) {
    console.log(err)
    return false
  }
}