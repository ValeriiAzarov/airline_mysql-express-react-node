import db from "../config/database.js";

const authAdmin = (req, res, next) => {
    db.query("SELECT * FROM users WHERE id = ?", [req.user.id], (err, data) => { 
        if (err) {                                   
            return res.status(500).send({            
                message: err.message
            });
        }
        else {
            if (data[0].role !== 1) {                 
                return res.status(500).send({
                    message: "Admin resources access denied."
                });
            } 
            next();
        }
    });
};

export default authAdmin;