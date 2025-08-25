const adminAuth = (req, res, next) => {
    const token = "abc";
    const result = token === "abc";
    if (result) {
        next();
    } else {
        res.status(401).send("Unauthorized");
    }
}
const userAuth = (req, res, next) => {
    const token = "xyz";
    const result = token === "xeyz"; 
    if (result) {
        next();
    } else {
        res.status(401).send("unauthorized");
    } 
}
module.exports = {adminAuth, userAuth};