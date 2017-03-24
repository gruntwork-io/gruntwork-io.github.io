var classHelp = require('./utils/classes');

var moreInfoButtons = document.querySelectorAll('.package__cta');

for (i = 0; i < moreInfoButtons.length; i++) {
  moreInfoButtons[i].addEventListener('click', toggle, false);
}

function toggle (e) {
  e.preventDefault();

  var package = this.parentNode.parentNode.parentNode;

  var textContainer = package.querySelector('.package__text');
  if (classHelp.hasClass(package, 'open')) {
    classHelp.removeClass(package, 'open');
    this.innerHTML = 'More info'
  } else {
    classHelp.addClass(package, 'open');
    this.innerHTML = 'Less info'
  }
}
