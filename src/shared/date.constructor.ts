export const dateConstructor = {
    getDateAndTime(date:Date){
        const day = +Intl.DateTimeFormat('ru',{day:"numeric"}).format(date)
        const month = +Intl.DateTimeFormat('ru',{month:'numeric'}).format(date)
        const year = +Intl.DateTimeFormat('ru',{year:'numeric'}).format(date)

        const longDateFormat = Intl.DateTimeFormat('ru',{dateStyle:'long'}).format(date)

        const hours = +Intl.DateTimeFormat('ru',{hour:'numeric'}).format(date)
        const minutes = +Intl.DateTimeFormat('ru',{minute:'numeric'}).format(date)

        const result = {
            longDateFormat,
            date:`${day}-${month}-${year}`,
            time:{hours,minutes}
        }
    
        return result
    },

    getParsDate(date:string){
        const resultArray = date.split('-')
        // get: dd-mm-yy return yy-mm-dd
        return `${resultArray[2]}-${resultArray[1]}-${resultArray[0]}`
        
    }

}