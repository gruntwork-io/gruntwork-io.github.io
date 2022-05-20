/**
 * Checkout JS using Stripe
 *
 * @docs: https://stripe.com/docs/payments/elements
 */
$(function () {
  var timeout,
    $checkout = $('[data-cb-type="checkout"]');
  var $body = $("body");

  // The checkout state
  var checkoutOptions = {
    subscription_type: "standard",
    pro_support: false,
    setup_deployment: false,
    setup_compliance: false,
    products: [],
    users: 20,
  };

  // Map from addon key to product ID
  const products = {
    standard_subscription: "price_1Jx2ZMDJ1uFWlBkUavLabx8m",
    pro_support: "price_1Ju8buDJ1uFWlBkU0QALdhIM",
    setup_deployment: "price_1Ju8iYDJ1uFWlBkUxBFauxac",
    setup_compliance: "price_1Ju8akDJ1uFWlBkUGsewsTJU",
  };

  // List of selected product IDs
  var cart = [];

  function _addToCart(addon) {
    const productID = products[addon];
    if (!cart.includes(productID)) {
      cart.push(productID);
      _updateCart();
    }
  }

  function _removeFromCart(addon) {
    const productID = products[addon];
    cart = cart.filter((item) => item !== productID);
    _updateCart();
  }

  function _emptyCart() {
    cart = [];
    _updateCart();
  }

  function _updateCart() {
    $("input[name='cart']").val(JSON.stringify(cart));
    _updateQueryStringFromCart();
  }

  function _updateQueryStringFromCart() {
    const addons = [];
    for (product of cart) {
      const addon = Object.keys(products).find(
        (key) => products[key] === product
      );
      if (addon && addon != "standard_subscription") {
        addons.push(addon);
      }
    }

    const searchParams = new URLSearchParams();
    searchParams.append("subscription-type", "standard");
    searchParams.append("addon", addons.join(","));
    const query = "?" + searchParams.toString();
    const updatedUrl = window.location.pathname + query;

    window.history.replaceState(null, "", updatedUrl);
    $("input[name='editUrl']").val(updatedUrl);
  }

  function _setDefaults() {
    // Set the UI defaults for Standard AWS selection
    $("#subscription-type-img").attr("data-subscription-type", "standard");
    $("#refarch-button-default").show();
    $("#cis-button-default").show();
    _addToCart("standard_subscription");

    // Auto toggles addons based on the URI
    const rawAddons = $.query.get("addon");

    if (!rawAddons || rawAddons === "") {
      return;
    }

    const addons = rawAddons.split(",");
    for (const addon of addons) {
      const addonKey = addon.replace("-", "_");
      $('.addon-button[name="' + addonKey + '"]').click();
      _updateCheckout({ [addonKey]: true });
      _addToCart(addonKey);
    }
  }

  // Listen to Addon button clicks
  $(".addon-button").on("click", function () {
    var tmp = {};
    tmp["subscription_type"] = $.query.get("subscription-type");
    var actionType = $(this).data("addon-action-type");

    // Process the add action and switch the addon button so user can clear their selection
    function _handleAddAction(button) {
      tmp[button.name] = true;
      $(button).text("Remove");
      $(button).addClass("addon-remove-button");
      $(button).data("addon-action-type", "Remove");
      _addToCart(button.name);
    }

    // Process the remove action and switch the addon button so user can make a selection
    function _handleRemoveAction(button) {
      tmp[button.name] = false;
      $(button)
        .text("Add to Subscription ")
        .append(
          "<i class='fa fa-angle-double-right fa-lg' aria-hidden='true'></i>"
        );
      $(button).removeClass("addon-remove-button");
      $(button).data("addon-action-type", "Add");
      _removeFromCart(button.name);
    }

    switch (actionType) {
      case "Add":
        _handleAddAction(this);
        break;
      case "Remove":
        _handleRemoveAction(this);
        break;
      default: // Do nothing
    }
    _updateCheckout(tmp);
  });

  // Ensure we can assign to an object
  if (typeof Object.assign != "function") {
    Object.assign = function (target) {
      "use strict";
      if (target == null) {
        throw new TypeError("Cannot convert undefined or null to object");
      }

      target = Object(target);
      for (var index = 1; index < arguments.length; index++) {
        var source = arguments[index];
        if (source != null) {
          for (var key in source) {
            if (Object.prototype.hasOwnProperty.call(source, key)) {
              target[key] = source[key];
            }
          }
        }
      }
      return target;
    };
  }

  // Updates the UI of the checkout
  function _updateCheckout(newOptions) {
    checkoutOptions = Object.assign({}, checkoutOptions, newOptions);

    _updateUI();
    _updatePrice();
  }

  function _updateUI() {
    var support = checkoutOptions.pro_support;
    var refarch = checkoutOptions.setup_deployment;
    var compliance = checkoutOptions.setup_compliance;

    $(".grunty-sprite").attr("data-sprite", 0);
    $("#subscription_type").val(checkoutOptions.subscription_type);

    // updates addon switch
    $("[data-switch]" + '[name="pro_support"]').prop("checked", support);
    $("[data-switch]" + '[name="setup_deployment"]').prop("checked", refarch);
    $("[data-switch]" + '[name="setup_compliance"]').prop(
      "checked",
      compliance
    );

    if (support) {
      $(".grunty-sprite").attr("data-sprite", 2);
      $("#subscription-addon-1").removeClass("check-list-disabled");
    } else {
      $("#subscription-addon-1").addClass("check-list-disabled");
    }

    if (refarch) {
      $(".grunty-sprite").attr("data-sprite", 1);

      $("#checkout-price-addon").show();
      $("#checkout-price-addon--mobile").show().css("display", "block");
      $(".checkout-price-view").addClass("move-up");

      $("#subscription-addon-2").removeClass("check-list-disabled");
    } else {
      $("#checkout-price-addon").hide();
      $("#checkout-price-addon--mobile").hide();
      $(".checkout-price-view").removeClass("move-up");

      $("#subscription-addon-2").addClass("check-list-disabled");
    }

    if (compliance) {
      $("#subscription-addon-3").removeClass("check-list-disabled");

      // Update Refarch texts to reflect CIS selection
      $("#subscription-addon-3-text").text("CIS Reference Architecture");
      $("#addon-text-refarch").text("CIS Reference Architecture");
    } else {
      $("#subscription-addon-3").addClass("check-list-disabled");

      // Update Refarch texts to reflect CIS selection removal
      $("#subscription-addon-3-text").text("Reference Architecture");
      $("#addon-text-refarch").text("Reference Architecture");
    }

    if (support && refarch) {
      $(".grunty-sprite").attr("data-sprite", 3);
    }
  }

  function _updatePrice() {
    var monthlyTotal, dueNowTotal;

    switch (checkoutOptions.subscription_type) {
      case "standard":
        monthlyTotal = pricing.subscriptions.standard.price.value;
        break;
      default: // do nothing
    }

    if (checkoutOptions.pro_support) {
      switch (checkoutOptions.subscription_type) {
        case "standard":
          monthlyTotal +=
            pricing.subscriptions.standard.pro_support_price.value;
          break;
        default: // do nothing
      }
    }

    if (checkoutOptions.setup_compliance) {
      monthlyTotal += pricing.subscriptions.standard.cis_compliance_price.value;
    }

    dueNowTotal = monthlyTotal;

    if (checkoutOptions.setup_deployment) {
      dueNowTotal += 4950;
      $("#due-monthly-block").show();
    } else {
      // only show the monthly disclaimer when it differs from due now
      $("#due-monthly-block").hide();
    }

    $("#due-now").text(dueNowTotal.toLocaleString());
    $(".monthly-total").text(monthlyTotal.toLocaleString());
  }

  _setDefaults();
  _updateCheckout();
});
