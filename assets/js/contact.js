/**
 * Fetch the user's locale and write it to the contact us form submission. This is useful because we'll use the
 * user's locale to assign inbound leads.
 */
$(function () {

  // Inspired by https://stackoverflow.com/a/31135571
  function getUserLocale()
  {
    if (navigator.languages !== undefined)
      return navigator.languages[0];
    else
      return navigator.language;
  }

  // In Safari on macOS and iOS prior to 10.2, the country code returned is lowercase: "en-us", "fr-fr" etc.
  // This function will take a locale and normalize its country code to "en-US", "fr-FR", etc.
  function normalizeLocale(localeRaw) {
    var localeTokens = localeRaw.split("-");

    var countryCodeRaw = "";
    var countryCodeNormalized = countryCodeRaw;

    if (localeTokens.length > 1) {
       countryCodeRaw = localeTokens[1];
       countryCodeNormalized = countryCodeRaw.toUpperCase();
       localeTokens[1] = countryCodeNormalized;
    }

    return localeTokens.join("-");
  }

  var localeRaw = getUserLocale();
  var localeNormalized = normalizeLocale(localeRaw);

  $('input#user-locale').val(localeNormalized);
});
