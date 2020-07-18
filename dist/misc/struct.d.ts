export interface activematch {
    _id: string;
    channelid: string;
    messageID: string;
    split: boolean;
    p1: {
        userid: string;
        memedone: boolean;
        donesplit: boolean;
        time: number;
        memelink: string;
        votes: number;
        voters: Array<string>;
    };
    p2: {
        userid: string;
        memedone: boolean;
        donesplit: boolean;
        time: number;
        memelink: string;
        votes: number;
        voters: Array<string>;
    };
    votetime: number;
    votingperiod: boolean;
}
export interface qualmatch {
    _id: string;
    channelid: string;
    players: Array<players>;
    playerids: Array<string>;
    octime: number;
    template: string;
    split: boolean;
    votes: Array<Array<string>>;
    playersdone: Array<string>;
    votingperiod: boolean;
    votetime: number;
}
export interface players {
    userid: string;
    memedone: boolean;
    memelink: string;
    time: number;
    split: boolean;
    failed: boolean;
}
export interface user {
    _id: string;
    name: string;
    wins: number;
    loss: number;
    img: string;
}
export interface signups {
    _id: 1;
    open: boolean;
    users: Array<string>;
}
export interface quallist {
    _id: 2;
    url: string;
    users: Array<Array<string>>;
}
export interface matchlist {
    _id: 3;
    url: string;
    qualurl: string;
    users: Array<string>;
}
export interface verificationform {
    _id: 4;
    codes: Array<string[]>;
    users: Array<string>;
}
export interface cockratingInterface {
    _id: string;
    num: number;
    time: number;
}
