
export interface IHall{
    hallNumber:number
    screen:{
        size:{
            hight:number,
            width:number
        }
        position:{
            x:number,
            y:number
        }
    }
    rows:IRow[]
}

export interface IRow{
    rowNumber:number
    position:{
        x:number,
        y:number
    }
    seats:ISeat[]
}

export interface ISeat{
    seatNumber:number
    type:SeatType
    position:{
        x:number,
        y:number
    }
}

export type SeatType = 'min' | 'standard' | 'vip';




