/**
 * To perform client side searching. 
 */
(function () {

  //Load json data
  function loadData(type, option, event) {
    $.getJSON(`/json/${type}.json`, (data) => {
      if (option == "search") {
        searchData(data, event);
      } else {
        filterData(data);
      };
    });
    // retrieveTags(loaded_data);
  };

  let hiddenSearchData = [];
  //Search data
  let searchData = (loaded_data, event) => {
    let searchQuery = event.target.value;

    hiddenSearchData.forEach(data => {
      $(`#${data.id}`).show();
    })

    searchQuery = searchQuery.toLowerCase();

    const results = loaded_data.filter(item => {
      const searchContent = (item.title + item.category + item.content).toLowerCase();
      return !searchContent.includes(searchQuery)
    })

    results.forEach(result => {
      $(`#${result.id}`).hide();
    })
    hiddenSearchData = results;
  }


  //Called on key up within the search box in the deployment guides page
  $('#search-box').keyup(function (event) {
    loadData('guides', 'search', event);
  });

  // let renderCheckboxes = function(tags) {
  //     filteringOptions.innerHTML = tags.map(function (tag) {
  //         let html = '<h2>tester</h2>' +
  //         '<label class="checkbox">' +
  //         '<input value="aws" type="checkbox" onchange="">' + tag + 
  //         '</label>';
  //         return html;
  //     }).join('');
  // }

  // // let tags = getTags();
  // let tags = ["aws", "gcp", "terraform"];
  // renderCheckboxes(tags);

  let retrieveTags = function (loaded_data) {
    let tags = [];
    $.each(loaded_data, function (key, data) {
      return data.tags;
    });
  }


  let filterData = function (loaded_data) {
    let checkBoxes = document.querySelectorAll("#filter-options li input");

    $.each(loaded_data, function (key, data) {
      let tags = data.tags;
      let title = data.title;
      checkBoxes.forEach(checkbox => {
        checkbox.addEventListener('change', e => {
            let checkBox = e.target;
            searchData()
            // itemsToFilter.forEach(function (item) {
            //   if (checkBox.checked) {
            //     let itemToShow = tags.includes(checkBox.value) && item.innerHTML.includes(title);
            //     if (itemToShow) {
            //       item.style.display = "none";
            //     }
            //   } else {
            //     item.style.display = "block";
            //   }
            // })
  
          });
      })
      for (let i = 0; i < checkBoxes.length; i++) {
        checkBoxes[i].addEventListener('change', e => {
          let checkbox = e.target;
          itemsToFilter.forEach(function (item) {
            if (checkbox.checked) {
              let itemToShow = tags.includes(checkbox.value) && item.innerHTML.includes(title);
              if (itemToShow) {
                item.style.display = "none";
              }
            } else {
              item.style.display = "block";
            }
          })

        });
      }
    });
  }


  // Retrieve the tags from the json file and flatten out the array
  // let retrieveTags = function(loaded_data) {
  //     let tags = [];
  //     $.each(loaded_data, function(key, data){

  //         if (data.tags.length > 0){
  //             tags.push(data.tags.toLowerCase().split(","));
  //             tags = tags.reduce(function(a, b){
  //                 return a.concat(b);
  //             }, []);
  //         }
  //     });
  //     return tags;
  // }

  //   loadData()


  //     // Searches through the array created and generates the html content for each result found
  //  let createSearchContent = function(loaded_data) {
  //     let contentSearch = [];
  //     $.each(loaded_data, function (key, data) {
  //         contentSearch.push= (data.title + data.content + data.category).toLowerCase();
  //         return contentSearch;
  //     })
  //     return contentSearch;
  //  }

  //     let domItems = function () {
  //       $(`.guide-card: contains(${item})`).each(function (index, element) {
  //           $(element).addClass("has-content");
  //         }
  //       });
  //     let itemsToFilter = document.querySelectorAll(".card-title b");
  //     let item;
  //     $.each(itemsToFilter, function (i, it) {
  //       item = it.innerHTML.toLowerCase();
  //     })
  //     return item
  //   }


})();
