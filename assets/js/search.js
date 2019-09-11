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

  function showItemsCount(totalCount, numSubmodules) {
    if (searchEntry.type == 'libraryEntries') {
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

  function displayFilterTags() {
    //A list of tags that should be in uppercase
    const upperCaseTags = ['aws', 'gke', 'gcp'];

    if (searchEntry.type == 'guideEntries') {

      //Filters the tags from the array of objects and flattens it out since it returns an array of arrays
      let tags = searchEntry.entries.map(entry => entry.tags.split(',').map(tag => tag.trim())).reduce((a, b) => a.concat(b), []);

      tags.filter((tag, index) => {

        if ((tags.indexOf(tag) === index) && (tag.length != "")) {
          //Converts tags that should be in uppercase
          if(upperCaseTags.includes(tag)){
            tag = tag.toUpperCase();
          }
          $('.tags').append(`<div class="checkbox"><input value=${tag} id=${tag} type="checkbox"><label for="${tag}">${tag}</label></div>`);
        }
      });
    }
  }

  function showAllItems() {
    $('.guide-card').show() && $('.category-head').show() && $('.categories ul').show();
  }

  function showInitialItemsCount() {
    let numSubmodules = 0;
    for (let i = 0; i < searchEntry.length; i++) {
      if (searchEntry.type == 'libraryEntries') return numSubmodules += libraryEntries[i].num_submodules;
      return searchEntry;
    }
    showItemsCount(searchEntry.length, numSubmodules);
  }

  // Show initial module count on load
  let searchEntry = detectSearchEntry();

  $(showInitialItemsCount);
  $(displayFilterTags);

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

  //Function to track Google analytics
  // function trackGA {
  //    // Track what users are searching for via Google Analytics events
  //     //   ga('send', 'event', "iac-lib", "search", "query", text);
  // }

   /**
   * A function to search the IaC Lib and Deployment guides. Can also be used for other pages that need it.
   * To show/hide the proper elements based on the results. 
   * @type {Function}
   */
  function filterData(searchValue, type) {

    $('#no-matches').hide();

    if (searchValue && searchValue.length > 0) {

      let lowerText = searchValue.toLowerCase();

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
          } else if (searchEntry.type == 'guideEntries' && type == 'wordSearch') {
            searchContent = entry.title + entry.category + entry.content + entry.tags;
          } else if (searchEntry.type == 'guideEntries' && type == 'tagSearch') {
            searchContent = entry.tags;
          } else {
            searchContent = entry.cloud;
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

    $('.tags .checkbox input[type="checkbox"]').on('change', function() {
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

  /* Search box on library page */
  $('#js-search-library').on("keyup", searchData);

  /* Triggered on click of any cloud filtering buttons */
  $('.cloud-filter .filter').click(function(event) {
    let id = $(this).attr('id');
    if(id === 'aws') {
      $(this).siblings().removeClass('active-button');
      filterData(id, 'cloudSearch');
    }
    else if(id !== 'aws' && $(this).hasClass('active-button')){
      $('.cloud-filter #aws').addClass('active-button');
      $(this).removeClass('active-button');
      showAllItems();
    } else {
      $('.cloud-filter #aws').removeClass('active-button');
      $(this).addClass('active-button');
      filterData(id, 'cloudSearch');
    }
  });

  /* Search box on guides page */
  $('#search-box').on("keyup", searchData);

}());
