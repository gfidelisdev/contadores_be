const ping = require("ping");
const getPrinterStatus = async (printer_ip) => {
    console.log(
        "🚀 ~ file: middlewares.js:3 ~ getPrinterStatus ~ printer_ip:",
        printer_ip
    );
    let res = await ping.promise.probe(printer_ip, { timeout: 1 });
    console.log(
        "🚀 ~ file: middlewares.js:4 ~ getPrinterStatus ~ res:",
        res.alive
    );
    return res.alive;
};

const getPrintersStatus = async (req, res, next) => {
    console.log("🚀 ~ file: middlewares.js:8 ~ getPrintersStatus ~ req:", req);
    console.log("🚀 ~ file: middlewares.js:8 ~ getPrintersStatus ~ res:", res);
    next();
};

module.exports = { getPrinterStatus, getPrintersStatus };
