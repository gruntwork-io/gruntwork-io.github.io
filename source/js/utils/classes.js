module.exports.addClass = function (el, className) {
  if (el.className.indexOf(className) === -1) {
    el.className += ' ' + className;
  }
}

module.exports.removeClass = function (el, className) {
  var elClass = ' ' + el.className + ' ';
  while (elClass.indexOf(' ' + className + ' ') != -1) {
    elClass = elClass.replace(' ' + className + ' ', '');
  }
  el.className = elClass;
}
