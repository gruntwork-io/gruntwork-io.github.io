$(document).ready(function () {
  //Submiting only when subscribe input field not empty. We will update this late to ensure a valid email is entered
  $('#newsletter-subscribe').click((e) => {
    let invalidForm = false;
    if ($('#email').val() === '') {
      invalidForm = true;
      $("#newsletter-success").modal('hide');
      return;
    }
    e.preventDefault();
    $("#newsletter-success").modal('show');
  });

  //To enable fixed scrolling
  $(window).scroll(function () {
    var sidebarTop = $('.navbar-default').innerHeight();
    var contentHeight = $('.post-section-white').innerHeight();
    var sidebarHeight = $('#toc').height();
    var sidebarBottomPos = contentHeight - sidebarHeight;
    var trigger = $(window).scrollTop() - sidebarTop;

    if ($(window).scrollTop() >= sidebarTop) {
      $('#toc').addClass('fixed');
    } else {
      $('#toc').removeClass('fixed');
    }

    if (trigger >= sidebarBottomPos) {
      $('#toc').addClass('bottom');
    } else {
      $('#toc').removeClass('bottom');
    }
  });

});
