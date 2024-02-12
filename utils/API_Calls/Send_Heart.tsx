import { SharedSecret, RandInt, Encryption_AES } from "../Encryption"
import { choices, Set_Submit, PrivK } from "../UserData"
import sha256 from 'crypto-js/sha256';

const SERVER_IP = process.env.SERVER_IP

let PublicKeys: any[] = [];
let Stage1Keys: any[] = [];
let isPubliKAvail = false;
let isStage1KAvail = false;

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

export function get_pubKey(id: string) {
    for (const publicKey of PublicKeys) {
        if (publicKey._id === id) {
            return publicKey.pubKey;
        }
    }
    throw new Error("Public Key Not Found");
}

export const Send_M = async (senderId: string, receiverIds: string[], Submit: boolean) => {
    try {
        if (!isPubliKAvail) {
            await fetchPubKeys()
            isPubliKAvail = true
        }

        const r1 = choices.r1 || await sha256((await RandInt()).toString());
        const r2 = choices.r2 || await sha256((await RandInt()).toString());
        const r3 = choices.r3 || await sha256((await RandInt()).toString());
        const r4 = choices.r3 || await sha256((await RandInt()).toString());
        console.log(r1, r2, r3, r4);
        console.log(receiverIds);
        const hearts: BigInt[] = []
        const R: any[] = [r1, r2, r3, r4]

        const data = {
            r1: BigInt('0x' + r1).toString(),
            r2: BigInt('0x' + r2).toString(),
            r3: BigInt('0x' + r3).toString(),
            r4: BigInt('0x' + r4).toString(),
            recv1: receiverIds[0],
            recv2: receiverIds[1],
            recv3: receiverIds[2],
            recv4: receiverIds[3],
        }
        const base_enc_data = Buffer.from(JSON.stringify(data)).toString('base64');

        let data_encrypt = await Encryption_AES(base_enc_data, PrivK);
        // console.log(receiverIds)
        for (const i in [0, 1, 2, 3]) {
            const id = receiverIds[i]
            if (id === '') {
                const m = BigInt('0x' + R[i]);
                console.log(i, m);
                hearts.push(m);
                continue
            }

            const pubKey: string = get_pubKey(id)
            const enc = await SharedSecret(PrivK, pubKey)
            const sha = BigInt('0x' + await sha256(enc.toString()));
            console.log(sha);
            const m = BigInt('0x' + R[i]);
            const heart = sha ^ m;
            hearts.push(heart);
        }

        const res = await fetch(
            `${SERVER_IP}/users/sendheartvirtual/stage1`, {
            method: "POST",
            credentials: "include",  // For CORS
            body: JSON.stringify({
                M1: hearts[0].toString(),
                M2: hearts[1].toString(),
                M3: hearts[2].toString(),
                M4: hearts[3].toString(),
                S1Data: data_encrypt
            }),
        }
        );
        if (!res.ok) {
            throw new Error(`HTTP Error: ${res.status} - ${res.statusText}`);
        }

        console.log(hearts)
        if (Submit) {
            Set_Submit(Submit)
            const res = await fetch(
                `${SERVER_IP}/users/sendheart/stage1`, {
                method: "POST",
                credentials: "include",  // For CORS
                body: JSON.stringify({
                    M1: hearts[0].toString(),
                    M2: hearts[1].toString(),
                    M3: hearts[2].toString(),
                    M4: hearts[3].toString(),
                    S1Data: data_encrypt
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

async function fetchStage1Keys() {
    const res = await fetch(
        `${SERVER_IP}/users/fetchStage1Keys`, {
        method: "GET",
        credentials: "include"  // For CORS
    });

    if (!res.ok) {
        throw new Error(`HTTP Error: ${res.status} - ${res.statusText}`);
    }

    const res_json = await res.json()
    Stage1Keys = res_json
}

export function get_S1Keys(id: string) {
    for (const s1ks of Stage1Keys) {
        if (s1ks._id === id) {
            return s1ks;
        }
    }
    return -1;
}

interface S2hearts {
    k1: string;
    k2: string;
    k3: string;
    k4: string;
    cert: string;
}

export const Send_K = async (senderId: string, receiverIds: boolean[], Submit: boolean) => {
    try {
        if (!isStage1KAvail) {
            await fetchStage1Keys()
            isStage1KAvail = true
        }
        const Hearts: S2hearts[] = []
        const R: any[] = [choices.r1, choices.r2, choices.r3, choices.r4]
        const s1Choice: any[] = [choices.recv1, choices.recv2, choices.recv3, choices.recv4]
        const Certs: string[] = []
        const me_m = JSON.parse(get_S1Keys(senderId));
        const m11 = BigInt('0x' + me_m.m1);
        const m12 = BigInt('0x' + me_m.m2);
        const m13 = BigInt('0x' + me_m.m3);
        const m14 = BigInt('0x' + me_m.m4);

        const myChoices: BigInt[] = [m11, m12, m13, m14]
        const x: string[] = []

        for (const i in [0, 1, 2, 3]) {
            const heart: S2hearts = {
                k1: '',
                k2: '',
                k3: '',
                k4: '',
                cert: ''
            }
            if (receiverIds[i] === false) {
                Hearts.push(heart);
                continue
            }
            const id = s1Choice[i]

            const my_m = JSON.parse(get_S1Keys(id));
            if (my_m === -1) {
                console.log("S1 hearts not sent by receiver !!");
                continue
            }
            const m21 = BigInt('0x' + my_m.m1);
            const m22 = BigInt('0x' + my_m.m2);
            const m23 = BigInt('0x' + my_m.m3);
            const m24 = BigInt('0x' + my_m.m4);

            const mc = BigInt('0x' + myChoices[i]);  // IDK why i needed to do it like this :/ my typescript sucks......  ....  ..  .

            // TODO: Maybe Implement something like this kinda check in some way :}
            // TODO: Ie. make it recalculate the m & shared hash and them compute it & compare.
            // if(mc != somthing_i_posted){
            //     console.log("Error in BigInt Conversion")
            //     console.log("OR")
            //     console.log("Mismatch in Sent m1, m2, m3, m4 and those stored in server.")
            //     console.log("Please Contact Developers/(whoever is hosting the backend) !!")
            //     return false
            // }

            const k1 = mc ^ m21;
            const k2 = mc ^ m22;
            const k3 = mc ^ m23;
            const k4 = mc ^ m24;
            // These should  match with the ones in the database of m2 if sent be 'my'.
            // console.log(k1, k2, k3, k4)

            // Hashing k's to avoid collusion from server side.
            const x1 = await sha256(await RandInt().toString());
            const xx : string = m21 + "-" + m22 + "-" + m23 + "-" + m24 + "-" + x1.toString();
            const s2x = BigInt('0x'+ await sha256(await sha256(xx)));

            heart.k1 = (k1 ^ s2x).toString();
            heart.k2 = (k2 ^ s2x).toString();
            heart.k3 = (k3 ^ s2x).toString();
            heart.k4 = (k4 ^ s2x).toString();
            heart.cert = s2x.toString();

            Hearts.push(heart);
            Certs.push((await sha256(xx)).toString());
        }
        let Cert_data = {
            cert1: Certs[0],
            cert2: Certs[1],
            cert3: Certs[2],
            cert4: Certs[3],
        }
        const base_enc_crt = Buffer.from(JSON.stringify(Cert_data)).toString('base64');
        let cert_encrypt = await Encryption_AES(base_enc_crt.toString(), PrivK);

        const res = await fetch(
            `${SERVER_IP}/users/sendheartvirtual/stage2`, {
            method: "POST",
            credentials: "include",  // For CORS
            body: JSON.stringify({
                Ka1 : Hearts[0].k1,
                Ka2 : Hearts[0].k2,
                Ka3 : Hearts[0].k3,
                Ka4 : Hearts[0].k4,
                Kb1 : Hearts[1].k1,
                Kb2 : Hearts[1].k2,
                Kb3 : Hearts[1].k3,
                Kb4 : Hearts[1].k4,
                Kc1 : Hearts[2].k1,
                Kc2 : Hearts[2].k2,
                Kc3 : Hearts[2].k3,
                Kc4 : Hearts[2].k4,
                Kd1 : Hearts[3].k1,
                Kd2 : Hearts[3].k2,
                Kd3 : Hearts[3].k3,
                Kd4 : Hearts[3].k4,
                CertA : Certs[0],
                CertB : Certs[1],
                CertC : Certs[2],
                CertD : Certs[3],
                S2Data: cert_encrypt,
            }),
        }
        );
        if (!res.ok) {
            throw new Error(`HTTP Error: ${res.status} - ${res.statusText}`);
        }

        console.log(Hearts)
        if (Submit) {
            Set_Submit(Submit)
            const res = await fetch(
                `${SERVER_IP}/users/sendheartvirtual/stage2`, {
                method: "POST",
                credentials: "include",  // For CORS
                body: JSON.stringify({
                    Ka1 : Hearts[0].k1,
                    Ka2 : Hearts[0].k2,
                    Ka3 : Hearts[0].k3,
                    Ka4 : Hearts[0].k4,
                    Kb1 : Hearts[1].k1,
                    Kb2 : Hearts[1].k2,
                    Kb3 : Hearts[1].k3,
                    Kb4 : Hearts[1].k4,
                    Kc1 : Hearts[2].k1,
                    Kc2 : Hearts[2].k2,
                    Kc3 : Hearts[2].k3,
                    Kc4 : Hearts[2].k4,
                    Kd1 : Hearts[3].k1,
                    Kd2 : Hearts[3].k2,
                    Kd3 : Hearts[3].k3,
                    Kd4 : Hearts[3].k4,
                    CertA : Certs[0],
                    CertB : Certs[1],
                    CertC : Certs[2],
                    CertD : Certs[3],
                    S2Data: cert_encrypt,
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