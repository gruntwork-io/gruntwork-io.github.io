/**
 * To perform client side searching. 
 */
(function () {
    
    //Load json data
    var loadData = async function() {
        var allData = [];
        window.data = $.getJSON('/search.json');
        window.data.then(function(loaded_data){
            // retrieveTags(loaded_data);
            filterData(loaded_data)
        })
    }


    // var renderCheckboxes = function(tags) {
    //     filteringOptions.innerHTML = tags.map(function (tag) {
    //         var html = '<h2>tester</h2>' +
    //         '<label class="checkbox">' +
    //         '<input value="aws" type="checkbox" onchange="">' + tag + 
    //         '</label>';
    //         return html;
    //     }).join('');
    // }
    
    // // var tags = getTags();
    // var tags = ["aws", "gcp", "terraform"];
    // renderCheckboxes(tags);

    var retrieveTags = function(loaded_data) {
        var tags = [];
        $.each(loaded_data, function(key, data){
            return data.tags;
        });
    }
    

    var filterData = function(loaded_data) {
        var itemsToFilter = document.querySelectorAll("#listings .guide-card");
        var checkBoxes = document.querySelectorAll("#filter-options li input");

        $.each(loaded_data, function(key, data){
            var tags = data.tags;
            var title = data.title;
            for (var i = 0; i < checkBoxes.length; i++) {
                checkBoxes[i].addEventListener('change', e => {
                    var checkbox = e.target;
                    itemsToFilter.forEach(function (item) {
                        if(checkbox.checked){
                                var itemToShow = tags.includes(checkbox.value) && item.innerHTML.includes(title);
                            if(itemToShow){
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
    // var retrieveTags = function(loaded_data) {
    //     var tags = [];
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

    loadData()
    
    
   

   
    $('#search-box').keyup(function(){
        var searchQuery = $(this).val();
        
        if(searchQuery.length === 0)  {
            $('#filtered-records').html('');
            $('#listings').show();
            return;
        } else {
            // Hide the initial data before search began
            $('#listings').hide();

            var regex = new RegExp(searchQuery, "i");
            var output = '<div class="row">';
            var count = 1;
            
            window.data.then(function(loaded_data){
            // Searches through the array created and generates the html content for each result found
                $.each(loaded_data, function(key, val){
                    if ((val.title.search(regex) != -1) || (val.content.search(regex) != -1)  || (val.category.search(regex) != -1)) {
                        
                        output += '<div class="guide-listing">';
                        output += '<div class="guide-card card-shadow">';
                        output += '<div class="card">';
                        output += '<div class="row">';
                        output += '<div class="col-md-2">';
                        output += '<div class="card-img-top img-fluid text-center"><img src="'+ val.image +'" alt="card image" /></div>';
                        output += '</div>';
                        output += '<a href="'+ val.url +'">';
                        output += '<div class="col-md-10">';
                        output += '<div class="card-body">';
                        output += '<h5 class="card-title"><b>' + val.title + ' </b></h5>';
                        output += '<p class="card-text">' + val.excerpt +' </p>';
                        output += '</div>';
                        output += '</div>';
                        output += '</a>';
                        output += '</div>';
                        output += '</div>';
                        output += '</div>';

                        count++;
                    }
                });
            });
            output += '</div>';
            $('#filtered-records').html(output);
        }
    })
})();
