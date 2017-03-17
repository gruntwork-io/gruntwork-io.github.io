var moreInfoButtons = document.querySelectorAll('.package__cta');

for (i = 0; i < moreInfoButtons.length; i++) {
  moreInfoButtons[i].addEventListener('click', toggleItem1, false);
}

function toggleItem1 (e) {
  e.preventDefault();

  var package = this.parentNode.parentNode;

  var textContainer = package.querySelector('.package__text');
  if (textContainer.style.maxHeight === '100%') {
    this.innerHTML = 'More info'
    textContainer.style.maxHeight = '50px';
  } else {
    this.innerHTML = 'Less info'
    textContainer.style.maxHeight = '100%';
  }
}
