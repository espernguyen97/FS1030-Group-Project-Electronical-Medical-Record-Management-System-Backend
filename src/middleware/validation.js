const checkProps = (fields, obj, msg) => {
    fields.forEach(field => {
        if (!obj.hasOwnProperty(field)) {
            msg.push(field);
        } else {
            switch (field) {
                case "email":
                    if (isEmpty(obj.email) || !validateEmail(obj.email)) {
                        msg.push(field);
                    };
                    break; 
                case "password":
                    if (isEmpty(obj.password) || obj.password.length < 12 || obj.password.includes(" ")) {
                        msg.push(field);
                    };
                    break;              
            };
        };
    });
};

const isEmpty = field => field === "" ? true : false;

const validateEmail = email => {
    const RegEx = /^[^@\s]+@[^@\s\.]+\.[^@\.\s]+$/;
    return RegEx.test(email);
};

const validateUser = (req, res, next) => {
    let reqFields = ["password", "email"];
    let errMsg = {message: "validation error",
                invalid: []};
    let arr = errMsg.invalid;
    checkProps(reqFields, req.body, arr);
    if (arr.length) { 
        return res.status(400).json(errMsg); 
    };    
    next();
};

export {validateUser };