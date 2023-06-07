// check if user is logged in
module.exports.isLoggedIn = async function isLoggedIn(req, res) { 
    return res.status(401).send('\"msg\" : \"No token, authorization denied\"');
}

// check if user sends an invalid Token
module.exports.invalidToken = async function invalidToken(req, res) {
    return res.status(400).send('\"msg\" : \"Token is not valid\"');
}

// check if the task or user does not exist
module.exports.notFound = async function notFound(req, res) {
    return res.status(200).send('\"msg\": \"Not found\"');
}

// check if user give bad parameters
module.exports.badParameters = async function badParameters(req, res) {
    return res.status(400).send('\"msg\" : \"Bad parameter\"');
}
