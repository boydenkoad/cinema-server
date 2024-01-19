
export interface IHall{
    hallNumber:number
    rows:IRow[]
}

export interface IRow{
    rowNumber:number
    seats:ISeat[]
}

export interface ISeat{
    type:SeatType
    seatNumber:number
}

export type SeatType = 'min' | 'standard' | 'vip';




