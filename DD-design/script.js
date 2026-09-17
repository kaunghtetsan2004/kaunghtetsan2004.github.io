(function () {
  "use strict";

  /* ------------------------------------------------------------------ */
  /* Calendar                                                           */
  /* ------------------------------------------------------------------ */
  var MONTH_NAMES = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  var WEEKDAY_SHORT = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  var WEEKDAY_LONG = [
    "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"
  ];

  function buildCalendar(date) {
    var year = date.getFullYear();
    var month = date.getMonth();
    var today = date.getDate();

    document.getElementById("calMonth").textContent = MONTH_NAMES[month];
    document.getElementById("calYear").textContent = String(year);

    var firstWeekday = new Date(year, month, 1).getDay();
    var daysInMonth = new Date(year, month + 1, 0).getDate();

    var grid = document.getElementById("calGrid");
    grid.innerHTML = "";

    // weekday header
    WEEKDAY_SHORT.forEach(function (label) {
      var cell = document.createElement("div");
      cell.className = "cal-weekday";
      cell.setAttribute("role", "columnheader");
      cell.textContent = label;
      grid.appendChild(cell);
    });

    // leading blanks
    for (var i = 0; i < firstWeekday; i++) {
      var blank = document.createElement("div");
      blank.className = "cal-day cal-day--empty";
      grid.appendChild(blank);
    }

    // day cells
    for (var d = 1; d <= daysInMonth; d++) {
      var cell = document.createElement("div");
      cell.className = "cal-day";
      if (d === today) cell.className += " cal-day--today";

      var num = document.createElement("span");
      num.className = "cal-day__num";
      num.textContent = String(d);
      cell.appendChild(num);
      grid.appendChild(cell);
    }

    var todayLabel = WEEKDAY_LONG[date.getDay()].slice(0, 3) +
      ", " + MONTH_NAMES[month].slice(0, 3) + " " + today + " \u2014 today";
    document.getElementById("calToday").textContent = todayLabel;
  }

  /* ------------------------------------------------------------------ */
  /* Clock                                                               */
  /* ------------------------------------------------------------------ */
  var hourHand = document.getElementById("hourHand");
  var minuteHand = document.getElementById("minuteHand");
  var secondHand = document.getElementById("secondHand");
  var digital = document.getElementById("clockDigital");

  function pad(n) { return n < 10 ? "0" + n : String(n); }

  function tick() {
    var now = new Date();

    var h = now.getHours() % 12;
    var m = now.getMinutes();
    var s = now.getSeconds();
    var ms = now.getMilliseconds();

    var secDeg = (s + ms / 1000) * 6;              // 360/60
    var minDeg = (m + s / 60) * 6;                 // 360/60
    var hourDeg = (h + m / 60) * 30;                // 360/12

    hourHand.style.transform = "rotate(" + hourDeg + "deg)";
    minuteHand.style.transform = "rotate(" + minDeg + "deg)";
    secondHand.style.transform = "rotate(" + secDeg + "deg)";

    digital.textContent = pad(now.getHours()) + ":" + pad(m) + ":" + pad(s);

    // keep the day-highlight in sync if the date rolls over at midnight
    if (s === 0 && m === 0 && h === 0) {
      buildCalendar(now);
    }

    requestAnimationFrame(tick);
  }

  /* ------------------------------------------------------------------ */
  /* Init                                                                */
  /* ------------------------------------------------------------------ */
  buildCalendar(new Date());
  requestAnimationFrame(tick);
})();