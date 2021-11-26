export interface ClassRoom{
    classRoomID:string,
    chairs:Chair[],
    lecterns:Lectern[],
    name:string
}

export interface Names{
    namesID:string,
    className:string,
    names:Name[]
}

export interface Lectern {
    x:number,
    y:number,
    sizeX:number,
    sizeY:number,
    name:string
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