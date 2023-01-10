const knex = require("./database/database")

const Printers = {
    list: async(req, res)=>{
        let printers = await knex("printers")
        res.json(printers)
    }
}

module.exports = Printers