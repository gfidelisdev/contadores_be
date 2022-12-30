const Counters = require("./counters")
const Printers = require("./printers")

const route = (app) => {
    app.post("/api/bymonth", Counters.list)
    app.post("/api/byinterval", Counters.filter)
}

module.exports = route
