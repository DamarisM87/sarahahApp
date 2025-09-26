
import { nanoid } from 'nanoid';
import userModel, { userRoles } from '../../DB/models/user.model.js';
import {Hash, Compare, verifyToken, generateToken, Encrypt, Decrypt, eventEmitter} from '../../utils/index.js'
import revokeTokenModel from '../../DB/models/revoke-token.model.js';

//=========sign up=============

export const signUp = async(req, res, next) =>{
    
    const {name, email, password,cPassword, age, gender, phone, role} = req.body;
  

    if (await userModel.findOne({email})){
        throw new Error("user already exists", {cause:409})
    }

    // const hash = bcrypt.hashSync(password, +process.env.SALT_ROUNDS)
    const hash = await Hash({plainText: password, SALT_ROUNDS: process.env.SALT_ROUNDS})  
    var encryptedPhone = await Encrypt({plainText: phone, SECRET_KEY: process.env.SECRET_KEY})
    
    //generate confirm link
    // const token = jwt.sign({email}, process.env.SIGNATURE,{expiresIn: 60*3}) 
    eventEmitter.emit("sendEmail", {email})
    const user = await userModel.create({
        name,
        email,
        password: hash,
        age,
        gender,
        phone: encryptedPhone,
        role
    });
    return res.status(201).json({message: " user created successfully ", user})
}


//============ confirm email ==============
export const confirmEmail = async(req,res, next) =>{
  const {token} = req.params
  if(!token)
    { throw new Error("token not found", {cause: 404})}

  // const decoded = jwt.verify(token, process.env.SIGNATURE)
  const decoded = await verifyToken({token, SIGNATURE: process.env.SIGNATURE})
  const user = await userModel.findOne({email: decoded.email, confirmed: false})
if(!user){
  throw new Error("user does not exist or email already confirmed", {cause: 404})
}
user.confirmed = true
await user.save()
return res.status(200).json({message: " confirmed successfully ", })

}
 
//===========sign in =============
export const signIn = async(req, res, next) =>{

   
        //find email
    const {email, password} = req.body;
    const user = await userModel.findOne({email, confirmed:true})
       if (!user){
             { throw new Error("email not found", {cause: 404})}

       }

       //compare password
    // const match = bcrypt.compareSync(password, user.password)
   
    // if (!match){
    //      { throw new Error("invalid password", {cause: 400})}
    // }

    if (! await Compare({plainText: password, cipherText: user.password})){
           throw new Error("invalid password", {cause: 400})
    }

    //create token
    const access_token = await generateToken({
      payload: {id: user._id, email},
      SIGNATURE: user.role == userRoles.user? process.env.ACCESS_TOKEN_USER: process.env.ACCESS_TOKEN_ADMIN,
      options: {expiresIn: "1h", jwtid: nanoid()}
    })

    const refresh_token = await generateToken({
      payload: {id: user._id, email},
      SIGNATURE: user.role == userRoles.user? process.env.REFRESH_TOKEN_USER : process.env.REFRESH_TOKEN_ADMIN,
      options: {expiresIn: "1y", jwtid: nanoid()}
    })

     return res.status(201).json({message: "successfully logged in", access_token, refresh_token})


}

// ======================= get profile =========================

export const getProfile = async (req, res, next) => {
 
    const phone = await Decrypt({cipherText: req.user.phone, SECRET_KEY: process.env.SECRET_KEY})
    req.user.phone = phone



    return res.status(200).json({ message: "success", user: req.user });
};

//======================= sign out ==========================
export const signOut = async(req, res, next) =>{
  const revokeToken = await revokeTokenModel.create({
    tokenId: req.decoded.jwtid,
    expireAt: req.decoded.exp
  })
  return res.status(200).json({message: " successfully logged out"})

}