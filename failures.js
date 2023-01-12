const knex = require("./database/database");

const Failures = {
  formatDate: function (dt) {
    console.log(dt);
    let year = dt.getFullYear();
    let month = `0${dt.getMonth() + 1}`;
    month = month.slice(-2);
    let day = `0${dt.getDate()}`;
    day = day.slice(-2);
    let hour = `0${dt.getHours()}`;
    hour = hour.slice(-2);
    let minute = `0${dt.getMinutes()}`;
    minute = minute.slice(-2);
    return `${hour}:${minute} ${day}/${month}/${year}`;
  },
  getNow: function () {
    let dt = new Date();
    return `${dt.getFullYear}-${
      dt.getMonth() + 1
    }-${dt.getDate()} ${dt.getHours()}:${dt.getMinutes}:${dt.getSeconds}}`;
  },
  filter: async (req, res) => {
    printers = req.body.printers;
    startTime = req.body.startTime;
    endTime = req.body.endTime ? req.body.endTime : Failures.getNow();
    console.warn(printers);

    printers = printers.map((printer) => {
      if (typeof printer == "number") {
        return { id: printer };
      }
      return printer;
    });

    let counters = await Promise.all(
      printers.map(async (printer) => {
        let startCounters = await knex("counters")
          .where("printer_id", printer.id)
          .andWhere("created_at", ">=", startTime)
          .orderBy("created_at", "asc")
          .first();
        if (!startCounters) {
          return {
            sn: printer["sn"],
            ip: printer["ip"],
            msg: `Não há dados para o período informado para a impressora com SN: ${printer["sn"]} e IP: ${printer["ip"]}`,
          };
        }
        let endCounters = await knex("counters")
          .where("printer_id", printer.id)
          .andWhere("created_at", "<=", endTime)
          .orderBy("created_at", "desc")
          .first();

        let totalPrints =
          endCounters["total_prints"] - startCounters["total_prints"];
        let totalCopies =
          endCounters["total_copies"] - startCounters["total_copies"];
        let totalPrintsColor =
          endCounters["total_prints_color"] -
          startCounters["total_prints_color"];
        let totalCopiesColor =
          endCounters["total_copies_color"] -
          startCounters["total_copies_color"];
        let totalScans =
          endCounters["total_scans"] - startCounters["total_scans"];

        startTime = Failures.formatDate(startCounters["created_at"]);
        endTime = Failures.formatDate(endCounters["created_at"]);

        return {
          ...printer,
          startCounters: { ...startCounters },
          endCounters: { ...endCounters },
          totalPrints,
          totalCopies,
          totalPrintsColor,
          totalCopiesColor,
          totalScans,
          startTime,
          endTime,
        };
      })
    );
    res.json(counters);
  },
  list: async (req, res) => {
    // Busca os dados de ano e mês para a checagem
    year = parseInt(req.body.year);
    month = parseInt(req.body.month);
    initialYear = req.body.year;
    finalYear = month + 1 == 13 ? `${year + 1}` : initialYear;
    initialMonth = `0${month}`.slice(-2);
    finalMonth = month + 1 == 13 ? `01` : `0${month + 1}`.slice(-2);
    let printers = await knex("printers");
    printers = printers.map((p) => ({ ...p }));

    let counters = await Promise.all(
      printers.map(async (printer) => {
        let startCounters = await knex("counters")
          .where("printer_id", printer.id)
          .andWhere(
            "created_at",
            ">",
            `${initialYear}-${initialMonth}-01 00:00:00`
          )
          .first();
        if (!startCounters) {
          return {
            sn: printer["sn"],
            ip: printer["ip"],
            msg: `Não há dados para o período informado para a impressora com SN: ${printer["sn"]} e IP: ${printer["ip"]}`,
          };
        }

        if (startCounters["created_at"].getFullYear() > initialYear) {
          return {
            sn: printer["sn"],
            ip: printer["ip"],
            msg: `Não há dados para o período informado para a impressora com SN: ${printer["sn"]} e IP: ${printer["ip"]}`,
          };
        }

        if (startCounters["created_at"].getMonth() + 1 > initialMonth) {
          return {
            sn: printer["sn"],
            ip: printer["ip"],
            msg: `Não há dados para o período informado para a impressora com SN: ${printer["sn"]} e IP: ${printer["ip"]}`,
          };
        }

        let endCounters = await knex("counters")
          .where("printer_id", printer.id)
          .andWhere("created_at", ">", `${finalYear}-${finalMonth}-01 00:00:00`)
          .first();

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
            .orderBy("created_at", "desc");

          endCounters = endCounters.map((eC) => ({ ...eC }))[0];
        }

        let totalPrints =
          endCounters["total_prints"] - startCounters["total_prints"];
        let totalCopies =
          endCounters["total_copies"] - startCounters["total_copies"];
        let totalPrintsColor =
          endCounters["total_prints_color"] -
          startCounters["total_prints_color"];
        let totalCopiesColor =
          endCounters["total_copies_color"] -
          startCounters["total_copies_color"];
        let totalScans =
          endCounters["total_scans"] - startCounters["total_scans"];
        let startTime = Counters.formatDate(startCounters["created_at"]);
        let endTime = Counters.formatDate(endCounters["created_at"]);
        return {
          ...printer,
          startCounters: { ...startCounters },
          endCounters: { ...endCounters },
          totalPrints,
          totalCopies,
          totalPrintsColor,
          totalCopiesColor,
          totalScans,
          startTime,
          endTime,
        };
      })
    );
    res.json(counters);
  },
};

module.exports = Failures;
