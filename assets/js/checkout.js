/**
 * Checkout JS using Chargebee.
 *
 * @docs: https://www.chargebee.com/checkout-portal-docs/dropIn.html#chargebee-object
 */
$(function () { "use strict";
  /** @var Gruntwork window.Gruntwork */
  var timeout, $checkout = $('[data-cb-type="checkout"]');
  var $body = $('body');

  // Auto toggles addons based on the URI
  switch ($.query.get('addon')) {
    case 'reference-architecture':
      Gruntwork.checkout.addons.reference_architecture.enabled = true;
      break;
    case 'houston-auth':
      Gruntwork.checkout.addons.houston_auth.enabled = true;
      break;
    default: // do nothing
  }

  switch ($.query.get('subscription')) {
    case 'community':
      Gruntwork.checkout.subscription = 'community';
      break;
    case 'professional':
      Gruntwork.checkout.subscription = 'professional';
      break;
    case 'enterprise':
      Gruntwork.checkout.subscription = 'enterprise';
      break;
    default: // do nothing
  }

  // Listen to the switchers
  $(document).on('change', '[data-switch]', function () {
    Gruntwork.checkout.addons[this.name].enabled = this.checked || false;
    _calculatePrice();
    _updateCheckout();
  });

  $('.js-checkout-users').change(function (event) {
    var addonName = event.currentTarget.dataset.addon;
    var addonOption = event.currentTarget.dataset.addonOption;
    Gruntwork.checkout.addons[addonName].options[addonOption] = this.value;
    _updateCheckout();
    _calculatePrice();
  });

  // Subscription tabs functionality
  $(document).on('click', '[data-subscription]', function (event) {
    event.preventDefault();
    _handleTabChange(
      Gruntwork.checkout.subscription,
      event.currentTarget.dataset.subscription
    );
  });

  // Updates the UI of the checkout
  function _updateCheckout(options) {
    var newOptions = options || {};
    Gruntwork.checkout = $.extend({}, Gruntwork.checkout, newOptions);

    var $switch = $('[data-switch]');

    $('.gw-sprite-grunty').attr('data-sprite', Gruntwork.checkout.subscription);
    // $('[data-switch]'+'[name="dedicated_support"]').attr('checked', checkoutOptions.dedicated_support); // updates addon switch
    $switch.closest('[name="reference_architecture"]').attr('checked', Gruntwork.checkout.addons.reference_architecture.enabled);
    $switch.closest('[name="houston_auth"]').attr('checked', Gruntwork.checkout.addons.houston_auth.enabled);

    // Hides checkout controls on Enterprise.
    if (Gruntwork.checkout.subscription === 'enterprise') {
      $('[data-checkout-total="default"]').hide();
      $('[data-checkout-total="enterprise"]').show();
      $checkout.hide();
      $('#deposit-due').hide();
      $('#checkout-contact-btn').show();
    } else {
      $('[data-checkout-total="default"]').show();
      $('[data-checkout-total="enterprise"]').hide();
      $checkout.show();
      $('#deposit-due').show();
      $('#checkout-contact-btn').hide();
    }

    if (Gruntwork.checkout.addons.reference_architecture.enabled) {
      // $('.grunty-sprite').attr('data-sprite', 1);
      $('.grunty-sprite').attr('data-sprite', 3);
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
  }

  /*function _updateAttrs() {
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
  }*/

  function _calculatePrice() {
    // Don't calculate on enterprise.
    if (Gruntwork.checkout.subscription === 'enterprise') return;

    var total = 0;

    var subscriptionData = window.pricing.subscriptions[Gruntwork.checkout.subscription];

    total = subscriptionData.price.value;

    if (Gruntwork.checkout.addons.houston_auth.enabled) {
      var users = Gruntwork.checkout.addons.houston_auth.options.users;
      if (users < 1) {
        $('.js-checkout-addon-houston_auth').addClass('has-error');
      } else {
        $('.js-checkout-addon-houston_auth').removeClass('has-error');
      }
      total = total + (users * window.pricing.addons.houston_auth.price.value);
    }

    $('#subscription-price').text(total.toLocaleString());
    // $('#subscription-subtotal').text(subtotal.toLocaleString());

    //_deferCheckout();
  }

  // Prevents spamming Chargebee registerAgain on every change
  /*function _deferCheckout() {
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
  }*/

  function _handleTabChange(oldTab, newTab) {
    // Remove active state from current subscription.
    $(document)
      .find('[data-subscription="'+ oldTab +'"]')
      .removeClass('is-active');

    // Sets active state to new subscription.
    $(document)
      .find('[data-subscription="'+ newTab +'"]')
      .addClass('is-active');

    // Replace current subscription.
    Gruntwork.checkout.subscription = newTab;

    _updateCheckout();
    _calculatePrice();
  }

  $(document).ready(function () {

    _updateCheckout();
    _calculatePrice();

    _handleTabChange(
      Gruntwork.checkout.subscription,
      Gruntwork.checkout.subscription
    );

  });

});
