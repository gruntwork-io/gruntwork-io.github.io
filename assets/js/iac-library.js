/**
 * Javascript specially for the IaC Library page.
 */

(function () {

  // Returns a function, that, as long as it continues to be invoked, will not
  // be triggered. The function will be called after it stops being called for
  // N milliseconds. If `immediate` is passed, trigger the function on the
  // leading edge, instead of the trailing.
  // From: https://davidwalsh.name/javascript-debounce-function
  function debounce(func, wait, immediate) {
    var timeout;
    return function() {
      var context = this, args = arguments;
      var later = function() {
        timeout = null;
        if (!immediate) func.apply(context, args);
      };
      var callNow = immediate && !timeout;
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
      if (callNow) func.apply(context, args);
    };
  }

  function showModuleCount(numRepos, numSubmodules) {
    if (numRepos > 0 && numSubmodules > 0) {
      $('#search-results-count').html("<strong>" + numRepos + "</strong> repos (~<strong>" + numSubmodules + "</strong> modules)");
    } else {
      $('#search-results-count').text("0 repos");
    }
  }

  function showInitialModuleCount() {
    var numSubmodules = 0;
    for (var i = 0; i < libraryEntries.length; i++) {
      numSubmodules += libraryEntries[i].num_submodules;
    }
    showModuleCount(libraryEntries.length, numSubmodules);
  }

  // Show initial module count on load
  $(showInitialModuleCount);

  /**
   * A hacky function to search the IaC Lib and show/hide the proper elements in the table based on the results. Note
   * that we wrap the function in a "debounce" so that if the user is typing quickly, we aren't trying to run searches
   * (and fire Google Analytics events!) on every key stroke, but only when they pause from typing.
   * @type {Function}
   */
  var searchLibrary = debounce(function(event) {
    var target = $(event.currentTarget);
    var text = target.val();

    $('#no-matches').hide();

    if (text && text.length > 0) {
      // Track what users are searching for via Google Analytics events
      ga('send', 'event', "iac-lib", "search", "query", text);

      var lowerText = text.toLowerCase();
      var words = lowerText.split(" ");

      $('.table-clickable-row').hide();

      var matches = 0;
      var submoduleMatches = 0;

      for (var i = 0; i < libraryEntries.length; i++) {
        var entry = libraryEntries[i];
        var matchesAll = true;
        for (var j = 0; j < words.length; j++) {
          var word = words[j];
          if (entry.text.indexOf(word) < 0) {
            matchesAll = false;
            break;
          }
        }

        if (matchesAll) {
          $("#" + entry.id).show();
          matches++;
          submoduleMatches += entry.num_submodules;
        }
      }

      if (matches === 0) {
        $('#no-matches').show();
      }

      showModuleCount(matches, submoduleMatches);
    } else {
      showInitialModuleCount();
      $('.table-clickable-row').show();
    }
  }, 250);

  /* Search box on library page */
  $('#js-search-library').on("keyup", searchLibrary);

}());
