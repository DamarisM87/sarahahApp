import joi from "joi"
import {Types} from "mongoose"


export let customId = (value, helper) =>{
    const result = Types.ObjectId.isValid(value)
    return result? value: helper.message("invalid id")
}

export const generalRules = {
    id: joi.string().custom(customId).required(),
    email: joi.string().email({tlds: {allow:true}, minDomainSegments: 2, maxDomainSegments: 2}),
    password: joi.string(),
    headers: joi.object({
        authorization: joi.string().required(),
        "content-length": joi.string().required(),
        connection: joi.string().required(),
        "accept-encoding": joi.string().required(),
        accept: joi.string().required(),
        host: joi.string().required(),
        "postman-token": joi.string().required(),
        "cache-control": joi.string().required(),
        "user-agent": joi.string().required(),
        "content-type": joi.string().required(),

    })
}