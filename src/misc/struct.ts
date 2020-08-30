
export interface activematch{
    _id: string;
    channelid:string;
    messageID:string;
    split:boolean;
    template:Array<string>,
    tempfound:boolean,
    p1:{
        userid: string;
        partner: string;
        memedone: boolean;
        donesplit:boolean;
        time: number;
        memelink: Array<string>;
        votes: number;
        voters: Array<string>;
        halfreminder: boolean
        fivereminder: boolean;
    },
    p2:{
        userid: string;
        partner: string;
        memedone: boolean;
        donesplit:boolean;
        time: number;
        memelink: Array<string>;
        votes: number;
        voters: Array<string>;
        halfreminder: boolean,
        fivereminder: boolean;
    },
    votetime: number;
    votingperiod: boolean;
    // votemessage: null,
}

export interface qualmatch{
    _id:string;
    channelid:string;
    players: Array<players>;
    playerids:Array<string>
    octime: number;
    template:string;
    split: boolean;
    votes: Array<Array<string>>;
    playersdone:Array<string>
    votingperiod:boolean
    votetime: number;
    // votemessage: null,
}

export interface groupmatch{
    _id:string;
    split:boolean;
    template:Array<string>;
    groups:Array<groupstruct>;
    votingperiod:boolean
    votetime: number;

}

export interface groupstruct{
    groupsplit:boolean;
    groupplayers:Array<string>;
    captain:string;
    memes:Array<string>
    halfreminder: boolean
    fivereminder: boolean;
    
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
    name:string;
    memesvoted:number;
    points:number;
    wins: number;
    loss: number;
    img: string;
}

export interface signups{
    _id:1;
    open: boolean;
    users: Array<string>;
}

export interface quallist{
    _id:2;
    url: string;
    users: Array<Array<string>>;
}

export interface matchlist{
    _id:3;
    url: string;
    qualurl:string;
    users: Array<string>;
}

export interface verificationform{
    _id:4;
    codes: Array<string[]>
    users: Array<string>
}

export interface cockratingInterface{
    _id:string;
    num:number;
    time:number;
}

export interface modprofile{
    _id: string,
    modactions:number,
    matchesstarted:number
    matchportionsstarted:number
}

export interface randomtempstruct{
    _id:string,
    found:boolean,
    messageid: string,
    url:string,
    time:number
}