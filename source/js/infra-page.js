function addClass(el, className) {
  if (el.className.indexOf(className) === -1) {
    el.className += ' ' + className;
  }
}

function removeClass(el, className) {
  var elClass = ' ' + el.className + ' ';
  while (elClass.indexOf(' ' + className + ' ') != -1) {
    elClass = elClass.replace(' ' + className + ' ', '');
  }
  el.className = elClass;
}

var moreInfoButtons = document.querySelectorAll('.package__cta');

for (i = 0; i < moreInfoButtons.length; i++) {
  moreInfoButtons[i].addEventListener('click', toggleItem1, false);
}

function toggleItem1 (e) {
  e.preventDefault();

  var package = this.parentNode.parentNode.parentNode;

  var textContainer = package.querySelector('.package__text');
  if (textContainer.style.maxHeight === '100%') {
    removeClass(package, 'open');
    this.innerHTML = 'More info'
    textContainer.style.maxHeight = '50px';
  } else {
    addClass(package, 'open');
    this.innerHTML = 'Less info'
    textContainer.style.maxHeight = '100%';
  }
}
