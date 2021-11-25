export interface ClassRoom{
    classRoomID:string,
    chairs:Chair[],
}

export interface Chair{
    x:number,
    y:number,
    force:boolean,
    sizeX:number,
    sizeY:number
}