/**
 * Checkout JS using Stripe
 *
 * @docs: https://stripe.com/docs/payments/elements
 */
$(function () {
  // The checkout state
  var checkoutOptions = {
    subscription_type: "standard",
    pro_support: false,
    setup_deployment: false,
    setup_compliance: false,
    products: [],
    users: 20,
  };

  // Map from product ID to button name.
  const productToButtonNameMap = {
    prod_KoYQEu6on7Pmwi: "standard_subscription",
    prod_FpWhWaePaAvZ4q: "pro_support",
    prod_KoYHGWV1pdG2Bv: "setup_deployment",
    prod_KoYXgbgz6RIfvN: "setup_compliance",
  };

  const defaultUsersProduct = {
    productId: "prod_KoYJ9bAynPjS3I",
    quantity: 20,
  };

  const defaultSubscription = {
    productId: "prod_KoYQEu6on7Pmwi",
    quantity: 1,
  };

  var cart = [];

  function _addToCart(productId, quantity = 1) {
    if (!cart.find((item) => item.productId === productId)) {
      cart.push({ productId, quantity });
      _updateCart();
    }
  }

  function _removeFromCart(productId) {
    cart = cart.filter((item) => item.productId !== productId);
    _updateCart();
  }

  function _updateCart() {
    const serializedCart = JSON.stringify(cart);

    const base64EncodedCart = btoa(serializedCart);

    $("input[name='cart']").val(base64EncodedCart);

    const searchParams = new URLSearchParams();
    searchParams.append("cart", base64EncodedCart);
    const query = "?" + searchParams.toString();
    const updatedUrl = window.location.pathname + query;

    window.history.replaceState(null, "", updatedUrl);
    $("input[name='editUrl']").val(window.location.href);
  }

  function _setDefaults() {
    // Set the UI defaults for Standard AWS selection
    $("#subscription-type-img").attr("data-subscription-type", "standard");
    $("#refarch-button-default").show();
    $("#cis-button-default").show();

    // Auto toggles addons based on the URI
    const rawCart = atob($.query.get("cart"));

    if (rawCart) {
      const products = JSON.parse(rawCart);
      for (const product of products) {
        const buttonName = productToButtonNameMap[product.productId];

        if (buttonName) {
          $('.addon-button[name="' + buttonName + '"]').click();
        }
      }
    }

    _addToCart(defaultSubscription.productId);
    _addToCart(defaultUsersProduct.productId, defaultUsersProduct.quantity);
  }

  // Listen to Addon button clicks
  $(".addon-button").on("click", function () {
    var updateCheckoutOptions = {};

    var actionType = $(this).data("addon-action-type");
    var productId = $(this).data("product-id");

    // Process the add action and switch the addon button so user can clear their selection
    function _handleAddAction(button) {
      updateCheckoutOptions[button.name] = true;
      $(button).text("Remove");
      $(button).addClass("addon-remove-button");
      $(button).data("addon-action-type", "Remove");
      _addToCart(productId);
    }

    // Process the remove action and switch the addon button so user can make a selection
    function _handleRemoveAction(button) {
      updateCheckoutOptions[button.name] = false;
      $(button)
        .text("Add to Subscription ")
        .append(
          "<i class='fa fa-angle-double-right fa-lg' aria-hidden='true'></i>"
        );
      $(button).removeClass("addon-remove-button");
      $(button).data("addon-action-type", "Add");
      _removeFromCart(productId);
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
    _updateCheckout(updateCheckoutOptions);
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
