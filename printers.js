const knex = require("./database/database");

const Printers = {
    list: async (req, res) => {
        res.json(await Printers.getAll());
    },
    getAll: async () => {
        let printers = await knex("printers");
        return printers;
    },
};

module.exports = Printers;
