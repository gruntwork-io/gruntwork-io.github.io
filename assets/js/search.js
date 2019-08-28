/**
 * To perform client side searching. 
 */
(function () {

  //Load json data
  let loadData = ((type, value) => {
    $.getJSON(`/json/${type}.json`, (data) => {
      searchData(data, value);
    });
  });

  let hiddenSearchData = [];

  // This function displays or hides item on the page
  let displayData = (type => {
    const removeCategoriesClass = $('.categories ul');
    const removeCategoryHeader = $('.category-head');

    if (hiddenSearchData.length > 0) {
      removeCategoriesClass.hide() && removeCategoryHeader.hide();

      hiddenSearchData.forEach(data => {
        if (type == 'show') {
          $(`#${data.id}`).show();
        } else if (type == 'showAll') {
          removeCategoriesClass.show() && removeCategoryHeader.show();
          $(`#${data.id}`).show();
        } else {
          $(`#${data.id}`).hide();
        }
      })
      return hiddenSearchData;
    }
  });

  //Display all itmes initially on the page when user click on the body of the page
  $('body').click(() => {
    displayData('showAll');
  })

  //Search data
  let searchData = ((loaded_data, value) => {
    let searchQuery;
    if (typeof (value) !== "string") {
      value.map(filterValues => {
        searchQuery = filterValues;
        return searchQuery;
      });
    } else {
      searchQuery = value;
    }

    displayData('show');
    if (!searchQuery) return displayData('showAll');

    //Return items that do not match the search query
    const unMatchedItems = loaded_data.filter(item => {
      const searchContent = item.title + item.category + item.content + item.tags;
      if (selectedFilters.length > 1) {
        return selectedFilters.forEach(query => !searchContent.includes(query.toLowerCase()));
      }
      return !searchContent.includes(searchQuery.toLowerCase());
    });

    hiddenSearchData = unMatchedItems;

    displayData('hide');
    return hiddenSearchData;
  })


  //Triggered on key up within the search box in the deployment guides page
  $('#search-box').keyup(function (event) {
    loadData('guides', event.target.value);
  });


  //Triggered when the cloud filter buttons are clicked
  $('.cloud-filter .btn').click(function () {
    let $value = $(this).attr('value');
    loadData('guides', $value);
  });


  let $filterCheckboxes = $('#filter-options input[type="checkbox"]');
  let selectedFilters = [];


  //Triggered when filter checkboxes are checked
  $filterCheckboxes.on('change', (event) => {
    if (event.target.checked) {
      selectedFilters.push(event.target.value);
      loadData('guides', selectedFilters)
    } else {
      selectedFilters = selectedFilters.filter(item => item !== event.target.value)
      loadData('guides', selectedFilters)
    }
  });

})();
