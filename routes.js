const Counters = require("./counters")
const Printers = require("./printers")

const route = (app) =>{
    app.post('/api/bymonth', Counters.list)
}

module.exports = route