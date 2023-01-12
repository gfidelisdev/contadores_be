const Counters = require("./counters")
const Printers = require("./printers")
const Failures = require("./failures")

const route = (app) => {
    app.post("/api/bymonth", Counters.list)
    app.post("/api/byinterval", Counters.filter)
    app.get("/api/printers", Printers.list)
    app.post("/api/failures", Failures.filter)
}

module.exports = route
