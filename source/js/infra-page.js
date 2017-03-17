var classHelp = require('./utils/classes');

var moreInfoButtons = document.querySelectorAll('.package__cta');

for (i = 0; i < moreInfoButtons.length; i++) {
  moreInfoButtons[i].addEventListener('click', toggle, false);
}

function toggle (e) {
  e.preventDefault();

  var package = this.parentNode.parentNode.parentNode;

  var textContainer = package.querySelector('.package__text');
  if (textContainer.style.maxHeight === '100%') {
    classHelp.removeClass(package, 'open');
    this.innerHTML = 'More info'
    textContainer.style.maxHeight = '50px';
  } else {
    classHelp.addClass(package, 'open');
    this.innerHTML = 'Less info'
    textContainer.style.maxHeight = '100%';
  }
}
