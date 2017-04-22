(function (gruntwork, serialize, axios) {
  "use strict";

  gruntwork.setupAccordion();

  var inCall = false;

  var form = document.querySelector('.contact-form');
  var submitButton = form.querySelector('.submit-btn');

  submitButton.addEventListener('click', function (e) {
    e.preventDefault();

    if (inCall) {
      return;
    }
    inCall = true;

    var data = serialize(form, { hash: true });
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
  });
})(window.gruntwork, window.serialize, window.axios);
