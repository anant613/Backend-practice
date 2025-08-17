class ApiResponse{
    constructor(statusCode,data,message = "Sucess"){
        this.statuscode = statuscode
        this.data = data
        this.message = message
        this.sucess = statusCode<400;
    }
}