const crypto = require("crypto");
// const value = crypto.createHash('sha256').update(pwd).digest('hex');
const { TIMEOUT, checkR, getDice } = require("../public/common");

function acquireLock(app) {
  if (app.transactionUID && app.transactionStartTime + TIMEOUT > Date.now()) {
    return false; // still waiting for previous transaction
  }

  app.transactionUID = crypto.randomBytes(16).toString("hex");
  app.transactionStartTime = Date.now();

  return true;
}

function releaseLock(app) {
  app.transactionUID = null;
}

function checkLock(req) {
  if (req.app.transactionStartTime + TIMEOUT < Date.now()) {
    // lock expired -> release it
    releaseLock(req.app);
    return false;
  }

  return req.query.transactionUID === req.app.transactionUID;
}

function initiate(req, res) {
  if (!acquireLock(req.app)) {
    return res.status(509).json({ error: "Server Busy" });
  }

  const r2 = crypto.randomBytes(16).toString('hex') + Date.now();
  console.log(r2);
  req.app._r2 = r2;
  req.app._s1 = req.query.s1;
  const s2 = crypto.createHash('sha256').update(`${r2}`).digest('hex');

  return res.json({
    s2,
    s1: req.query.s1,
    transactionUID: req.app.transactionUID,
  });
}

function finalize(req, res) {
  if (!checkLock(req)) {
    return res.status(400).json({ error: "Invalid transactionUID" });
  }

  const { r1 } = req.query;
  const r2 = req.app._r2;
  const h = crypto.createHash('sha256').update(r1).digest('hex');

  if (!checkR(r1)) {
    releaseLock(req.app);
    return res.status(400).json("Invalid parameter");
  }
  if (req.app._s1 !== h) {
    releaseLock(req.app);
    return res.status(400).json("You are cheating");
  }

  const serverDice = getDice(r1, r2, 2);
  releaseLock(req.app);
  return res.json({ r2: req.app._r2, serverDice });
}

module.exports = {
  initiate,
  finalize,
};
