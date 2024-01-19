export class UserDto{
    public id:number = 0
    public login:string = ''

    constructor(user:any){
        this.id = user['id']
        this.login = user['login']
    }

    get(){
        return {id:this.id,login:this.login}
    }

}
