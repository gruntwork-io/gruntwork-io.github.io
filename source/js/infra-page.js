var classHelp = require('./utils/classes');

var moreInfoButtons = document.querySelectorAll('.package-container');

for (i = 0; i < moreInfoButtons.length; i++) {
  moreInfoButtons[i].addEventListener('click', toggle, false);
}

function toggle (e) {
  if (e.target.tagName === 'A') {
    return true;
  }

  e.preventDefault();
  var package = this;

  var textContainer = package.querySelector('.package__text');
  if (classHelp.hasClass(package, 'open')) {
    classHelp.removeClass(package, 'open');
  } else {
    classHelp.addClass(package, 'open');
  }
}
