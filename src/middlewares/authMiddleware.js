const authMiddleware = (req, res, next) => {

    console.log("AuthMiddleware called ...");

    next();
};


module.exports = authMiddleware;