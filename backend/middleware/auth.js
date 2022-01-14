import jwt from "jsonwebtoken";

const auth = (req, res, next) => {
    const token = req.header("Authorization");
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
        if (err) {
            return res.status(400).send({
                message: "Invalid Authentication."
            });
        }
        req.user = decoded;
        next();
    });
};

export default auth;