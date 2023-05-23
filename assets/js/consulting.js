
   (function($) {
  $(window).scroll(function() {
    // get the scroll position of the document + half the window height


    var scrollTop = $(document).scrollTop() + ($(window).height() / 2);

    
    var positions = [];

    // push each of the items we want to check against to an array with their position and selector
    $('.box').each(function() {
      $(this).removeClass("active");
      positions.push({
        position: $(this).offset().top,
        element: $(this)
      });
    });


    var getClosest = closest(positions, scrollTop);
    getClosest.addClass("active"); // the element closest to the middle of the screen
    var classList = $(".active").attr("class")
    var classArr = classList.split(/\s+/);

    $('.box').each(function() {
      if ($(this).hasClass(classArr[1]) && !$(this).hasClass('active')) {
        $(this).addClass('active');
      }
      check()
    });

  });

  // finds the nearest position (from an array of objects) to the specified number
  function closest(array, number) {
    var num = 0;
    for (var i = array.length - 1; i >= 0; i--) {
      if (Math.abs(number - array[i].position) < Math.abs(number - array[num].position)) {
        num = i;
      }
    }
    return array[num].element;
  }

  function check() {
    if ($('.box-1').hasClass('active')) {
      $('.square-1').addClass('active');
      $('.square-2').removeClass('active');
      $('.square-3').removeClass('active');
      $('.square-4').removeClass('active');
      $('.square-5').removeClass('active');
    } else if ($('.box-2').hasClass('active')) {
      $('.square-1').removeClass('active');
      $('.square-2').addClass('active');
      $('.square-3').removeClass('active');
      $('.square-4').removeClass('active');
      $('.square-5').removeClass('active');
    } else if ($('.box-3').hasClass('active')) {
      $('.square-1').removeClass('active');
      $('.square-2').removeClass('active');
      $('.square-3').addClass('active');
      $('.square-4').removeClass('active');
      $('.square-5').removeClass('active');
    } else if ($('.box-4').hasClass('active')) {
      $('.square-1').removeClass('active');
      $('.square-2').removeClass('active');
      $('.square-3').removeClass('active');
      $('.square-4').addClass('active');
      $('.square-5').removeClass('active');
    }
    else if ($('.box-5').hasClass('active')) {
        $('.square-1').removeClass('active');
        $('.square-2').removeClass('active');
        $('.square-3').removeClass('active');
        $('.square-4').removeClass('active');
        $('.square-5').addClass('active');
      }
  }
})(window.jQuery);

 