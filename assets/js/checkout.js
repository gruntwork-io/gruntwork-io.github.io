/**
 * Checkout JS using Chargebee.
 *
 * @docs: https://www.chargebee.com/checkout-portal-docs/dropIn.html#chargebee-object
 */
$(function () { "use strict";
  var timeout, $checkout = $('[data-cb-type="checkout"]');
  var $body = $('body');

  // The checkout state
  var checkoutOptions = {
    dedicated_support: false,
    setup_deployment: false,
    users: 10,
    enterprise: false,
    subscription: 'community',
    addons: [],
    houston_auth: false
  };

  // Auto toggles addons based on the URI
  switch ($.query.get('addon')) {
    case 'setup-deployment': _updateCheckout({ setup_deployment: true }); break;
    case 'dedicated-support': _updateCheckout({ dedicated_support: true }); break;
    case 'houston-auth': _updateCheckout({ houston_auth: true }); break;
    default: // do nothing
  }

  switch ($.query.get('subscription')) {
    case 'community': _updateCheckout({ subscription: 'community' }); break;
    case 'professional': _updateCheckout({ subscription: 'professional' }); break;
    case 'enterprise': _updateCheckout({ subscription: 'enterprise' }); break;
    default: // do nothing
  }

  // Listen to the switchers
  $('#slider-users').on('input change mousemove', function (event) {
    _updateCheckout({ users: parseInt(event.target.value) });
  });
  $('[data-switch]').on('change', function () {
    var tmp = {};
    tmp[this.name] = this.checked;
    _updateCheckout(tmp);
  });

  // Subscription tabs functionality
  $(document).on('click', '[data-subscription]', function (event) {
    event.preventDefault();
    _handleTabChange(
      checkoutOptions.subscription,
      event.currentTarget.dataset.subscription
    );
  });

  // Updates the UI of the checkout
  function _updateCheckout(newOptions) {
    checkoutOptions = $.extend({}, checkoutOptions, newOptions);
    //checkoutOptions.enterprise = (checkoutOptions.users > 50);
    checkoutOptions.enterprise = (checkoutOptions.subscription === 'enterprise');

    $('.grunty-sprite').attr('data-sprite', 0);
    // $('[data-switch]'+'[name="dedicated_support"]').attr('checked', checkoutOptions.dedicated_support); // updates addon switch
    $('[data-switch]'+'[name="setup_deployment"]').attr('checked', checkoutOptions.setup_deployment); // updates addon switch

    // updates user count
    if (checkoutOptions.subscription === 'enterprise') {
      $('#slider-users-count').text('50+');
      $checkout.hide();
      $('#deposit-due').hide();
      $('#checkout-contact-btn').show();
    } else {
      if (checkoutOptions.users <= 10 && checkoutOptions.dedicated_support) {
        $('#slider-users-count').text('1-10');
      } else if (checkoutOptions.users <= 10 && ! checkoutOptions.dedicated_support) {
        $('#slider-users-count').text('1-10');
      } else {
        $('#slider-users-count').text(checkoutOptions.users);
      }

      $checkout.show();
      $('#deposit-due').show();
      $('#checkout-contact-btn').hide();
    }

    if (checkoutOptions.dedicated_support) {
      $('.grunty-sprite').attr('data-sprite', 2);
      // $('#subscription-addon-1').removeClass('check-list-disabled');
    } else {
      // $('#subscription-addon-1').addClass('check-list-disabled');
    }

    if (checkoutOptions.setup_deployment) {
      $('.grunty-sprite').attr('data-sprite', 1);
      $('.checkout-price-view').addClass('move-up');
      $('#checkout-price-addon').show();
      $('#checkout-price-addon--mobile').show().css('display', 'block');
      // $('#subscription-addon-2').removeClass('check-list-disabled');
    } else {
      $('.checkout-price-view').removeClass('move-up');
      $('#checkout-price-addon').hide();
      $('#checkout-price-addon--mobile').hide();
      // $('#subscription-addon-2').addClass('check-list-disabled');
    }

    if (checkoutOptions.dedicated_support && checkoutOptions.setup_deployment) {
      $('.grunty-sprite').attr('data-sprite', 3);
    }

    if (checkoutOptions.subscription === 'enterprise') {
      $('[data-checkout-total="default"]').hide();
      $('[data-checkout-total="enterprise"]').show();
    } else {
      $('[data-checkout-total="default"]').show();
      $('[data-checkout-total="enterprise"]').hide();
    }

    _calculatePrice();
  }

  function _updateAttrs() {
    if (checkoutOptions.users > 10) {
      $checkout.attr({
        'data-cb-addons_id_2': 'chargebee-addon-user',
        'data-cb-addons_quantity_2': checkoutOptions.users - 10
      });
    } else {
      $checkout.removeAttr('data-cb-addons_id_2');
      $checkout.removeAttr('data-cb-addons_quantity_2');
    }

    if (checkoutOptions.dedicated_support) {
      if (checkoutOptions.users > 10) {
        $checkout.attr({
          'data-cb-addons_id_0': 'chargebee-support',
          'data-cb-addons_id_1': 'chargebee-addon-support',
          'data-cb-addons_quantity_1': checkoutOptions.users - 10
        });
      } else {
        $checkout.attr({
          'data-cb-addons_id_0': 'chargebee-support'
        });
      }
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
    if (checkoutOptions.enterprise || checkoutOptions.subscription === 'enterprise') return; // Don't calculate on enterprise

    var total = 0;

    var subscriptionData = window.pricing.subscriptions[checkoutOptions.subscription];

    total = subscriptionData.price.value;

    $('#subscription-price').text(total.toLocaleString());
    // $('#subscription-subtotal').text(subtotal.toLocaleString());

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

  function _handleTabChange(oldTab, newTab) {
    // Remove active state from current subscription.
    var oldSubscription = '[data-subscription="'+ oldTab +'"]';
    $(document).find(oldSubscription).removeClass('is-active');

    // Sets active state to new subscription.
    var currentSubscription = '[data-subscription="'+ newTab +'"]';
    $(document).find(currentSubscription).addClass('is-active');

    // Replace current subscription.
    checkoutOptions.subscription = newTab;

    _updateCheckout({});
  }

  $(document).ready(function () {

    _handleTabChange(checkoutOptions.subscription, checkoutOptions.subscription);

  });

});
