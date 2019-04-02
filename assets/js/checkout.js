/**
 * Checkout JS using Chargebee.
 *
 * @docs: https://www.chargebee.com/checkout-portal-docs/dropIn.html#chargebee-object
 */
$(function () { "use strict";
  /** @var Gruntwork window.Gruntwork */
  var timeout, total, $checkout = $('[data-cb-type="checkout"]');
  var $body = $('body');

  // Make checkout sidebar sticky for desktop only.
  $(document).ready(function() {
    if (window.matchMedia("(min-width: 991px)").matches) {
      $('.js-checkout-sidebar').sticky({
        bottomSpacing: $('body').height() - $('.js-checkout-end').offset().top,
      });
    } else {
      $('.js-checkout-sidebar').unstick();
    }
  });

  // Auto toggles subscription based on the URL parameters.
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

  // Auto toggles addons based on the URL parameters.
  switch ($.query.get('addon')) {
    case 'reference-architecture':
      Gruntwork.checkout.addons.reference_architecture.enabled = true;
      break;
    case 'houston-auth':
      Gruntwork.checkout.addons.houston_auth.enabled = true;
      break;
    default: // do nothing
  }

  // Listen to the switchers.
  $(document).on('change', '[data-switch]', function () {
    Gruntwork.checkout.addons[this.name].enabled = this.checked || false;
    _calculatePrice();
    _updateCheckout();
  });

  // Listens to all input events on total users.
  $('.js-checkout-users').change(function (event) {
    var addonName = event.currentTarget.dataset.addon;
    var addonOption = event.currentTarget.dataset.addonOption;
    Gruntwork.checkout.addons[addonName].options[addonOption] = this.value;
    _updateCheckout();
    _calculatePrice();
  });

  // Subscription tabs functionality.
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

    // Show the active tab panel.
    $('[data-subscription="'+ Gruntwork.checkout.subscription +'"]').tab('show');

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
      $('.checkout-price-view').addClass('move-up');
      $('#checkout-price-addon').show();
      $('#checkout-price-addon--mobile').show().css('display', 'block');
    } else {
      $('.checkout-price-view').removeClass('move-up');
      $('#checkout-price-addon').hide();
      $('#checkout-price-addon--mobile').hide();
    }

    if (Gruntwork.checkout.addons.houston_auth.enabled) {
      $('[data-addon="houston_auth"]').attr('disabled', false);
    } else {
      $('[data-addon="houston_auth"]').attr('disabled', true);
    }
  }

  function _calculatePrice() {
    // Don't calculate on enterprise.
    if (Gruntwork.checkout.subscription === 'enterprise') return;

    // Resets the total.
    total = 0;

    var subscriptionData = window.pricing.subscriptions[Gruntwork.checkout.subscription];

    total = subscriptionData.price.value;

    // Validation
    if (Gruntwork.checkout.addons.houston_auth.enabled) {
      var users = Gruntwork.checkout.addons.houston_auth.options.users;
      if (users < 1) {
        $('.js-checkout-addon-houston_auth').addClass('has-error');
      } else {
        $('.js-checkout-addon-houston_auth').removeClass('has-error');
      }

      total = total + ((users - 1) * window.pricing.addons.houston_auth.price.value);
    }

    $('#subscription-price').html((total.toLocaleString()).replace(/,/g, "<span class='small'>,</span>"));
    // $('#subscription-subtotal').text(subtotal.toLocaleString());

    _prepareCheckout();
  }

  // Pass subscription details to Chargebee.
  function _prepareCheckout() {
    var cbInstance;

    Chargebee.registerAgain();
    cbInstance = Chargebee.getInstance();
    cbInstance.setCheckoutCallbacks(function(cart, product) {
      var subscriptionDetails = '';

      // Subscription plan
      subscriptionDetails += (' • Subscription: ' + window.pricing.subscriptions[Gruntwork.checkout.subscription].name);

      // Addons
      if (Gruntwork.checkout.addons.reference_architecture.enabled){
        subscriptionDetails += ' • Reference Architecture';
      }
      if (Gruntwork.checkout.addons.houston_auth.enabled){
        subscriptionDetails += (' • Houston Auth: ' + Gruntwork.checkout.addons.houston_auth.options.users + ' user(s)');
      }
      /*if (Gruntwork.checkout.addons.houston_pro.enabled){
        subscriptionDetails += (' • Houston Pro: ' + Gruntwork.checkout.addons.houston_pro.options.users + ' users');
      }*/

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
  }

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
    // Sets the default subscription.
    _handleTabChange(
      Gruntwork.checkout.subscription,
      Gruntwork.checkout.subscription
    );

  });

});
