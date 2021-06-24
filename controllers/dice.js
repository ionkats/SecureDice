const crypto = require("crypto");
// const value = crypto.createHash('sha256').update(pwd).digest('hex');

function initiate(req, res) {
    const r2 = crypto.randomBytes(16).toString('hex') + Date.now();
    console.log(r2)
    req.app._r2 = r2;
    req.app._s1 = req.query.s1;
    const s2 = crypto.createHash('sha256').update(""+r2).digest('hex');
    return res.json({"s2": s2, s1: req.query.s1});
}

function finalize(req, res) {
    const r1 = req.query.r1;
    const r2 = req.app._r2;
    const h = crypto.createHash('sha256').update(r1).digest('hex');
    // console.log("crypto = ",h,", CryptoJS = ", req.app._s1);
    // console.log("r1 = ",r1);
    if (req.app._s1==h){
        // Add the first byte of r1 and r2 and get the dice of the server from them
        try {
            const firstR1 = Number.parseInt(r1.substr(0, 2), 16);
            const firstR2 = Number.parseInt(r2.substr(0, 2), 16);
            const serverDice = (firstR1 + firstR2) % 6 + 1; 
            return res.json({"r2": req.app._r2, "serverDice": serverDice});
        } catch (_e) {
            return res.status(400).json("Invalid parameter");
        }
    } else {
        return res.status(400).json("You are cheating");
    }
    
}

module.exports = {
    initiate,
    finalize
};