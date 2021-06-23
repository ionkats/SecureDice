const crypto = require("crypto");
// const value = crypto.createHash('sha256').update(pwd).digest('hex');

function initiate(req, res) {
    const r2 = crypto.randomInt(281474976710655);
    console.log(r2)
    req.app._r2 = r2;
    req.app._s1 = req.query.s1;
    const s2 = crypto.createHash('sha256').update(""+r2).digest('hex');
    res.json({"s2": s2, s1: req.query.s1});
}

function finalize(req, res) {
    const r1 = +req.query.r1;
    const r2 = req.app._r2;
    const h = crypto.createHash('sha256').update(""+r1).digest('hex');
    // console.log("crypto = ",h,", CryptoJS = ", req.app._s1);
    // console.log("r1 = ",r1);
    if (req.app._s1==h){
        // add the last byte of r1 and r2 and get the dice of the server from them
        const serverDice = (r1 % 256 + r2 % 256) % 6 + 1; 
        res.json({"r2": req.app._r2, "serverDice": serverDice});

    } else {
        res.status(400).json("You are cheating");
    }
    
}

module.exports = {
    initiate,
    finalize
};