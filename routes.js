const Counters = require("./counters")
const Printers = require("./printers")
const Failures = require("./failures")
const { getPrintersStatus } = require("./middlewares")
const route = (app) => {
    app.post("/api/bymonth", Counters.list)
    app.post("/api/byinterval", Counters.filter)
    app.get("/api/printers", Printers.list)
    app.post("/api/failures", getPrintersStatus, Failures.filter)
}

module.exports = route
