
export interface activematch{
    _id: string;
    channelid:string;
    p1:{
        userid: string;
        memedone: boolean;
        time: number;
        memelink: string;
        votes: number;
        voters: Array<string>;
    },
    p2:{
        userid: string;
        memedone: boolean;
        time: number;
        memelink: string;
        votes: number;
        voters: Array<string>;
    },
    votetime: number;
    votingperiod: boolean;
    // votemessage: null,
}

export interface qualmatch{
    _id:string;
    channelid:string;
    players: Array<players>;
    octime: number;
    template:string;
    split: boolean;
    // votemessage: null,
}

export interface players{
    userid: string;
    memedone: boolean;
    memelink: string;
    time:number;
    split:boolean;
    failed:boolean;
}

export interface user{
    _id:string;
    userid:string
    wins: number;
    loss: number;
    WL:number;
}