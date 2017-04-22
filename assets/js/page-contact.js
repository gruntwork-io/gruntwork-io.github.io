(function (gruntwork, serialize, axios) {
  "use strict";

  gruntwork.setupAccordion();

  var requireFields = ['name', 'email', 'company', 'overview'];
  var inCall = false;

  var form = document.querySelector('.contact-form');
  var submitButton = form.querySelector('.submit-btn');

  submitButton.addEventListener('click', function (e) {
    e.preventDefault();

    if (inCall) {
      return;
    }

    var data = serialize(form, { hash: true });
    var hasError = false;

    for (var i = 0; i < requireFields.length; i++) {
      var fieldName = requireFields[i];

      if (!(fieldName in data)) {
        var field = form.querySelector('[name=' + fieldName + ']');
        gruntwork.addClass(field.parentNode, 'has-error');
        hasError = true;
      }
    }

    if (!hasError) {
      inCall = true;
      submitButton.innerHTML = 'Loading...';
      axios({
        method: 'POST',
        url: 'https://formspree.io/info@gruntwork.io',
        data: data
      }).then(function (response) {
        inCall = false;
        submitButton.innerHTML = 'Submit';
        window.location.replace('/thanks');
      }).catch(function (error) {
        inCall = false;
        submitButton.innerHTML = 'Submit';
      });
    }
  });
})(window.gruntwork, window.serialize, window.axios);
