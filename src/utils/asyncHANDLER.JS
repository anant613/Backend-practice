const asyncHANDLER = (requestHandler) => {
    return (req,res,next) => {
        Promise.resolve(requestHandler(req,res,next)).
        catch((err) => next(err))
    }
}

export {asyncHANDLER}

//const async handler = () => {}
//const async handler = (func) => () => {}
//const async handler = (func) => async() =>{}