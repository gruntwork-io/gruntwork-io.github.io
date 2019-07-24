// Use regular expression to find the cookie we made. Inspired from https://stackoverflow.com/a/25490531
const getCookiebyName = function (name){
  const pair = document.cookie.match(new RegExp(name + '=([^;]+)'));
  return !!(pair && pair.length >= 2) ? pair[1] : null;
};

// Sets a cookie that expires after a year.
const setCookie = function (name, value, days) {
  let expires = '';
  if (days) {
    const date = new Date();
    date.setTime(date.getTime() + (days*24*60*60*1000));
    expires = '; expires=' + date.toUTCString();
  }
  document.cookie = name + '=' + (value || '') + expires + '; path=/';
};

// Generate UUID. Inspired by https://stackoverflow.com/a/8809472
function generateUUID() {
  let d = new Date().getTime();
  if (typeof performance !== 'undefined' && typeof performance.now === 'function'){
    d += performance.now();
  }
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = (d + Math.random() * 16) % 16 | 0;
    d = Math.floor(d / 16);
    return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
  });
}
