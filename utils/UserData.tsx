import { Student } from "./API_Calls/search"

export let Id = ''
export let PubK = ''
export let PrivK = ''
export let Data = ''
export let Submit = false

// IDs of receivers of heart from User
export let receiverIds: string[] = []
export let Matched_Ids: string[] = []
export let Matches: Student[] = []
export let admin_pulished: boolean = false;
export let user: Student = {} as Student;

export let batchWiseMatches = {}
export let batchWiseResgis = {}
export let femaleRegistration = ''
export let maleRegistration = ''
export let totalRegistration = ''
export let totalMatches = ''

export const setStats = (StatsVariable: any, stats: any) => {
    StatsVariable = stats;
}

export const setMatches = (student_matched: any) => {
    if (!Matches.includes(student_matched)) {
        Matches.push(student_matched);
    }
};
export const setUser = (student_user: Student) => {
    user = student_user;
};

export const setAdminPublished = (publish: boolean) => {
    admin_pulished = publish;
};

export const setMatchedIds = (newIds: string[]) => {
    Matched_Ids = newIds;
};

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

// Send Heart
export interface Heart {
    enc: string;
    sha_encrypt: string;
    id_encrypt: string;
}

export interface Hearts {
    heart1: Heart;
    heart2: Heart;
    heart3: Heart;
    heart4: Heart;
}

export let Sent_Hearts: Hearts;

export async function Set_Data(data: string) {

    // Initializing Every State Varibale to 0 incase user Logins again immediately after Logout
    for (let i = 0; i < 4; i++) {
        receiverIds[i] = ''
    }

    if (data === "FIRST_LOGIN") {
        return
    }
    // TODO: Add functions for Decryption of data
    return
}