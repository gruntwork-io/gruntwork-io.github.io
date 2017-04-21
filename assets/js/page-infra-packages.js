(function (gruntwork) {
  "use strict";

  function toggle(e) {
    if (e.target.tagName === 'A') {
      return true;
    }

    e.preventDefault();
    var pkg = this;

    if (gruntwork.hasClass(pkg, 'open')) {
      gruntwork.removeClass(pkg, 'open');
    } else {
      gruntwork.addClass(pkg, 'open');
    }
  }

  var moreInfoButtons = document.querySelectorAll('.package-container');
  for (var i = 0; i < moreInfoButtons.length; i++) {
    moreInfoButtons[i].addEventListener('click', toggle, false);
  }
})(window.gruntwork);

