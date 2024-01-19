import { pool as db } from "../db/db";
import { PriceDto } from "../dto/price.dto";
import { IHall, ISeat, SeatType } from "../entities/hall.model";
import ApiError from "../exceptions/api-error";
import { queryConstructor } from "../shared/query.constructor";

interface Place {
  type: SeatType;
  price: number;
}

 function getPrice(type: SeatType, price: PriceDto) {
  switch (type) {
    case "min":
      return price["min"];

    case "standard":
      return price["standard"];

    case "vip":
      return price["vip"];

    default:
      throw new Error("Неизвестный тип места");
  }
}

export default new (class SeatService {
  async getSeat() {}

  async createSeat(sessionId: number, hall: IHall, prices: PriceDto) {

    // const seat = (await db.query(queryConstructor.create('seats',['hall_number','row_number','seat_number','price','session_id']),[hall.hallNumber,1,1,getPrice('standard',prices),sessionId])).rows[0]

    hall.rows.forEach(row=>{
      row.seats.forEach(seat=>{
        db.query(queryConstructor.create('seats',['hall_number','row_number','seat_number','price','session_id']),[hall.hallNumber,row.rowNumber,seat.seatNumber,getPrice(seat.type,prices),sessionId])
      })
    })
    
    return 'ready'
  }

  async updateSeat() {}

  async deleteSeat(id: number) {}
})();
