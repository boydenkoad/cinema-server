export default class ApiError extends Error{
    status:number = 0
    errors:any

    constructor(status:number,message:any,errors:any[]=[]){
        super(message)
        this.status = status,
        this.errors = errors
    }

    static UnauthorizedError(){
        return new ApiError(401,'Пользователь не авторизован',[])
    }

    static BadRequest(massage:string,errors:any[] = []){
        return new ApiError(400,massage,errors)
    }
}