(function() {
  /**
   * A user sees either the new IAC Page or this one on the static app.
   * This script will only run on the IAC Page.
   * We need to keep track of which page the user has seen to compare the impact
   * on the user's engagement.
   */
  setCookie("IACLibraryVersion", "Old-IAC");
})();
