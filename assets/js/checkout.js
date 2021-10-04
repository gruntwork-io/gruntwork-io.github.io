/**
 * Checkout JS using Chargebee.
 *
 * @docs: https://www.chargebee.com/checkout-portal-docs/dropIn.html#chargebee-object
 */
$(function () {
  var timeout, $checkout = $('[data-cb-type="checkout"]');
  var $body = $('body');

  // The checkout state
  var checkoutOptions = {
    subscription_type: 'standard',
    pro_support: false,
    setup_deployment: false,
    setup_compliance: false,
    users: 20
  };

  // Set the UI defaults for Standard selection
  function _setStandardUIDefaults() {
    $('#subscription-type-img').attr('data-subscription-type', 'standard');
    $('#refarch-button-default').show();
    $('#cis-button-default').show();
  }

  // Auto toggles the subscription type based on the URI
  switch ($.query.get('subscription-type')) {
    case 'standard':
      _setStandardUIDefaults();
      _updateCheckout({
        subscription_type: 'standard'
      });
      break;
    default: // do nothing
  }

  // Auto toggles addons based on the URI
  switch ($.query.get('addon')) {
    case 'subscription-type':
      _updateCheckout({
        subscription_type: true
      });
      break;
    case 'setup-deployment':
      _updateCheckout({
        setup_deployment: true
      });
      break;
    case 'setup-compliance':
      _updateCheckout({
        setup_compliance: true
      });
      break;
    case 'pro-support':
      _updateCheckout({
        pro_support: true
      });
      break;
    default: // do nothing
  }
  if (typeof Object.assign != 'function') {
    Object.assign = function (target) {
      'use strict';
      if (target == null) {
        throw new TypeError('Cannot convert undefined or null to object');
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

  // Listen to Addon button clicks
  $('.addon-button').on('click', function () {
    var tmp = {};
    tmp["subscription_type"] = $.query.get('subscription-type');
    var actionType = $(this).data("addon-action-type");

    // Process the add action and switch the addon button so user can clear their selection
    function _handleAddAction(button) {
      tmp[button.name] = true;
      $(button).text("Remove");
      $(button).addClass('addon-remove-button');
      $(button).data('addon-action-type', "Remove");
    }

    // Process the remove action and switch the addon button so user can make a selection
    function _handleRemoveAction(button) {
      tmp[button.name] = false;
      $(button).text("Add to Subscription ").append("<i class='fa fa-angle-double-right fa-lg' aria-hidden='true'></i>");
      $(button).removeClass('addon-remove-button');
      $(button).data('addon-action-type', "Add");
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

  // Updates the UI of the checkout
  function _updateCheckout(newOptions) {
    checkoutOptions = Object.assign({}, checkoutOptions, newOptions);

    _updateUI();
    _updatePrice();
    _updateCheckoutLink();
  }

  function _updateUI() {
    var support = checkoutOptions.pro_support;
    var refarch = checkoutOptions.setup_deployment;
    var compliance = checkoutOptions.setup_compliance;

    $('.grunty-sprite').attr('data-sprite', 0);
    $('#subscription_type').val(checkoutOptions.subscription_type);

    // updates addon switch
    $('[data-switch]' + '[name="pro_support"]').prop('checked', support);
    $('[data-switch]' + '[name="setup_deployment"]').prop('checked', refarch);
    $('[data-switch]' + '[name="setup_compliance"]').prop('checked', compliance);

    if (support) {
      $('.grunty-sprite').attr('data-sprite', 2);
      $('#subscription-addon-1').removeClass('check-list-disabled');
    } else {
      $('#subscription-addon-1').addClass('check-list-disabled');
    }

    if (refarch) {
      $('.grunty-sprite').attr('data-sprite', 1);

      $('#checkout-price-addon').show();
      $('#checkout-price-addon--mobile').show().css('display', 'block');
      $('.checkout-price-view').addClass('move-up');

      $('#subscription-addon-2').removeClass('check-list-disabled');
    } else {
      $('#checkout-price-addon').hide();
      $('#checkout-price-addon--mobile').hide();
      $('.checkout-price-view').removeClass('move-up');

      $('#subscription-addon-2').addClass('check-list-disabled');
    }

    if (compliance) {
      $('#subscription-addon-3').removeClass('check-list-disabled');

      // Update Refarch texts to reflect CIS selection
      $('#subscription-addon-3-text').text('CIS Reference Architecture');
      $('#addon-text-refarch').text('CIS Reference Architecture');
    } else {
      $('#subscription-addon-3').addClass('check-list-disabled');

      // Update Refarch texts to reflect CIS selection removal
      $('#subscription-addon-3-text').text('Reference Architecture');
      $('#addon-text-refarch').text('Reference Architecture');
    }

    if (support && refarch) {
      $('.grunty-sprite').attr('data-sprite', 3);
    }
  }

  function _updatePrice() {
    var monthlyTotal, dueNowTotal;

    switch (checkoutOptions.subscription_type) {
      case 'standard':
        monthlyTotal = pricing.subscriptions.standard.price.value;
        break;
      default: // do nothing
    }

    if (checkoutOptions.pro_support) {
      switch (checkoutOptions.subscription_type) {
        case 'standard':
          monthlyTotal += pricing.subscriptions.standard.pro_support_price.value;
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
      $('#due-monthly-block').show();
    } else {
      // only show the monthly disclaimer when it differs from due now
      $('#due-monthly-block').hide();
    }

    $('#due-now').text(dueNowTotal.toLocaleString());
    $('.monthly-total').text(monthlyTotal.toLocaleString());
  }

  // Update the Recurly checkout link URL
  function _updateCheckoutLink() {
    const type = checkoutOptions.subscription_type;
    const support = checkoutOptions.pro_support;
    const refarch = checkoutOptions.setup_deployment;
    const compliance = checkoutOptions.setup_compliance;

    var href = "https://gruntwork-sandbox.recurly.com/subscribe/" + type + "-monthly?";

    // We'll want to pass users when we switch from using the Recurly hosted payment
    // page to our own, at which point we can re-enable the users add-on.

    const addOns = { /*"users": 20*/ };
    if (support) {
      addOns["pro-support"] = 1;
    }
    if (refarch) {
      addOns["ref-arch"] = 1;
    }
    if (compliance) {
      addOns["cis-aws-foundations"] = 1;
    }

    const params = {
      theme: "modern",
      add_on_code: Object.keys(addOns).toString(),
      add_on_quantity: Object.values(addOns).toString(),
    };

    sep = "";
    for (const key in params) {
      href += sep + key + "=" + params[key];
      sep = "&";
    }

    $("#recurly-checkout-btn").attr("href", href);
  }

  _updateCheckout();
});
