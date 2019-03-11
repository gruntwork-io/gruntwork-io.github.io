/**
 * Cookie notice
 * @author AKOS
 *
 * This cookie script must load AFTER the Intercom code above to detect the global "Intercom" variable
 * and render the cookie notice right after Intercom's script is injected into the <body>. This will ensure
 * that our cookie notice renders ABOVE the Intercom bubble to avoid conflicts with z-index.
 */

(function ($) { "use strict";
  var cookieInnerHtml = '<div><p>By using this website you agree to our <a href="/cookie-policy/">cookie policy</a></p><button id="cookieModalClose" class="btn btn-primary">OK</button></div>';

  var getCookiebyName = function (name){
    var pair = document.cookie.match(new RegExp(name + '=([^;]+)'));
    return !!pair ? pair[1] : null;
  };

  var setCookie = function (name, value, days) {
    var expires = '';
    if (days) {
      var date = new Date();
      date.setTime(date.getTime() + (days*24*60*60*1000));
      expires = '; expires=' + date.toUTCString();
    }
    document.cookie = name + '=' + (value || '')  + expires + '; path=/';
  };

  var initCookie = function () {

    // Don't create cookie notice if already acknowledged
    if (getCookiebyName('GruntyCookie')) {
      return;
    }

    // Create the cookie modal
    var $cookieModal = $('<div />');
    $cookieModal.attr('id', 'gruntyCookie');
    $cookieModal.css('z-index', '2147483647');
    $cookieModal.html(cookieInnerHtml);

    $(document).on('click', '#cookieModalClose', function () {
      setCookie('GruntyCookie', '1', 365);
      $cookieModal.hide();
    });

    $('body').append($cookieModal);
  };

  // Checks for the global Intercom object is set from the Intercom script.
  if (!!window.Intercom) {
    // Perform multiple checks on Intercom.booted property and the injected container element.
    var cookieInterval;
    cookieInterval = setInterval(function () {

      if (!window.Intercom.booted) {
        return;
      }

      if (document.getElementById('intercom-container') === null) {
        return;
      }

      // Remove interval after Intercom has booted
      clearInterval(cookieInterval);
      initCookie();
    }, 250);
  } else {
    // Intercom wasn't detected on this page, render cookie as usual.
    initCookie();
  }

})(window.jQuery);
