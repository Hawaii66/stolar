export interface User{
    displayName:string,
    givenName:string,
    surName:string,
    id:string,
    email:string,
    class:string,
    active:boolean,
    accountID:string,
    number:string
}

export interface Teacher {
    displayName:string,
    givenName:string,
    surName:string,
    email:string,
    active:boolean,
    accountID:string,
    classRoomIDs:ID[],
    groupIDs:ID[],
    number:string
}

export interface ID {
    id:string,
    name:string
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
    number:""
}

export const emptyTeacher:Teacher = {
    accountID:"",
    active:false,
    classRoomIDs:[],
    displayName:"",
    email:"",
    givenName:"",
    groupIDs:[],
    surName:"",
    number:""
}