import { Student } from "./API_Calls/search"
import { Decryption_AES } from "./Encryption"

export let Id = ''
export let PubK = ''
export let PrivK = ''
export let Data = ''
export let Submit = false
export let S1submit = false
export let S2submit = false
export let Certgiven = false

// IDs of receivers of heart from User
export let receiverIds: string[] = []
export let user: Student = {} as Student;

export let batchWiseResgis = {}
export let femaleRegistration = ''
export let maleRegistration = ''
export let totalRegistration = ''
export let totalMatches = ''
export const setStats = (StatsVariable: any, stats: any) => {
    StatsVariable = stats;
}

export const setUser = (student_user: Student) => {
    user = student_user;
};

// export const setAdminPublished = (publish: boolean) => {
//     admin_pulished = publish;
// };

// export const setMatchedIds = (newIds: string[]) => {
//     Matched_Ids = newIds;
// };

export function Set_Id(id: string) {
    Id = id
}

export function Set_PrivK(pvtKey_login: string) {
    PrivK = pvtKey_login
}

export function Set_PubK(pubKey_login: string) {
    PubK = pubKey_login
}

export function Set_Submit(submit: boolean) {
    Submit = submit
}

export function Set_S1submit(submit: boolean) {
    S1submit = submit
}

export function Set_S2submit(submit: boolean) {
    S2submit = submit
}

export function Set_Certgiven(submit: boolean) {
    Certgiven = submit
}

export interface Choices {
    r1: string;
    r2: string;
    r3: string;
    r4: string;
    recv1: string;
    recv2: string;
    recv3: string;
    recv4: string;
}

export interface Cert {
    cert1: string;
    cert2: string;
    cert3: string;
    cert4: string;
}

export let choices: Choices = {
    r1: '',
    r2: '',
    r3: '',
    r4: '',
    recv1: '',
    recv2: '',
    recv3: '',
    recv4: ''
};

export let cert: Cert = {
    cert1: '',
    cert2: '',
    cert3: '',
    cert4: '',
};

export async function Set_S1Data(data_enc: string) {

    // Initializing Every State Varibale to 0 incase user Logins again immediately after Logout
    for (let i = 0; i < 4; i++) {
        receiverIds[i] = ''
    }

    if (data_enc === "FIRST_LOGIN") {
        return
    }

    try {
        // TODO: Add proper decryption logic based on your encryption library
        let decoded_data = await Decryption_AES(data_enc, PrivK);
        let data = JSON.parse(Buffer.from(decoded_data, 'base64').toString('utf-8'));
        choices.r1 = data.r1;
        choices.r2 = data.r2;
        choices.r3 = data.r3;
        choices.r4 = data.r4;
        choices.recv1 = data.recv1;
        choices.recv2 = data.recv2;
        choices.recv3 = data.recv3;
        choices.recv4 = data.recv4;
        receiverIds[0] = choices.recv1;
        receiverIds[1] = choices.recv2;
        receiverIds[2] = choices.recv3;
        receiverIds[3] = choices.recv4;
    } catch (error) {
        console.error('Error decrypting data:', error);
    }
    return
}

export async function Set_S2Data(data_enc: string) {
    if (data_enc === "Not_Sent_YET") {
        return
    }

    try {
        let decoded_data = await Decryption_AES(data_enc, PrivK);
        let data = JSON.parse(Buffer.from(decoded_data, 'base64').toString('utf-8'));

        // TODO: Assign variables in s2 decrypted data
        cert.cert1 = data.cert1;
        cert.cert2 = data.cert2;
        cert.cert3 = data.cert3;
        cert.cert4 = data.cet4;

        // console.log(cert.cert1, cert.cert2, cert.cert3, cert.cert4)
    } catch (error) {
        console.error('Error decrypting data:', error);
    }
    return

}