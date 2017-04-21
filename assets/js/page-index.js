(function (gruntwork) {
  "use strict";

  var readMoreBtn = document.querySelector('.read-more-btn');
  readMoreBtn.addEventListener('click', function (event) {
    event.preventDefault();

    gruntwork.scrollTo(document.querySelector('#promo').offsetTop, 300);
  });
})(window.gruntwork);
