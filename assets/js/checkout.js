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
    subscription_type: 'aws',
    pro_support: false,
    setup_deployment: false,
    setup_compliance: false,
    users: 20
  };

  // Set the UI defaults for AWS selection
  function _setAwsUIDefaults() {
    $('#subscription-type-img').attr('data-subscription-type', 'aws');
    $('#refarch-button-default').show();
    $('#cis-button-default').show();
  }

  // Set the UI defaults for GCP selection
  function _setGcpUIDefaults() {
    $('#subscription-type-img').attr('data-subscription-type', 'gcp');

    // Show Coming Soon text & contact us cta for refarch & cis compliance
    $('#addon-amount-refarch').text('Coming Soon.');
    $('#addon-amount-cis').text('Coming Soon.');
    $('#refarch-button-gcp').show();
    $('#cis-button-gcp').show();
  }

  // Auto toggles the subscription type based on the URI
  switch ($.query.get('subscription-type')) {
    case 'aws':
      _setAwsUIDefaults();
      _updateCheckout({
        subscription_type: 'aws'
      });
      break;
    case 'gcp':
      _setGcpUIDefaults();
      _updateCheckout({
        subscription_type: 'gcp'
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

    // Process the add action and switch the addon button so user can clear thier selection
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
      case 'aws':
        monthlyTotal = pricing.subscriptions.aws.price.value;
        break;
      case 'gcp':
        monthlyTotal = pricing.subscriptions.gcp.price.value;
        break;
      default: // do nothing
    }

    if (checkoutOptions.pro_support) {
      switch (checkoutOptions.subscription_type) {
        case 'aws':
          monthlyTotal += pricing.subscriptions.aws.pro_support_price.value;
          break;
        case 'gcp':
          monthlyTotal += pricing.subscriptions.gcp.pro_support_price.value;
          break;
        default: // do nothing
      }
    }

    // CIS Compliance is only on AWS for now
    if (checkoutOptions.setup_compliance) {
      monthlyTotal += pricing.subscriptions.aws.cis_compliance_price.value;
    }

    dueNowTotal = monthlyTotal;

    // Only AWS supports the Ref Arch
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
    const setup = checkoutOptions.setup_deployment;
    const compliance = checkoutOptions.setup_compliance;

    var href = "https://gruntwork-sandbox.recurly.com/subscribe/" + type + "-monthly?";

    const addOns = { "users": 20 };
    if (support) {
      addOns["pro-support"] = 1;
    }
    if (setup) {
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

    for (const key in params) {
      href += "&" + key + "=" + params[key]
    }

    $("#recurly-checkout-btn").attr("href", href);
  }

  _updateCheckout();
});
