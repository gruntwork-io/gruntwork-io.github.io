/**
 * Javascript specially for the IaC Library page.
 */
(function () {

  // Returns a function, that, as long as it continues to be invoked, will not
  // be triggered. The function will be called after it stops being called for
  // N milliseconds. If `immediate` is passed, trigger the function on the
  // leading edge, instead of the trailing.
  // Ensures a given task doesn't fire so often that it bricks browser performance.
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

  /**
   * Function displays the total items displayed on the page
   */
  function showItemsCount(totalCount, numSubmodules) {
    if (searchEntry.type === 'libraryEntries') {
      $('#search-results-count').show();
      if (totalCount > 0 && numSubmodules > 0) {
        $('#search-results-count').html("<strong>" + totalCount + "</strong> repos (~<strong>" + numSubmodules + "</strong> modules)");
      } else {
        $('#search-results-count').text("0 repos");
      }
    } else {
      if (totalCount > 0 && numSubmodules === 0) {
        $('#search-results-count').html("<strong>" + totalCount + "</strong> post(s) found");
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

  /**
   * Function that counts how many items are on the page
   */
  function showInitialItemsCount() {
    let numSubmodules = 0;
    for (let i = 0; i < searchEntry.entries.length; i++) {
      if (searchEntry.type === 'libraryEntries') {
        numSubmodules += libraryEntries[i].num_submodules;
      }
      searchEntry.entries;
    }
    showItemsCount(searchEntry.entries.length, numSubmodules);
  }

  let searchEntry;

  function initialEntry() {
    $('#no-matches').hide();
    searchEntry = detectSearchEntry();
    $(showInitialItemsCount);
    $(performSearch($('.cloud-filter #aws')));
  }

  // Initial entry on load
  $(initialEntry);

  /**
   * Function that where the search is being performed from
   */
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


  /**
   * A function to display or hide the category of search
   * @type {Function}
   */
  function displayCategory(entry) {
    let categoryArr = $.merge($('.category-head'), $('.categories ul li'));
    categoryArr.each(function () {
      let category = $(this).text().toLowerCase();
      if (entry.category === category) {
        $(`.categories ul .${category}`).show();
        $(`#${category}.category-head`).show();
      }
    });
  }


  /**
   * A function to search the IaC Lib and Deployment guides. Can also be used for other pages that need it.
   * To show/hide the proper elements based on the results.
   * @type {Function}
   */
  function filterData(searchValue, type) {

    // if(searchValue === 'azure') {
    //   $('.guide-listing').addClass('#overlay');
    // }

    $('#no-matches').hide();

    if (searchValue && searchValue.length > 0) {

      let lowerText = searchValue.toLowerCase();

      let searchQueries = lowerText.split(" ");

      if (searchEntry.type === 'libraryEntries') {
        $('.table-clickable-row').hide();
      } else if (searchEntry.type === 'guideEntries') {
        $('#search-results-count').hide();
        $('.guide-card').hide() &&
          $('.category-head').hide() &&
          $('.categories ul li').hide();
      }

      let entries = searchEntry.entries;

      let matches = 0;
      let submoduleMatches = 0;
      let searchContent;

      entries.map(entry => {
        let matchesAll = true;

        searchQueries.map(searchQuery => {
          switch (true) {
            case searchEntry.type === 'libraryEntries':
              searchContent = entry.text;
              break;
            case searchEntry.type === 'guideEntries' && type === 'wordSearch':
              searchContent = entry.title + entry.category + entry.content + entry.tags;
              break;
            case searchEntry.type === 'guideEntries' && type === 'tagSearch':
              searchContent = entry.tags;
              break;
            case searchEntry.type === 'guideEntries' && type === 'cloudSearch':
              searchContent = entry.cloud;
              break;
            default:
              "Not Valid"
          }

          if (searchContent.indexOf(searchQuery) < 0) {
            matchesAll = false;
          }
        });

        //Checks if results were found and displays results accordingly
        if (matchesAll) {
          displayCategory(entry);
          $("#" + entry.id).show();
          matches++;
          (searchEntry.type === 'libraryEntries') ? submoduleMatches += entry.num_submodules: submoduleMatches = 0;
          return;
        }
      });


      if (matches === 0) {
        $('#search-results-count').hide();
        $('#no-matches').show();
        return;
      }

      showItemsCount(matches, submoduleMatches);
    } else {
      if (searchEntry.type === 'libraryEntries') {

        showInitialItemsCount();
        $('.table-clickable-row').show();

      } else if (searchEntry.type === 'guideEntries') {
        showAllItems();
      }
    }
  }

  /**
   * Note
   * This function is wrapped in a "debounce" so that if the user is typing quickly, we aren't trying to run searches
   * (and fire Google Analytics events!) on every key stroke, but only when they pause from typing.
   * @type {Function}
   */
  let searchData = debounce(function (event) {
    let target = $(event.currentTarget);
    let searchValue = target.val();

    filterData(searchValue, 'wordSearch');
  }, 250);


  /* Triggered when filter checkboxes are checked */
  $(document).ready(() => {

    $('.tags .checkbox input[type="checkbox"]').on('change', function () {
      let checked = $('input[type="checkbox"]:checked');
      if (!checked) {
        showAllItems();
        return; /* Return if nothing checked */
      }
      checked.each(() => {
        let searchValue = $(this).val();

        filterData(searchValue, 'tagSearch');
      });
    });
  });


  function performSearch(filterButton) {
    const id = filterButton.attr('id');

    if (filterButton.hasClass('initialSelect') && filterButton.hasClass('active-button') ) {
      filterButton.removeClass('initialSelect');
      filterButton.removeClass('active-button');
      $('#no-matches').hide();
      showAllItems();
    } else {
      filterButton.addClass('active-button');
      filterButton.addClass('initialSelect');
      filterButton.siblings().removeClass('active-button');
      filterData(id, 'cloudSearch');
    }
  }

  /* Search box on library page */
  $('#js-search-library').on("keyup", searchData);

  /* Triggered on click of any cloud filtering buttons */
  $('.cloud-filter .filter').click(function () {
    const filterButton = $(this);

    performSearch(filterButton);
  });


  /* Search box on guides page */
  $('#search-box').on("keyup", searchData);

}());
