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
    dedicated_support: false,
    setup_deployment: false,
    users: 20
  };

  // Auto toggles the subscription type based on the URI
  switch ($.query.get('subscription-type')) {
    case 'aws': _updateCheckout({ subscription_type: 'aws' }); break;
    case 'gcp': _updateCheckout({ subscription_type: 'gcp' }); break;
    case 'enterprise': _updateCheckout({ subscription_type: 'enterprise' }); break;
    default: // do nothing
  }

  // Auto toggles addons based on the URI
  switch ($.query.get('addon')) {
    case 'subscription-type': _updateCheckout({ subscription_type: true }); break;
    case 'setup-deployment': _updateCheckout({ setup_deployment: true }); break;
    case 'dedicated-support': _updateCheckout({ dedicated_support: true }); break;
    default: // do nothing
  }
  if (typeof Object.assign != 'function') {
    Object.assign = function(target) {
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
  // Listen to the radios
  $('[name="subscription_type"]').on('change', function () {
    var tmp = {};
    tmp[this.name] = $(this).val();
    _updateCheckout(tmp);
  });
  $('[data-switch]').on('change', function () {
    var tmp = {};
    tmp[this.name] = this.checked;
    _updateCheckout(tmp);
  });

  // Updates the UI of the checkout
  function _updateCheckout(newOptions) {
    checkoutOptions = Object.assign({}, checkoutOptions, newOptions);

    $('.grunty-sprite').attr('data-sprite', 0);
    $('#subscription_type').val(checkoutOptions.subscription_type);
    $('[data-switch]'+'[name="dedicated_support"]').attr('checked', checkoutOptions.dedicated_support); // updates addon switch
    $('[data-switch]'+'[name="setup_deployment"]').attr('checked', checkoutOptions.setup_deployment); // updates addon switch

    // update the subscription type radios
    $('.subscription-type-option').removeClass('subscription-type-checked');
    switch (checkoutOptions.subscription_type) {
      case 'aws': $('#subscription-type-aws').addClass('subscription-type-checked'); break;
      case 'gcp': $('#subscription-type-gcp').addClass('subscription-type-checked'); break;
      case 'enterprise': $('#subscription-type-enterprise').addClass('subscription-type-checked'); break;
      default: // do nothing
    }

    // updates subscription summary box
    if (checkoutOptions.subscription_type == 'enterprise') {
      $checkout.hide();
      $('#deposit-due').hide();
      $('#checkout-contact-btn').show();

      $('#subscription-20-users').hide();
      $('#subscription-unlimited-users').show();

      $('[data-checkout-total="default"]').hide();
      $('[data-checkout-total="enterprise"]').show();
    } else {
      // aws or gcp
      $('#subscription-unlimited-users').hide();
      $('#subscription-20-users').show();

      $('[data-checkout-total="default"]').show();
      $('[data-checkout-total="enterprise"]').hide();

      // show the checkout
      $checkout.show();
      $('#deposit-due').show();
      $('#checkout-contact-btn').hide();
    }

    if (checkoutOptions.dedicated_support) {
      $('.grunty-sprite').attr('data-sprite', 2);
      $('#subscription-addon-1').removeClass('check-list-disabled');
    } else {
      $('#subscription-addon-1').addClass('check-list-disabled');
    }

    if (checkoutOptions.setup_deployment) {
      $('.grunty-sprite').attr('data-sprite', 1);
      $('.checkout-price-view').addClass('move-up');
      $('#checkout-price-addon').show();
      $('#checkout-price-addon--mobile').show().css('display', 'block');
      $('#subscription-addon-2').removeClass('check-list-disabled');
    } else {
      $('.checkout-price-view').removeClass('move-up');
      $('#checkout-price-addon').hide();
      $('#checkout-price-addon--mobile').hide();
      $('#subscription-addon-2').addClass('check-list-disabled');
    }

    if (checkoutOptions.dedicated_support && checkoutOptions.setup_deployment) {
      $('.grunty-sprite').attr('data-sprite', 3);
    }

    _calculatePrice();
  }

  function _updateAttrs() {
    // dont allow variable users
    $checkout.removeAttr('data-cb-addons_id_2');
    $checkout.removeAttr('data-cb-addons_quantity_2');

    if (checkoutOptions.dedicated_support) {
      $checkout.attr({
        'data-cb-addons_id_0': 'chargebee-support'
      });
    } else {
      $checkout.removeAttr('data-cb-addons_id_0');
      $checkout.removeAttr('data-cb-addons_id_1');
      $checkout.removeAttr('data-cb-addons_quantity_1');
    }

    if (checkoutOptions.setup_deployment) {
      $checkout.attr({
        'data-cb-addons_id_3': 'chargebee-refarch'
      });
    } else {
      $checkout.removeAttr('data-cb-addons_id_3');
    }
  }

  function _calculatePrice() {
    if (checkoutOptions.subscription_type == 'enterprise') return; // Don't calculate on enterprise

    var total, subtotal, subscriptionTotal;

    switch (checkoutOptions.subscription_type) {
      case 'aws': total = subtotal = pricing.subscriptions.aws.price.value; break;
      case 'gcp': total = subtotal = pricing.subscriptions.gcp.price.value; break;
      default: // do nothing
    }

    if (checkoutOptions.dedicated_support) {
      switch (checkoutOptions.subscription_type) {
        case 'aws': total += subtotal = pricing.subscriptions.aws.pro_support_price.value; break;
        case 'gcp': total += subtotal = pricing.subscriptions.gcp.pro_support_price.value; break;
        default: // do nothing
      }
    }

    // Only AWS supports the Ref Arch
    if (checkoutOptions.setup_deployment) {
      subscriptionTotal = subtotal;
      //subtotal += 4950;
    }

    $('#subscription-price').text(total.toLocaleString());
    $('#subscription-subtotal').text(subtotal.toLocaleString());

    _deferCheckout(checkoutOptions.users, checkoutOptions.dedicated_support, checkoutOptions.setup_deployment);
  }

  // Prevents spamming Chargebee registerAgain on every change
  function _deferCheckout(users, support, setup) {
    var cbInstance;
    if (typeof timeout !== 'undefined') clearTimeout(timeout);
    $checkout.attr('disabled', true).text('Please wait...');

    timeout = setTimeout(function () {
      $checkout.attr('disabled', false).text('Checkout');
      clearTimeout(timeout);
      //_updateAttrs();
      Chargebee.registerAgain();
      cbInstance = Chargebee.getInstance();
      function htmlEncode(value){
        if (value) {
          return jQuery('<div />').text(value).html();
        } else {
          return '';
        }
      }
      cbInstance.setCheckoutCallbacks(function(cart, product) {
        var subscriptionDetails = ("Gruntwork Subscribers: " + users);
        if (support){
          subscriptionDetails += " • Dedicated Support";
        }
        if (setup){
          subscriptionDetails += " • Reference Architecture";
        }
        //console.log(subscriptionDetails);
        // you can define a custom callbacks based on cart object
        var customer = {cf_subscription_details: subscriptionDetails};

        cart.setCustomer(customer);

        return {
          close: function() {
            // Required to remove overflow set by the modal
            // Same as: https://lodash.com/docs/4.17.10#debounce
            setTimeout(function() { $body.removeAttr('style'); }, 0);
          }
        }
      });
    }, 1250);
  }

  _updateCheckout();
});
