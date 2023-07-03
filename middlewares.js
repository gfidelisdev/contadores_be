const ping = require("ping")
const getPrinterStatus = async (printer_ip) => {
    res = await ping.promise().probe(printer_ip, { timeout: 1 })
    return res
}

const getPrintersStatus = async (req, res, next) => {
    console.log("🚀 ~ file: middlewares.js:8 ~ getPrintersStatus ~ req:", req)
    console.log("🚀 ~ file: middlewares.js:8 ~ getPrintersStatus ~ res:", res)
    next()
}

module.exports = { getPrintersStatus, getPrintersStatus }
