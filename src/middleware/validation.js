const isEmpty = field => field.trim() === "" ? true : false;
//trim() removes whitespace from both ends of a string

const validateEmail = email => {
    const RegEx = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return RegEx.test(email);
};

/*A function to check if the object sent in a request is missing any of the required properties and if the values are empty or incorrect.
It takes three parameters:
-fields: an array of required fields as specified in functions below
-obj: the object sent in the request
-msg: an array of error messages that can be sent in the response
*/
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
                case "phoneNumber":
                    if (isEmpty(obj.phoneNumber) || !obj.phoneNumber.match(/^[0-9]{10}$/)) {
                        msg.push(field);
                    };
                    break;
                default: //for any other required field where we just need to check if it's empty
                    if (isEmpty(obj[`${field}`])) {
                        msg.push(field);
                    };             
            };
        };
    });
};
/*The bulk of the validation is in the checkProps() function above but we will still need to create a separate
validation function for each form to define what the required fields are and customize the error message. SW*/

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

export { validateUser };