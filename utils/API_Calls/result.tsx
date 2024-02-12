import { choices } from "../UserData"
import sha256 from 'crypto-js/sha256';
import { Id } from "../UserData"
let Stage2Keys: any[] = [];
let Certs: any[] = [];

const SERVER_IP = process.env.SERVER_IP

export function get_result() {
    fetchStage2Keys();
    fetchCerts();
    const Array: boolean[] = [false, false, false, false];

    const my_choices = [choices.r1, choices.r2, choices.r3, choices.r4]

    const my_key = get_Stage2Key(Id);
    if (my_key === -1) {
        console.log("Error: Key not found");
        return Array;
    }
    const my_cert = get_Certs(Id);
    if (my_cert === -1) {
        console.log("Error: Cert not found");
        return Array;
    }

    const My_Ka1 = BigInt(my_key.Ka1);
    const My_Ka2 = BigInt(my_key.Ka2);
    const My_Ka3 = BigInt(my_key.Ka3);
    const My_Ka4 = BigInt(my_key.Ka4);
    const My_Kb1 = BigInt(my_key.Kb1);
    const My_Kb2 = BigInt(my_key.Kb2);
    const My_Kb3 = BigInt(my_key.Kb3);
    const My_Kb4 = BigInt(my_key.Kb4);
    const My_Kc1 = BigInt(my_key.Kc1);
    const My_Kc2 = BigInt(my_key.Kc2);
    const My_Kc3 = BigInt(my_key.Kc3);
    const My_Kc4 = BigInt(my_key.Kc4);
    const My_Kd1 = BigInt(my_key.Kd1);
    const My_Kd2 = BigInt(my_key.Kd2);
    const My_Kd3 = BigInt(my_key.Kd3);
    const My_Kd4 = BigInt(my_key.Kd4);
    const My_CertA = BigInt('0x' + my_cert.CertA);
    const My_CertB = BigInt('0x' + my_cert.CertB);
    const My_CertC = BigInt('0x' + my_cert.CertC);
    const My_CertD = BigInt('0x' + my_cert.CertD);

    const My_Real_Ka1 = My_Ka1 ^ My_CertA;
    const My_Real_Ka2 = My_Ka2 ^ My_CertA;
    const My_Real_Ka3 = My_Ka3 ^ My_CertA;
    const My_Real_Ka4 = My_Ka4 ^ My_CertA;
    const My_Real_Kb1 = My_Kb1 ^ My_CertB;
    const My_Real_Kb2 = My_Kb2 ^ My_CertB;
    const My_Real_Kb3 = My_Kb3 ^ My_CertB;
    const My_Real_Kb4 = My_Kb4 ^ My_CertB;
    const My_Real_Kc1 = My_Kc1 ^ My_CertC;
    const My_Real_Kc2 = My_Kc2 ^ My_CertC;
    const My_Real_Kc3 = My_Kc3 ^ My_CertC;
    const My_Real_Kc4 = My_Kc4 ^ My_CertC;
    const My_Real_Kd1 = My_Kd1 ^ My_CertD;
    const My_Real_Kd2 = My_Kd2 ^ My_CertD;
    const My_Real_Kd3 = My_Kd3 ^ My_CertD;
    const My_Real_Kd4 = My_Kd4 ^ My_CertD;

    for (const i in [0, 1, 2, 3]) {
        const key = get_Stage2Key(my_choices[i]);
        if (key === -1) {
            console.log("Error: Key ", i, " not found");
            continue;
        }
        const cert = get_Certs(my_choices[i]);
        if (cert === -1) {
            console.log("Error: Cert not found");
            continue;
        }

        const Ka1 = BigInt(key.Ka1) || BigInt(0);
        const Ka2 = BigInt(key.Ka2) || BigInt(0);
        const Ka3 = BigInt(key.Ka3) || BigInt(0);
        const Ka4 = BigInt(key.Ka4) || BigInt(0);
        const Kb1 = BigInt(key.Kb1) || BigInt(0);
        const Kb2 = BigInt(key.Kb2) || BigInt(0);
        const Kb3 = BigInt(key.Kb3) || BigInt(0);
        const Kb4 = BigInt(key.Kb4) || BigInt(0);
        const Kc1 = BigInt(key.Kc1) || BigInt(0);
        const Kc2 = BigInt(key.Kc2) || BigInt(0);
        const Kc3 = BigInt(key.Kc3) || BigInt(0);
        const Kc4 = BigInt(key.Kc4) || BigInt(0);
        const Kd1 = BigInt(key.Kd1) || BigInt(0);
        const Kd2 = BigInt(key.Kd2) || BigInt(0);
        const Kd3 = BigInt(key.Kd3) || BigInt(0);
        const Kd4 = BigInt(key.Kd4) || BigInt(0);
        const CertA = BigInt('0x' + cert.CertA);
        const CertB = BigInt('0x' + cert.CertB);
        const CertC = BigInt('0x' + cert.CertC);
        const CertD = BigInt('0x' + cert.CertD);

        const Real_Ka1 = Ka1 ^ CertA;
        const Real_Ka2 = Ka2 ^ CertA;
        const Real_Ka3 = Ka3 ^ CertA;
        const Real_Ka4 = Ka4 ^ CertA;
        const Real_Kb1 = Kb1 ^ CertB;
        const Real_Kb2 = Kb2 ^ CertB;
        const Real_Kb3 = Kb3 ^ CertB;
        const Real_Kb4 = Kb4 ^ CertB;
        const Real_Kc1 = Kc1 ^ CertC;
        const Real_Kc2 = Kc2 ^ CertC;
        const Real_Kc3 = Kc3 ^ CertC;
        const Real_Kc4 = Kc4 ^ CertC;
        const Real_Kd1 = Kd1 ^ CertD;
        const Real_Kd2 = Kd2 ^ CertD;
        const Real_Kd3 = Kd3 ^ CertD;
        const Real_Kd4 = Kd4 ^ CertD;

        for (const r1xr2 in [Real_Ka1, Real_Ka2, Real_Ka3, Real_Ka4, Real_Kb1, Real_Kb2, Real_Kb3, Real_Kb4, Real_Kc1, Real_Kc2, Real_Kc3, Real_Kc4, Real_Kd1, Real_Kd2, Real_Kd3, Real_Kd4]) {
            for (const myr1xr2 in [My_Real_Ka1, My_Real_Ka2, My_Real_Ka3, My_Real_Ka4, My_Real_Kb1, My_Real_Kb2, My_Real_Kb3, My_Real_Kb4, My_Real_Kc1, My_Real_Kc2, My_Real_Kc3, My_Real_Kc4, My_Real_Kd1, My_Real_Kd2, My_Real_Kd3, My_Real_Kd4]) {
                if (r1xr2 === myr1xr2) {
                    Array[i] = true;
                }
            }
        }
    }
    return Array;
}

export function get_Stage2Key(id: string) {
    for (const key of Stage2Keys) {
        if (key.id === id) {
            return key;
        }
    }
    return -1;
}

export function get_Certs(id: string) {
    for (const key of Certs) {
        if (key.id === id) {
            return key;
        }
    }
    return -1;
}

async function fetchStage2Keys() {
    const res = await fetch(
        `${SERVER_IP}/users/fetchStage2Keys`, {
        method: "GET",
        credentials: "include"  // For CORS
    });

    if (!res.ok) {
        throw new Error(`HTTP Error: ${res.status} - ${res.statusText}`);
    }

    const res_json = await res.json();
    Stage2Keys = res_json;
}

async function fetchCerts() {
    const res = await fetch(
        `${SERVER_IP}/users/fetchStage1Keys`, {
        method: "GET",
        credentials: "include"  // For CORS
    });

    if (!res.ok) {
        throw new Error(`HTTP Error: ${res.status} - ${res.statusText}`);
    }

    const res_json = await res.json();
    Certs = res_json;
}