const knex = require("./database/database")

const Counters = {
  list: async (req, res) => {
    console.log(req.body)
    year = parseInt(req.body.year)
    month = parseInt(req.body.month)
    initialYear = req.body.year
    finalYear = month + 1 == 13 ? `${year + 1}` : initialYear
    initialMonth = `0${month}`.slice(-2)
    finalMonth = month + 1 == 13 ? `01` : `0${month + 1}`.slice(-2)
    console.log(finalMonth)
    let printers = await knex("printers")
    printers = printers.map((p) => ({ ...p }))
    console.log(printers)

    let counters = await Promise.all(
      printers.map(async (printer) => {
        let countersFromPrinter = await knex("counters")
          .where("printer_id", printer.id)
          .andWhere(
            "created_at",
            ">=",
            `${initialYear}-${initialMonth}-01 00:00:00`
          )
          .andWhere("created_at", "<", `${finalYear}-${finalMonth}-01 00:00:00`)
        let startCounters = countersFromPrinter[0]
        let endCounters = countersFromPrinter[countersFromPrinter.length - 1]
        console.warn(startCounters)
        //startCounters = startCounters.map(sC=>({...sC}))
        //endCounters = endCounters.map(eC=>({...eC}))
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

    console.log(counters)

    let result = await knex("counters").where(function () {
      this.where(
        "created_at",
        ">=",
        `${initialYear}-${initialMonth}-01 00:00:00`
      ).andWhere("created_at", "<", `${finalYear}-${finalMonth}-01 00:00:00`)
    })
    let startCounters = await knex("counters")
      .where("created_at", ">=", `${initialYear}-${initialMonth}-01 00:00:00`)
      .first()
    let endCounters = await knex("counters")
      .where("created_at", "<=", `${finalYear}-${finalMonth}-01 00:00:00`)
      .first()

    console.log(`${initialYear}-${initialMonth}-01 00:00:00`)
    console.log(`${finalYear}-${finalMonth}-01 00:00:00`)
    // console.log(result)
    res.json(counters)
  },
}

module.exports = Counters
