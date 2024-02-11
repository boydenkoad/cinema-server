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
            dateRu:Intl.DateTimeFormat('ru').format(date),
            date:`${day}-${month}-${year}`,
            time:{hours,minutes}
        }
    
        return result
    },

    getParsDate(date:string):string{

        const arr = date.split('.')

        return arr.join('/')

    }

}