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
    let timeout;
    return function () {
      let context = this,
        args = arguments;
      let later = function () {
        timeout = null;
        if (!immediate) func.apply(context, args);
      };
      let callNow = immediate && !timeout;
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
      if (callNow) func.apply(context, args);
    };
  }

  function showItemsCount(totalCount, numSubmodules) {
    if (entries.type == 'libraryEntries') {
      if (totalCount > 0 && numSubmodules > 0) {
        $('#search-results-count').html("<strong>" + totalCount + "</strong> repos (~<strong>" + numSubmodules + "</strong> modules)");
      } else {
        $('#search-results-count').text("0 repos");
      }
    } else {
      if (totalCount > 0 && numSubmodules == 0) {
        $('#search-results-count').html("<strong>" + totalCount + "</strong> found");
      }
    }
  }

  function showInitialItemsCount() {
    let numSubmodules = 0;
    let entries = detectSearchEntry();
    for (let i = 0; i < entries.length; i++) {
      if (entries.type == 'libraryEntries') return numSubmodules += libraryEntries[i].num_submodules;
      return entries;
    }
    showItemsCount(entries.length, numSubmodules);
  }

  // Show initial module count on load
  $(showInitialItemsCount);

  /**
   * A hacky function to search the IaC Lib and show/hide the proper elements in the table based on the results. Note
   * that we wrap the function in a "debounce" so that if the user is typing quickly, we aren't trying to run searches
   * (and fire Google Analytics events!) on every key stroke, but only when they pause from typing.
   * @type {Function}
   */
  $('#no-matches').hide();

  function detectSearchEntry() {
    let entries = [];
    if (window.libraryEntries) {

      entries = window.libraryEntries;
      return {
        entries,
        type: 'libraryEntries'
      };

    } else if (window.guideEntries) {

      entries = window.guideEntries;
      return {
        entries,
        type: 'guideEntries'
      };
    }
  }

  let searchData = debounce(function (event) {
    let target = $(event.currentTarget);
    let text = target.val();

    $('#no-matches').hide();
    let searchEntry = detectSearchEntry();

    if (text && text.length > 0) {
      // Track what users are searching for via Google Analytics events
      //   ga('send', 'event', "iac-lib", "search", "query", text);

      let lowerText = text.toLowerCase();
      let searchQueries = lowerText.split(" ");

      if (searchEntry.type == 'libraryEntries') {
        $('.table-clickable-row').hide();
      } else if (searchEntry.type == 'guideEntries') {
        $('.guide-card').hide() && $('.category-head').hide() && $('.categories ul').hide();
      }

      let entries = searchEntry.entries;

      let matches = 0;
      let submoduleMatches = 0;

      for (let i = 0; i < entries.length; i++) {
        let entry = entries[i];
        let matchesAll = true;
        for (let j = 0; j < searchQueries.length; j++) {
          let searchQuery = searchQueries[j];
          let searchContent;
          if (searchEntry.type == 'libraryEntries') {
            searchContent = entry.text;
          } else if (searchEntry.type == 'guideEntries') {
            searchContent = entry.title + entry.category + entry.content + entry.tags;
          }
          if (searchContent.indexOf(searchQuery) < 0) {
            matchesAll = false;
            break;
          }
        }

        if (matchesAll) {
          $("#" + entry.id).show();
          matches++;
          (searchEntry.type == 'libraryEntries') ? submoduleMatches += entry.num_submodules: submoduleMatches = 0;
        }
      }
      if (matches === 0) {
        $('#no-matches').show();
      }

      showItemsCount(matches, submoduleMatches);
    } else {
      if (searchEntry.type == 'libraryEntries') {

        showInitialItemsCount();
        $('.table-clickable-row').show();

      } else if (searchEntry.type = 'guideEntries') {
        $('.guide-card').show() && $('.category-head').show() && $('.categories ul').show();
      }
    }
  }, 250);

  /* Search box on guides page */
  $('#js-search-library').on("keyup", searchData);

  /* Search box on library page */
  $('#search-box').on("keyup", searchData);

}());
