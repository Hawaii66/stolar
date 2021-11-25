export enum Roles{
    "student",
    "teacher",
    "admin",
    "none"
}

export interface User{
    displayName:string,
    givenName:string,
    surName:string,
    id:string,
    email:string,
    class:string,
    active:boolean,
    accountID:string,
    role:Roles,
    number:string
}

export interface Teacher {
    userID:string,
    classRoomIDs:string[],
}

export const emptyUser:User = {
    class:"",
    email:"",
    displayName:"",
    active:false,
    givenName:"",
    id:"",
    surName:"",
    accountID:"",
    role:Roles.none,
    number:""
}