
function filter(params:string[]){
    function filterParams(){

        const result: string[] = []

        params.forEach((el,index)=>{
            result.push(`${el} = $${index+1}`)
        })
        
        return result
    }

    return `WHERE ${filterParams().join(' AND ')}`
}


export const queryConstructor = {
    
    create(tableName:string,queryParams:string[],isReturn:boolean = true,returnParams?:string[]){

        function valuesGenerate(){

            const result: string[] = []

            queryParams.forEach((el,index)=>{
                result.push(`$${index + 1 }`)
            })
            
            return result
        }

        const query = `INSERT INTO ${tableName}(${queryParams}) VALUES(${valuesGenerate()}) ${isReturn && `RETURNING ${returnParams||`*`}`}`
        return query

    },

    remove(tableName:string,searchParam:string[]){
        const query = `DELETE FROM ${tableName} ${filter(searchParam)} RETURNING *`
        return query
    },

    getAll(tableName:string,queryParams?:string[]){

        const query = `SELECT ${queryParams||'*'} FROM ${tableName}`
        return query
    },

    getOne(tableName:string,searchParam:string[],queryParams?:string[]){

        const query  = `SELECT ${queryParams||'*'} FROM ${tableName} ${filter(searchParam)}`

        return query
    },

    update(tableName:string,searchParam:string,changeParams:string[],queryParams?:string[]){

        function valuesGenerate(){

            const result: string[] = []

            changeParams.forEach((el,index)=>{
                result.push(`${el}=COALESCE($${index+1},${el})`)
            })
            
            return result
        }

        const query = `UPDATE ${tableName} SET ${valuesGenerate()} WHERE ${searchParam} = $${changeParams.length + 1} RETURNING ${queryParams||'*'}`
    
        return query
    },

    updateALL(tableName:string,queryParams:string[]){
       
        function valuesGenerate(){

            const result: string[] = []

            queryParams.forEach((el,index)=>{
                result.push(`${el}=COALESCE(${index+1}),${el}`)
            })
            
            return result
        }

        const query = `UPDATE ${tableName} SET ${valuesGenerate()}`
        
        return query
    }

}



