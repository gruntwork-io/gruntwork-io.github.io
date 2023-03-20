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
  // Note these are currently all Stripe TEST product Ids and need to be updated to
  // the live strip product IDs

  const productToButtonNameMap = {
    [products.AWS.stripeProductId]: products.AWS.key,
    [products.ProSupport.stripeProductId]: products.ProSupport.key,
    [products.RefArch.stripeProductId]: products.RefArch.key,
    [products.CIS.stripeProductId]: products.CIS.key,
  };

  // Note: This is currently set to the default user product price in Stripe's TEST area.
  const defaultUsersProduct = {
    productId: products.Users.stripeProductId,
    quantity: 20,
  };

  const defaultSubscription = {
    productId: products.AWS.stripeProductId,
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
        const checkboxName = productToButtonNameMap[product.productId];

        if (checkboxName) {
          $('.addon-checkbox[name="' + checkboxName + '"]').checked = true;
        }
      }
    }

    _addToCart(defaultSubscription.productId);
    _addToCart(defaultUsersProduct.productId, defaultUsersProduct.quantity);
  }

  // Listen to Addon button clicks
  $(".addon-checkbox").on("change", function () {
    var updateCheckoutOptions = {};

    var productId = $(this).data("product-id");
    var productKey = this.name;

    if (this.checked) {
      updateCheckoutOptions[productKey] = true;
      _addToCart(productId);
    } else {
      updateCheckoutOptions[productKey] = false;
      _removeFromCart(productId);
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

    _updatePrice();
  }

  function _updatePrice() {
    var monthlyTotal;

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

    if (checkoutOptions.setup_deployment) {
      $('#js-one-time-total').show();
    } else {
      $("#js-one-time-total").hide();
    }

    $("#js-monthly-total").text(monthlyTotal.toLocaleString());
  }

  _setDefaults();
  _updateCheckout();
});
