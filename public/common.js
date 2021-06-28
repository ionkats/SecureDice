const TIMEOUT = 5000;

function checkR(r) {
  if (!/^[0-9a-f]{32}[0-9]+$/.test(r)) { // see https://regex101.com/r/6BwepK/1 for regex explanation
    return false;
  }

  // only accept timestamps from TIMEOUT ago till now
  const timestamp = Number.parseInt(r.substr(32), 10);
  const now = Date.now();
  return timestamp < now && timestamp + TIMEOUT > now;
}

function getDice(r1, r2, whichDice = 1) {
  const randomStart = whichDice === 1 ? 2 : 0;
  const r1Byte = Number.parseInt(r1.substr(randomStart, 2), 16);
  const r2Byte = Number.parseInt(r2.substr(randomStart, 2), 16);

  return (r1Byte + r2Byte) % 6 + 1;
}

const common = {
  TIMEOUT,
  checkR,
  getDice,
};

if (typeof module !== "undefined") { // in node
  module.exports = common;
}
// in browser already in global scope
