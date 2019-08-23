/**
 * To perform client side searching. 
 */
(function () {
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
            
            // Searches through the array created and generates the html content for each result found
            $.each(window.guideEntries, function(key, val){
                if ((val.title.search(regex) != -1) || (val.content.search(regex) != -1) || (val.category.search(regex) != -1)) {
                    
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
            output += '</div>';
            $('#filtered-records').html(output);
        }
    })
})();
