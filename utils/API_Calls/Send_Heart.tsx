import { SHA256, SharedSecret, RandInt, Encryption_AES } from "../Encryption"
import { PubK, Set_Submit, PrivK } from "../UserData"
import sha256 from 'crypto-js/sha256';

const SERVER_IP = process.env.SERVER_IP

let PublicKeys: any[] = [];
let isPubliKAvail = false;

async function fetchPubKeys() {
    const res = await fetch(
        `${SERVER_IP}/users/fetchPublicKeys`, {
        method: "GET",
        credentials: "include"  // For CORS
    });

    if (!res.ok) {
        throw new Error(`HTTP Error: ${res.status} - ${res.statusText}`);
    }

    const res_json = await res.json()
    PublicKeys = res_json
}

export const Send_M = async (senderId: string, receiverIds: string[], Submit: boolean) => {
    try {
        if (!isPubliKAvail) {
            await fetchPubKeys()
            isPubliKAvail = true
        }

        const m1 = await sha256((await RandInt()).toString());
        const m2 = await sha256((await RandInt()).toString());
        const m3 = await sha256((await RandInt()).toString());
        const m4 = await sha256((await RandInt()).toString());
        const ids_encrypt: string[] = []
        const hearts: any[] = []

        const R: CryptoJS.lib.WordArray[] = [m1, m2, m3, m4]
        for (const id of receiverIds) {
            if (id === '') {
                ids_encrypt.push(m1.toString())
                continue
            }

            const pubKey: string = get_pubKey(id)
            const enc = await SharedSecret(PrivK, pubKey)
            console.log(enc)
            const sha = await sha256(enc.toString())
            console.log(sha)

            const shaNumber = parseInt(sha.toString(CryptoJS.enc.Hex), 16);
            console.log(shaNumber)

            const heart = shaNumber ^ parseInt(R[receiverIds.indexOf(id)].toString(CryptoJS.enc.Hex), 16);
            console.log(heart)

            hearts[receiverIds.indexOf(id)] = heart

            let id_encrypt = await Encryption_AES(id, PrivK);
            ids_encrypt.push(id_encrypt)
        }

        const res = await fetch(
            `${SERVER_IP}/users/sendMVirtual`, {
            method: "POST",
            credentials: "include",  // For CORS
            body: JSON.stringify({
                m1: hearts[0].toString(),
                m2: hearts[1].toString(),
                m3: hearts[2].toString(),
                m4: hearts[3].toString(),
                receiverIds: receiverIds,
            }),
        }
        );
        if (!res.ok) {
            throw new Error(`HTTP Error: ${res.status} - ${res.statusText}`);
        }
        if (Submit) {
            Set_Submit(Submit)
            const res = await fetch(
                `${SERVER_IP}/users/sendheart`, {
                method: "POST",
                credentials: "include",  // For CORS
                body: JSON.stringify({
                    m1: hearts[0].toString(),
                    m2: hearts[1].toString(),
                    m3: hearts[2].toString(),
                    m4: hearts[3].toString(),
                }),
            }
            );
            if (!res.ok) {
                throw new Error(`HTTP Error: ${res.status} - ${res.statusText}`);
            }
        }
        return true
    }
    catch (err) {
        console.log(err)
        return false
    }
};

export function get_pubKey(id: string) {
    for (const publicKey of PublicKeys) {
        if (publicKey._id === id) {
            return publicKey.pubKey;
        }
    }
    throw new Error("Public Key Not Found");
}