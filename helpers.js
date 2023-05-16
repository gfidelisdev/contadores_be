const helper = {
    formatDate: function (dt) {
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
        return `${dt.getFullYear()}-${
            dt.getMonth() + 1
        }-${dt.getDate()} ${dt.getHours()}:${dt.getMinutes()}:${dt.getSeconds()}}`;
    },
    getToday: function () {
        let dt = new Date();
        return `${dt.getFullYear()}-${dt.getMonth() + 1}-${dt.getDate()}`;
    },
};

module.exports = helper;
