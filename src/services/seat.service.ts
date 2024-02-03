import { pool as db } from "../db/db";
import { ISeatDb } from "../db/entities/seatDb.entity";
import { PriceDto } from "../dto/price.dto";
import { ISeat, SeatType } from "../entities/hall.model";
import ApiError from "../exceptions/api-error";
import { queryConstructor } from "../shared/query.constructor";

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

  async getSeats(sessionId:number) {
    try{

      const seats:ISeatDb[] = (await db.query(queryConstructor.getByParams('seats',['session_id']),[sessionId])).rows

      return seats

    }catch(e){

      throw e

    }
  }

  async getSeatById(id:number){

    const seat:ISeatDb = ( await db.query(queryConstructor.getByParams('seats',['id']),[id])).rows[0]

    if(!seat) throw ApiError.BadRequest('Место не найдено');
  
    return seat
  }

  async createSeat(sessionId: number,hallNumber: number,rowNumber: number,seat: ISeat,prices: PriceDto){

    try{

      const result = (await db.query(queryConstructor.create("seats", [ "hall_number","row_number", "seat_number","price","session_id"]),
      [hallNumber,rowNumber,seat.seatNumber,getPrice(seat.type, prices),sessionId])).rows[0];

      return result;

    }catch(e){

      throw e

    }

  }

  async updateSeat(seatId: number,bookingId:number) {
    try {
      const seat = (
        await db.query(
          queryConstructor.update("seats", "id", ['is_available','booking_id']),
          [false,bookingId,seatId]
        )
      ).rows[0];

      return seat;

    } catch (e) {

      throw e

    }
  }

  async deleteSeat(id: number) {}
});
