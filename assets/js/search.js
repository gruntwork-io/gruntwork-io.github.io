/**
 * Javascript specially for the search bad and filters used in the
 * IaC Library page and the deployment guides page.
 * Please note that since we will be moving to a Saas app, we will need to 
 * make this code reuasble
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
    $('#no-azure-results').hide();
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
    return window.libraryEntries ?
      window.libraryEntries :
      window.guideEntries;
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

  function getSearchData(entry, type) {
    let searchContent;

    if (type === 'wordSearch') {
      searchContent = entry.text || entry.title + entry.category + entry.content + entry.tags;
    } else if (type === 'tagSearch') {
      searchContent = entry.tags + entry.cloud;
    } else if (type === 'cloudSearch') {
      searchContent = entry.cloud;
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

      $('.table-clickable-row').length === 0 ? hideItems() : $('.table-clickable-row').hide();

      searchEntry.forEach(entry => {
        let matchesAll = true;

        searchQueries.forEach(searchQuery => {
          const searchContent = getSearchData(entry, type);

          if (searchContent.indexOf(searchQuery) < 0) {
            matchesAll = false;
            $(`#${entry.id}`).hide();
          }
        });

        //Checks if results were found and displays results accordingly
        if (matchesAll) {
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

  function filterCloudAndTags() {
    const checkedTags = $('input[type="checkbox"]:checked');
    const selectedCloud = $('.cloud-filter .active-button').attr("id");

    if (checkedTags.length === 0) {
      // Return filtered to whatever cloud is selected if no tag is checked Or all
      // items if no cloud is selected
      return selectedCloud ?
        filterSearchData(selectedCloud, 'cloudSearch') :
        showAllItems();
    }
    checkedTags
      .each(function () {
        const searchValue = $(this).val();
        filterSearchData(searchValue + (selectedCloud ?
          ' ' + selectedCloud :
          ''), 'tagSearch');
      });
  }

  /* Triggered when filter checkboxes are checked */
  $(document)
    .on('click', '.tags', function () {
      filterCloudAndTags();
    });

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
      filterButton
        .siblings()
        .removeClass('active-button');

      if (id === 'azure') {
        $('#guide-listings').hide();
        $('#no-azure-results').show();
        return;
      }
    }

    filterCloudAndTags();
  }

  /* Search box on library page */
  $('#js-search-library').on("keyup", searchData);

  /* Triggered on click of any cloud filtering buttons */
  $('.cloud-filter .filter').on('click', function () {
    const filterButton = $(this);
    selectCloud(filterButton);
  });

  /* Search box on guides page */
  $('#search-box').on("keyup", searchData);

}());
