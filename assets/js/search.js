/**
 * Javascript specially for the search bad and filters used in the
 * IaC Library page and the deployment guides page.
 */
(function () {

  function initialEntry() {
    $('#no-matches').hide();
    $('#no-azure-results').hide();
    // Select AWS cloud by default on page load
    selectCloud($('.cloud-filter #aws'));
  }

  // Initial entry on load
  $(initialEntry);

  // Returns a function, that, as long as it continues to be invoked, will not
  // be triggered. The function will be called after it stops being called for
  // N milliseconds. If `immediate` is passed, trigger the function on the
  // leading edge, instead of the trailing.
  // Ensures a given task doesn't fire so often that it bricks browser performance.
  // From: https://davidwalsh.name/javascript-debounce-function
  function debounce(func, wait, immediate) {
    let timeout;
    return function () {
      const context = this,
        args = arguments;
      const later = function () {
        timeout = null;
        if (!immediate) func.apply(context, args);
      };
      const callNow = immediate && !timeout;
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
      if (callNow) func.apply(context, args);
    };
  }

  /**
   * Function displays the total items displayed on the page
   */
  function showItemsCount(searchEntry, totalCount, numSubmodules) {
    if (searchEntry.type === 'libraryEntries') {
      $('#search-results-count').show();
      if (totalCount > 0 && numSubmodules > 0) {
        $('#search-results-count').html("<strong>" + totalCount + "</strong> repos (~<strong>" + numSubmodules + "</strong> modules)");
      } else {
        $('#search-results-count').text("0 repos");
      }
    } else {
      if (totalCount > 0) {
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
  function showInitialItemsCount(searchEntry) {
    let numSubmodules = 0;
    for (const i = 0; i < searchEntry.entries.length; i++) {
      numSubmodules += libraryEntries[i].num_submodules;
    }
    showItemsCount(searchEntry, searchEntry.entries.length, numSubmodules);
  }

  /**
   * Function that where the search is being performed from
   */
  function detectSearchEntry() {
    let entries = [];
    entries = window.libraryEntries ? window.libraryEntries : window.guideEntries;
    return entries;
  }


  /**
   * A function to display or hide the category of search
   * @type {Function}
   */
  function displayCategory(entry) {
    const categoryArr = $.merge($('.category-head'), $('.categories ul li'));
    categoryArr.each(function () {
      const category = $(this).text().toLowerCase();
      if (entry.category === category) {
        $(`.categories ul .${category}`).show();
        $(`#${category}.category-head`).show();
      }
    });
  }



  function initalDisplay() {
    return (
      $('#guide-listings').show() &&
      $('#no-azure-results').hide() &&
      $('#no-matches').hide()
    );
  }

  function searchDisplay() {
    return (
      $('#search-results-count').hide() &&
      $('.guide-card').hide() &&
      $('.category-head').hide() &&
      $('.categories ul li').hide()
    )
  }
  /**
   * A function to search the IaC Lib and Deployment guides. Can also be used for other pages that need it.
   * To show/hide the proper elements based on the results.
   * @type {Function}
   */
  function filterData(searchValue, type) {
    let matches = 0;
    let submoduleMatches = 0;
    let searchContent;

    const searchEntry = detectSearchEntry();

    initalDisplay();

    if (searchValue && searchValue.length > 0) {
      const searchQueries = searchValue.toLowerCase().split(" ");

      searchDisplay();

      searchEntry.forEach(entry => {
        let matchesAll = true;

        searchQueries.forEach(searchQuery => {
          if(entry.text) {
            searchContent = entry.text;
          } else if(type === 'wordSearch') {
            searchContent = entry.title + entry.category + entry.content + entry.tags;
          } else if (type === 'tagSearch') {
            searchContent = entry.tags + entry.cloud;
          } else if (type === 'cloudSearch') {
            searchContent = entry.cloud;
          } else {
            return("Not Valid");
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
          submoduleMatches = 0;
          return;
        }
      });


      if (matches === 0) {
        $('#search-results-count').hide();
        $('#no-matches').show();
        return;
      }

      showItemsCount(searchEntry, matches, submoduleMatches);
    } else {
      if (searchEntry.type === 'libraryEntries') {

        showInitialItemsCount(searchEntry);
        $('.table-clickable-row').show();

      } else if (searchEntry.type === 'guideEntries') {
        showAllItems();
      }
    }
  }

  function filterLibraryData(searchValue) {
    let matches = 0;
    let submoduleMatches = 0;
    let searchContent;

    const searchEntry = detectSearchEntry();

    if (searchValue && searchValue.length > 0) {
      const searchQueries = searchValue.toLowerCase().split(" ");

      $('.table-clickable-row').hide();
     
      searchEntry.forEach(entry => {
        let matchesAll = true;

        searchQueries.forEach(searchQuery => {
          searchContent = entry.text;
          
          if (searchContent.indexOf(searchQuery) < 0) {
            matchesAll = false;
          }
        });

        //Checks if results were found and displays results accordingly
        if (matchesAll) {
          displayCategory(entry);
          $("#" + entry.id).show();
          matches++;
          submoduleMatches += entry.num_submodules;
          return;
        }
      });

      if (matches === 0) {
        $('#search-results-count').hide();
        $('#no-matches').show();
        return;
      }

      showItemsCount(searchEntry, matches, submoduleMatches);
    } else {
      showInitialItemsCount(searchEntry);
      $('.table-clickable-row').show();
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

    filterData(searchValue, 'wordSearch');
  }, 250);

  const searchLibraryData = debounce(function (event) {
    const target = $(event.currentTarget);
    const searchValue = target.val();

    filterLibraryData(searchValue);
  }, 250);


  /* Triggered when filter checkboxes are checked */
  $(document).on('click', '.tags', function () {
    filterCloudAndTags();
  });

  function filterCloudAndTags() {
    const checkedTags = $('input[type="checkbox"]:checked');
    const selectedCloud = $('.cloud-filter .active-button').attr("id");

    if (checkedTags.length === 0) {
      // Return filtered to whatever cloud is selected if no tag is checked
      // Or all items if no cloud is selected
      return selectedCloud ? filterData(selectedCloud, 'cloudSearch') : showAllItems();
    }
    checkedTags.each(function () {
      const searchValue = $(this).val();
      filterData(searchValue + (selectedCloud ? ' ' + selectedCloud : ''), 'tagSearch');
    });
  }

  function selectCloud(filterButton) {
    const id = filterButton.attr('id');

    if (filterButton.hasClass('initialSelect') && filterButton.hasClass('active-button')) {
      filterButton.removeClass('initialSelect');
      filterButton.removeClass('active-button');
      $('#guide-listings').show();
      $('#no-azure-results').hide();
      $('#no-matches').hide();
    } else {
      filterButton.addClass('active-button');
      filterButton.addClass('initialSelect');
      filterButton.siblings().removeClass('active-button');

      if (id === 'azure') {
        $('#guide-listings').hide();
        $('#no-azure-results').show();
        return;
      }
    }

    filterCloudAndTags();
  }

  /* Search box on library page */
  $('#js-search-library').on("keyup", searchLibraryData);

  /* Triggered on click of any cloud filtering buttons */
  $('.cloud-filter .filter').click(function () {
    const filterButton = $(this);
    selectCloud(filterButton);
  });


  /* Search box on guides page */
  $('#search-box').on("keyup", searchData);

}());
