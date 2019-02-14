/**
 * Fetch the user's timezone (expressed in UTC) and write it to the contact us form submission. This is useful because
 * we'll use the user's timezone to assign inbound leads.
 */

(function () {

  // Given an offset in mins, return a well-formatted time zone string.
  //
  // Example:
  //   formatOffset(420)
  //   returns "UTC+7"
  function getUtcTimezone(offsetMins) {
    var offsetHrs = offsetMins / 60;

    if (offsetHrs > 0) {
      return "UTC+" + offsetHrs;
    } else if (offsetHrs == 0) {
      return "UTC(0)";
    } else {
      return "UTC" + offsetHrs;
    }
  }

  // Per https://stackoverflow.com/a/34602679, the main limitation of using Javascript's builtin getTimezoneOffset() to
  // calculate Timezone is that daylight saving rules may change on several occasions during a year. But this doesn't
  // matter for our purposes, where we only need to know the approximate time zone to assign the lead to the right person.
  var offsetMins = new Date().getTimezoneOffset();
  var utcTimeZone = getUtcTimezone(offsetMins);

  $('input#user-timezone').val(utcTimeZone);

}());
