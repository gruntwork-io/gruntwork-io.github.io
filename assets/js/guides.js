$(document).ready(function () {
  
  //Toggle ToC children
  $('#toc .sectlevel1 li').click((e) => {
    // target click comes as <a> inside <li>, hence the parentNode
    $(e.target.parentNode).toggleClass('expanded');
  });

  const onScroll = function () {
    const sidebar = $(".js-scroll-with-user");

    const scrollPosition = $(window).scrollTop();
    const navBarHeight = $('.navbar-default').innerHeight();

    const contentHeight = $('.guides-section-white').innerHeight() + navBarHeight;
    const sidebarHeight = sidebar.height();
    const sidebarBottomPos = scrollPosition + sidebarHeight;

    if (scrollPosition >= navBarHeight) {
      if (sidebarBottomPos >= contentHeight) {
        sidebar.removeClass('fixed');
        sidebar.addClass('bottom');
      } else {
        sidebar.addClass('fixed');
        sidebar.removeClass('bottom');
      }
    } else {
      sidebar.removeClass('fixed');
      sidebar.removeClass('bottom');
    }
  };

  //To enable fixed scrolling
  $(window).scroll(onScroll);
  $(onScroll);
});
