var classHelp = require('./utils/classes');
var accordion = require('./utils/accordion');
var serialize = require('form-serialize');
var axios = require('axios');

accordion();

var requireFields = [
  'name',
  'email',
]

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
      classHelp.addClass(field.parentNode, 'has-error');
      hasError = true;
    }
  }

  if (!hasError) {
    inCall = true;
    submitButton.innerHTML = 'Loading...';
    axios({
      method: 'POST',
      url: 'https://formspree.io/konmpar@gmail.com',
      data: data
    })
      .then(function (response) {

        inCall = false;
        submitButton.innerHTML = 'Submit';
        window.location.replace(response.data.next);
      })
      .catch(function (error) {

        inCall = false;
        submitButton.innerHTML = 'Submit';
      });
  }
})
