import { cert } from "../UserData"
const SERVER_IP = process.env.SERVER_IP

export const Send_Cert = async () => {
    const res = await fetch(
        `${SERVER_IP}/users/sendcert`, {
        method: "POST",
        credentials: "include",
        body: JSON.stringify({
            CertAs: cert.cert1,
            CertBs: cert.cert2,
            CertCs: cert.cert3,
            CertDs: cert.cert4,
        }),

        headers: {
            "Content-type": "application/json; charset=UTF-8"
        }}
    );

    if (!res.ok){
        console.log(`HTTP Error: ${res.status} - ${res.statusText} - URL: ${SERVER_IP}/captcha/user/login`);
        return false;
    }
    return true;
}