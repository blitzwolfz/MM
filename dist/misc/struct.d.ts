export interface activematch {
    _id: string;
    channelid: string;
    messageID: string;
    p1: {
        userid: string;
        memedone: boolean;
        time: number;
        memelink: string;
        votes: number;
        voters: Array<string>;
    };
    p2: {
        userid: string;
        memedone: boolean;
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
    octime: number;
    template: string;
    split: boolean;
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
