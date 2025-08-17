class Api extends Error{
    constructor(
       statuscode,
       message="Something went wrong",
       error = [],
       stack = ""
    ){
        super(message)
        this.statuscode = statuscode
        this.data = null
        this.message = message
        this.sucess = false;
        this.errors = errors
    }
}

export {apierror}