export interface ISession{
    id:number
    hallNumber:number
    movieName:string
    moviePoster:string
    sessionTime:{
        hours:number,
        minute:number
    }
}

export interface ISessionSeat{
    id:number
    sessionId:number
    hallNumber:number
    rowNumber:number
    seatNumber:number
    movieName:string
    price:number,
    sessionTime:{
        hours:number,
        minute:number
    }
}
