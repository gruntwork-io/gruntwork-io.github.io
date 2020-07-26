/**
 * Fetch the user's timezone offset relative to UTC and write it to the contact us form submission. This is useful because
 * we'll use an Assignment Rule in Salesforce.com to automatically assign leads based on the offset value.
 */

(function () {

  // Per https://stackoverflow.com/a/34602679, the main limitation of using Javascript's builtin getTimezoneOffset() to
  // calculate Timezone is that daylight saving rules may change on several occasions during a year. But this doesn't
  // matter for our purposes, where we only need to know the approximate time zone to assign the lead to the right person.
  var offsetMins = new Date().getTimezoneOffset();

  // Why multiply by -1? Per https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/getTimezoneOffset#Description:
  // The time-zone offset is the difference, in minutes, from local time to UTC. Note that this means that the offset is
  // positive if the // local timezone is behind UTC and negative if it is ahead. For example, for time zone UTC+10:00
  // (Australian Eastern Standard Time, Vladivostok Time, Chamorro Standard Time), -600 will be returned.
  var offsetHrs = (offsetMins / 60) * -1;

  $('input#user-utc-timezone-offset').val(offsetHrs);

  // Add the Google reCAPTCHA library to this page per https://developers.google.com/recaptcha/docs/v3
  // Because we don't have a clean way to selectively include <script> tags per page, we'll edit the DOM in Javascript
  // too add the equivalent of:
  // <script src="https://www.google.com/recaptcha/api.js"></script>
  var scriptTag = document.createElement("script");
  scriptTag.src = "https://www.google.com/recaptcha/api.js";
  document.head.appendChild(scriptTag);
}());

// Add a callback function to handle the token that the reCAPTCHA script gives us
function onContactFormSubmit(token) {
  document.getElementById("contact-form").submit();
}
