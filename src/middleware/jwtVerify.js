import jwt from 'jsonwebtoken' ;

export default (req, res, next) => {
    const authHeader = req.headers['authorization'] ;
    const token = authHeader && authHeader.split(' ')[1] ;
    if (token == null) {
        return res.status(403).json({message: "No Token Found"}) ;
    };
    try {
        const data = jwt.verify(token, process.env.JWT_SECRET) ;
        req.user = data ;
        next() ;
    } catch (err) {
        console.error(err) ;
        return res.status(401).json({message: err.message}) ;
    };
};
