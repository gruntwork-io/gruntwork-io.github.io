var scrollTo = require('./utils/scroll');

var readMoreBtn = document.querySelector('.read-more-btn')

readMoreBtn.addEventListener('click', function (event) {
  event.preventDefault();

  scrollTo(document.body, document.querySelector('#promo').offsetTop, 300);
})
