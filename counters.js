const knex = require("./database/database")

const Counters = {
  list: async (req, res) => {
    // Busca os dados de ano e mês para a checagem
    year = parseInt(req.body.year)
    month = parseInt(req.body.month)
    initialYear = req.body.year
    finalYear = month + 1 == 13 ? `${year + 1}` : initialYear
    initialMonth = `0${month}`.slice(-2)
    finalMonth = month + 1 == 13 ? `01` : `0${month + 1}`.slice(-2)
    let printers = await knex("printers")
    printers = printers.map((p) => ({ ...p }))

    let counters = await Promise.all(
      printers.map(async (printer) => {
        let startCounters = await knex("counters")
          .where("printer_id", printer.id)
          .andWhere(
            "created_at",
            ">",
            `${initialYear}-${initialMonth}-01 00:00:00`
          )
          .first()
        if (!startCounters) {
          return {
            msg: `Não há dados para o período informado para a impressora com SN: ${printer["sn"]} e IP: ${printer["ip"]}`,
          }
        }
        let endCounters = await knex("counters")
          .where("printer_id", printer.id)
          .andWhere("created_at", ">", `${finalYear}-${finalMonth}-01 00:00:00`)
          .first()

        if (!endCounters) {
          endCounters = await knex("counters")
            .where("printer_id", printer.id)
            .andWhere(
              "created_at",
              ">",
              `${initialYear}-${initialMonth}-01 00:00:00`
            )
            .andWhere(
              "created_at",
              "<=",
              `${finalYear}-${finalMonth}-01 00:00:00`
            )
            .orderBy("created_at", "desc")

          endCounters = endCounters.map((eC) => ({ ...eC }))[0]
        }
        totalPrints =
          endCounters["total_prints"] - startCounters["total_prints"]
        totalCopies =
          endCounters["total_copies"] - startCounters["total_copies"]
        totalScans = endCounters["total_scans"] - startCounters["total_scans"]
        return {
          ...printer,
          startCounters: { ...startCounters },
          endCounters: { ...endCounters },
          totalPrints,
          totalCopies,
          totalScans,
        }
      })
    )
    res.json(counters)
  },
}

module.exports = Counters
