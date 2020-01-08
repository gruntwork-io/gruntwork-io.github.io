$(document).ready(function () {

  const getElementForDataSelector = function (parentElement, selectorName, elementName) {
    const selector = parentElement.data(selectorName);
    if (!selector) {
      throw new Error(`You must specify a 'data-${selectorName}' attribute for '${elementName}'.`);
    }

    const element = $(selector);
    if (element.length !== 1) {
      throw new Error(`Expected one element that matched selector '${selector}' for '${elementName}' but got ${element.length}`);
    }

    return element;
  };

  //Move Outline to top of the position of first guide card
  const startOutlinePosition = function () {
    const firstGuideCardTop = $('.guide-card').first().offset().top;

    $(".js-scroll-with-user").offset({top: firstGuideCardTop});
  }

  // Move the TOC on the left side of the page with the user as the user scrolls down, so the TOC is always visible.
  // Only start moving the TOC once the user has scrolled past the element specified in scroll-after-selector. Stop
  // moving it at the bottom of the content.
  const moveToCWithScrolling = function () {
    const sidebar = $(".js-scroll-with-user");

    const scrollAfter = getElementForDataSelector(sidebar, 'scroll-after-selector', 'moveTocWithScrolling');
    const scrollUntil = getElementForDataSelector(sidebar, 'scroll-until-selector', 'moveTocWithScrolling');

    const scrollPosition = $(window).scrollTop();
    const scrollAfterHeightBottom = scrollAfter.offset().top + scrollAfter.innerHeight();

    const contentHeight = scrollUntil.innerHeight() + scrollAfterHeightBottom;
    const sidebarHeight = sidebar.height();
    const sidebarBottomPos = scrollPosition + sidebarHeight;

    // Only start moving the TOC once we're past the scroll-after item
    if (scrollPosition >= scrollAfterHeightBottom) {
      // Stop moving the TOC when we're at the bottom of the content
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

  // Update window hash without causing a "jump." https://stackoverflow.com/a/14690177/483528
  const updateHash = function (hash) {
    if (history.replaceState) {
      history.replaceState(null, null, hash);
    } else {
      window.location.hash = hash;
    }
  };

  // Show a dot next to the part of the TOC where the user has scrolled to. We can't use bootstrap's built-in ScrollSpy
  // because with Bootstrap 3.3.7, it only works with a Bootstrap Nav, whereas our TOC is auto-generated and does not
  // use Bootstrap Nav classes/markup.
  const scrollSpy = function () {
    const content = $(".js-scroll-spy");

    const nav = getElementForDataSelector(content, 'scroll-spy-nav-selector', 'scrollSpy');

    const allNavLinks = nav.find('a:visible');
    allNavLinks.removeClass('selected');

    // Only consider an item in view if it's visible in the top 20% of the screen
    const buffer = $(window).height() / 7;
    const scrollPosition = $(window).scrollTop();
    const contentHeadings = content.find('h2:visible, h3:visible');
    const visibleHeadings = contentHeadings.filter((index, el) => scrollPosition + buffer >= $(el).offset().top);

    if (visibleHeadings.length > 0) {
      const selectedHeading = visibleHeadings.last();
      const selectedHeadingId = selectedHeading.attr('id');

      if (!selectedHeadingId) {
        throw new Error(`Did not find 'id' attribute on selected heading: ${selectedHeading}`);
      }

      const hash = `#${selectedHeadingId}`;
      const selectedNavLink = nav.find(`a[href$='${hash}']`);

      // Since the parent nav href has already been removed so it doesnt scroll to that part of the page on click in the toc,
      // This finds the id in the toc that matches the visible header and adds styling to it
      if (hash !== location.hash) {
        $(`#toc li [id='${hash}']`).addClass('selected').closest("li").addClass('expanded');
      }

      selectedNavLink.closest('li.expanded').children('a').addClass('selected');

      if (selectedNavLink.length === 1) {
        updateHash(hash);
        selectedNavLink.addClass('selected');

        const allTopLevelNavListItems = nav.find('.sectlevel1 > li');

        const parentNavListItem = selectedNavLink.parents('.sectlevel2').parent();
        const topLevelNavListItem = selectedNavLink.parents('.sectlevel1');

        if (parentNavListItem.length === 1) {
          // If this is a nested nav item, expand its parent nav
          allTopLevelNavListItems.removeClass('expanded');
          parentNavListItem.addClass('expanded');
        } else if (topLevelNavListItem.length === 1) {
          // Otherwise, this is a top-level nav item, so expand it directly
          allTopLevelNavListItems.removeClass('expanded');
          selectedNavLink.parent().addClass('expanded');
        }
      }
    }
  };

  $(window).scroll(moveToCWithScrolling);
  $(moveToCWithScrolling);

  $(window).scroll(scrollSpy);
  $(scrollSpy);

  $(startOutlinePosition);

  $('.post-detail img').on('click', function () {
    window.open(this.src, '_blank')
  })

  //Add ga tracking on clicking of the subscribe cta within the guides
  $('.js-subscribe-cta').on('click', function () {
    $("#subscribe-success").modal('show');
    ga('send', 'event', location.pathname, 'subscribe-cta');
  })

  //Remove link from parent navigation item and add classes when clicked. 
  // This is automatically generated by Jekyll toc and can only be removed via Js
  $("#toc ul > li").each(function () {
    const listItem = $(this).has("ul");
    if (listItem.length > 0) {
      const parentNavItem = listItem;
      const hrefAttr = parentNavItem.find("a:first").attr("href");

      parentNavItem.find("a:first").removeAttr("href").attr("id", hrefAttr)
      parentNavItem.on('click', function (e) {
        e.preventDefault();

        $(this).siblings().removeClass('expanded selected')
        $(this).toggleClass('expanded selected');
      })
    }
  });

});
