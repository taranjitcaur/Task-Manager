const jwt = require('jsonwebtoken')
const User = require('../models/user')
const auth = async (req, res, next) => {
    try {
        const token = req.cookies.Authorization
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        const user = await User.findOne({ _id: decoded._id, 'tokens.token': token })
        if (!user) {
            throw new Error()
        }
        req.token = token
        req.user = user 
        next() 
    } catch (e) {       
        var err = new Error("Please Authenticate !");
        next(err)                       
    }    
}
module.exports = auth