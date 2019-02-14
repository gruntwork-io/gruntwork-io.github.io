/**
 * Fetch the user's timezone offset relative to UTC and write it to the contact us form submission. This is useful because
 * we'll use an Assignment Rule in Salesforce.com to automatically assign leads based on the offset value.
 */

(function () {

  // Per https://stackoverflow.com/a/34602679, the main limitation of using Javascript's builtin getTimezoneOffset() to
  // calculate Timezone is that daylight saving rules may change on several occasions during a year. But this doesn't
  // matter for our purposes, where we only need to know the approximate time zone to assign the lead to the right person.
  var offsetMins = new Date().getTimezoneOffset();
  var offsetHrs = offsetMins / 60;

  $('input#user-utc-timezone-offset').val(offsetHrs);

}());
