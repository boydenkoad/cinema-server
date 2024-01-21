import { pool as db } from "../db/db";
import { PriceDto } from "../dto/price.dto";
import { IHall, ISeat, SeatType } from "../entities/hall.model";
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
  async getSeat() {}

  async createSeat(sessionId: number, hall: IHall, prices: PriceDto) {

      const result: any[] = [];

      for (let i = 0; i < hall.rows.length; i++) {
        for (let j = 0; j < hall.rows[i].seats.length; j++) {
          const seatDb = (
            await db.query(
              queryConstructor.create("seats", [
                "hall_number",
                "row_number",
                "seat_number",
                "price",
                "session_id",
              ]),
              [
                hall.hallNumber,
                hall.rows[i].rowNumber,
                hall.rows[i].seats[j].seatNumber,
                getPrice(hall.rows[i].seats[j].type, prices),
                sessionId,
              ]
            )
          ).rows[0];

          result.push(seatDb);
        }
      }

      return result;
  }

  async updateSeat() {}

  async deleteSeat(id: number) {}
})();
