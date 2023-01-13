const knex = require("./database/database")
const helper = require("./helpers")
const Counters = {
    getTotals: (startCounters, endCounters) => {
        let totalPrints =
            endCounters["total_prints"] - startCounters["total_prints"]
        let totalCopies =
            endCounters["total_copies"] - startCounters["total_copies"]
        let totalPrintsColor =
            endCounters["total_prints_color"] -
            startCounters["total_prints_color"]
        let totalCopiesColor =
            endCounters["total_copies_color"] -
            startCounters["total_copies_color"]
        let totalScans =
            endCounters["total_scans"] - startCounters["total_scans"]
        return {
            totalCopies,
            totalCopiesColor,
            totalPrints,
            totalPrintsColor,
            totalScans,
        }
    },
    filter: async (req, res) => {
        printers = req.body.printers
        startTime = req.body.startTime
        endTime = req.body.endTime ? req.body.endTime : helper.getNow()

        printers = printers.map((printer) => {
            if (typeof printer == "number") {
                return { id: printer }
            }
            return printer
        })

        let counters = await Promise.all(
            printers.map(async (printer) => {
                let startCounters = await knex("counters")
                    .where("printer_id", printer.id)
                    .andWhere("created_at", ">=", startTime)
                    .orderBy("created_at", "asc")
                    .first()
                console.log(startCounters)
                if (!startCounters) {
                    return {
                        sn: printer["sn"],
                        ip: printer["ip"],
                        msg: `Não há dados para o período informado para a impressora com SN: ${printer["sn"]} e IP: ${printer["ip"]}`,
                    }
                }
                let endCounters = await knex("counters")
                    .where("printer_id", printer.id)
                    .andWhere("created_at", "<=", endTime)
                    .orderBy("created_at", "desc")
                    .first()

                startTime = helper.formatDate(startCounters["created_at"])
                endTime = helper.formatDate(endCounters["created_at"])

                return {
                    ...printer,
                    startCounters: { ...startCounters },
                    endCounters: { ...endCounters },
                    ...Counters.getTotals(startCounters, endCounters),
                    startTime,
                    endTime,
                }
            })
        )
        res.json(counters)
    },
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
                        sn: printer["sn"],
                        ip: printer["ip"],
                        msg: `Não há dados para o período informado para a impressora com SN: ${printer["sn"]} e IP: ${printer["ip"]}`,
                    }
                }

                if (startCounters["created_at"].getFullYear() > initialYear) {
                    return {
                        sn: printer["sn"],
                        ip: printer["ip"],
                        msg: `Não há dados para o período informado para a impressora com SN: ${printer["sn"]} e IP: ${printer["ip"]}`,
                    }
                }

                if (startCounters["created_at"].getMonth() + 1 > initialMonth) {
                    return {
                        sn: printer["sn"],
                        ip: printer["ip"],
                        msg: `Não há dados para o período informado para a impressora com SN: ${printer["sn"]} e IP: ${printer["ip"]}`,
                    }
                }

                let endCounters = await knex("counters")
                    .where("printer_id", printer.id)
                    .andWhere(
                        "created_at",
                        ">",
                        `${finalYear}-${finalMonth}-01 00:00:00`
                    )
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
                let startTime = helper.formatDate(startCounters["created_at"])
                let endTime = helper.formatDate(endCounters["created_at"])
                return {
                    ...printer,
                    startCounters: { ...startCounters },
                    endCounters: { ...endCounters },
                    // totalPrints,
                    // totalCopies,
                    // totalPrintsColor,
                    // totalCopiesColor,
                    // totalScans,
                    ...Counters.getTotals(startCounters, endCounters),
                    startTime,
                    endTime,
                }
            })
        )
        res.json(counters)
    },
}

module.exports = Counters
