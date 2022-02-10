/**
 * Javascript specially for the search bad and filters used in the
 * IaC Library page. Please note that since we will be moving to a SaaS app,
 * we will need to make this code reuasble.
 */
(function () {
  /**
   * While we do not want the GCP guide to be displayed on the guides page going forward, we wish to
   * retain the ability for the link to still work and prevent damage to Search engine rankings
   */
  const idOfGcpGuideToExclude = 'deploying-a-dockerized-app-on-gcp-and-gke-card';

  function initialEntry() {
    $('#no-matches').hide();
    $(`#${idOfGcpGuideToExclude}`).hide();
  }

  // Initial entry on load
  $(initialEntry);

  // Returns a function, that, as long as it continues to be invoked, will not be
  // triggered. The function will be called after it stops being called for N
  // milliseconds. If `immediate` is passed, trigger the function on the leading
  // edge, instead of the trailing. Ensures a given task doesn't fire so often
  // that it bricks browser performance. From:
  // https://davidwalsh.name/javascript-debounce-function
  function debounce(func, wait, immediate) {
    let timeout;
    return function () {
      const context = this,
        args = arguments;
      const later = function () {
        timeout = null;
        if (!immediate)
          func.apply(context, args);
      };
      const callNow = immediate && !timeout;
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
      if (callNow)
        func.apply(context, args);
    };
  }

  /**
   * Function displays the total items displayed on the page
   */
  function showItemsCount(totalCount, numSubmodules) {
    if ($('.table-clickable-row').length > 0) {
      $('#search-results-count').show();
      if (totalCount > 0 && numSubmodules > 0) {
        $('#search-results-count').html("<strong>" + totalCount + "</strong>repos(~<strong>" + numSubmodules + "</strong> modules)");
      } else {
        $('#search-results-count').text("0 repos");
      }
    }
  }

  /**
   * Function to display all items on the page
   */
  function showAllItems() {
    $('.guide-card').show();
    $('.category-head').show();
    $('.categories ul li').show();
  }

  function initialDisplay() {
    $('#guide-listings').show();
    $('#no-matches').hide();
  }

  /**
   * Function to hide items on the page
   */
  function hideItems() {
    $('.guide-card').hide();
    $('.category-head').hide();
    $('.categories ul li').hide();
  }

  /**
   * Function that counts how many items are on the page
   */
  function showInitialItemsCount(searchEntry) {
    let numSubmodules = 0;
    for (let i = 0; i < searchEntry.length; i++) {
      numSubmodules += window.libraryEntries[i].num_submodules;
    }
    showItemsCount(searchEntry.length, numSubmodules);
  }

  /**
   * Function that where the search is being performed from
   */
  function detectSearchEntry() {
    const entries = window.libraryEntries ?
      window.libraryEntries :
      window.guideEntries;
      console.log("LIbrary entries", entries)

      return entries
  }

  /**
   * A naive function to slugify a string input and return a URL friendly output
   * of that string. This implementation was sourced from:
   * https://stackoverflow.com/a/1054862
   * @param {*} stringValue
   */
  function naiveSlugify(stringValue) {
    return stringValue.replace(/ /g,'-').replace(/[^\w-]+/g,'')
  }

  /**
   * A function to display or hide the category of search
   * @type {Function}
   */
  function displayCategory(entry) {
    const categoryArr = $.merge($('.category-head'), $('.categories ul li'));
    categoryArr.each(function () {
      const category = naiveSlugify($(this).text().toLowerCase());

      if (entry.category === category) {
        $(`.categories ul .${category}`).show();
        $(`#${category}.category-head`).show();
      }
    });
  }

  function getSearchData(entry, type) {
    let searchContent;

    if (type === 'wordSearch') {
      searchContent = entry.text || entry.title + entry.category + entry.content + entry.tags;
    } else if (type === 'tagSearch') {
      searchContent = entry.tags + entry.cloud;
    } else {
      searchContent = "Not Valid";
    }
    return searchContent;
  }

  /**
   * A function to search the Deployment guides.
   * To show/hide the proper elements based on the results.
   * @type {Function}
   */
  function filterSearchData(searchValue, type) {
    let matches = 0;
    let submoduleMatches = 0;

    const searchEntry = detectSearchEntry();

    if ($('.guide-card').length !== 0) {
      initialDisplay();
    }

    if (searchValue && searchValue.length > 0) {
      const searchQueries = searchValue.toLowerCase().split(" ");

      // First hide all items. We will go through each entry, passing through the search filter and selectively show the
      // items that match the search query in the next routine.
      $('.table-clickable-row').length === 0 ? hideItems() : $('.table-clickable-row').hide();

      // Go through each entry, pass through search filter and if it matches, display the entry by selecting with ID.
      searchEntry.forEach(entry => {
        let matchesAll = true;

        searchQueries.forEach(searchQuery => {
          const searchContent = getSearchData(entry, type);

          if (searchContent.indexOf(searchQuery) < 0) {
            matchesAll = false;
            // TODO: there is a bug here if the id contains a `.`, as that would be interpreted as a class filter.
            $(`#${entry.id}`).hide();
          }
        });

        //Checks if results were found and displays results accordingly
        if (matchesAll) {
          if (entry.id === idOfGcpGuideToExclude) {
            return
          }

          displayCategory(entry);
          $(`#${entry.id}`).show();
          matches++;
          if ($('.table-clickable-row').length > 0) {
            submoduleMatches += entry.num_submodules
          }
        }
      });

      if (matches === 0) {
        $('#search-results-count').hide();
        $('#no-matches').show();
        return;
      }

      showItemsCount(matches, submoduleMatches);
    } else if ($('.table-clickable-row').length > 0) {

      showInitialItemsCount(searchEntry);
      $('.table-clickable-row').show();

    } else {
      showAllItems();
    }
  }

  /**
   * Note
   * This function is wrapped in a "debounce" so that if the user is typing quickly, we aren't trying to run searches
   * (and fire Google Analytics events!) on every key stroke, but only when they pause from typing.
   * @type {Function}
   */
  const searchData = debounce(function (event) {
    const target = $(event.currentTarget);
    const searchValue = target.val();

    filterSearchData(searchValue, 'wordSearch');
  }, 250);

  function filterByTags() {
    const checkedTags = $('input[type="checkbox"]:checked');

    if (checkedTags.length === 0) {
      return showAllItems();
    }

    checkedTags
      .each(function () {
        const searchValue = $(this).val();
        filterSearchData(searchValue, 'tagSearch');
      });
  }

  /* Triggered when filter checkboxes are checked */
  $(document)
    .on('click', '.tags', function () {
      filterByTags();
    });

  /* Search box on library page */
  $('#js-search-library').on("keyup", searchData);

}());
