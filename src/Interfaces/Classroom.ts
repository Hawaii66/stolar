export interface ClassRoom{
    classRoomID:string,
    chairs:Chair[],
    name:string
}

export interface Names{
    namesID:string,
    className:string,
    names:Name[]
}

export interface Chair{
    x:number,
    y:number,
    force:boolean,
    sizeX:number,
    sizeY:number
}

export interface Pos{
    x:number,
    y:number
}

export interface Name{
    firstName:string,
    lastName:string
}