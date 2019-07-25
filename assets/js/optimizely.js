(function($) {
  // Instantiate an Optimizely client
  const options = {
    sdkKey: 'FPG4ek9vP3HhuN53J3JYxe',
    datafileOptions: {
      autoUpdate: true,
      updateInterval: 6000, // 1 minute in milliseconds
    }
  };
  const optimizely = window.optimizelySdk.createInstance(options);

  optimizely.onReady().then(() => {
    // optimizelyClientInstance is ready to use, with datafile downloaded from the Optimizely CDN

    const optimizelyEndUserIdCookieKey = 'optimizelyEndUserId';
    if (!getCookiebyName(optimizelyEndUserIdCookieKey)) {
      // Create optimizely UserID
      setCookie(optimizelyEndUserIdCookieKey, generateUUID(), 365);
    }
    const userId = getCookiebyName(optimizelyEndUserIdCookieKey);

    /**
     * Experiment: Services CTA
     * Description: Check if there is an increase in customer reach out based on prominent
     * CTAs on pages listed under Services.
     */
    (function () {
      const variation = optimizely.activate('services_cta_experiment', userId);
      if (variation === 'show') {
        // The CTAs default display is set to hidden so set it to show
        $('.services-ctas').show();
      }

      // Track the metrics
      $('.services-ctas').click(function() {
        // record each unique user that clicks the button
        optimizely.track('clicked_services_cta', userId)
      })
    })();

    /**
     * Experiment: Products CTA
     * Description: Check if there is an increase in customer reach out based on prominent
     * CTAs on pages listed under Products.
     */
    (function () {
      const variation = optimizely.activate('products_cta_experiment', userId);
      if (variation === 'show') {
        // The CTAs default display is set to hidden so set it to show
        $('.products-ctas').show();
      }

      // Track the metrics
      $('.products-ctas').click(function() {
        // record each unique user that clicks the button
        optimizely.track('clicked_products_cta', userId);
      })
    })();

    /**
     * Experiment: Pricing Page Beta
     * Description: Compare engagement of new pricing page versus existing one.
     */
    (function () {
      const variation = optimizely.activate('pricing_beta_experiment', userId);
      if (variation === 'beta') {
        // Navbar buy now button should link to the pricing-beta page
        $('#navbar-buy-now').attr('href', '/pricing-beta/');
      }

      // Track the metrics
      $('.pricing-ctas').click(function() {
        // record each unique user that clicks the button
        optimizely.track('clicked_pricing_cta', userId);
      })
    })();

    /**
     * Experiment: Checkout Page Beta
     * Description: Compare engagement of new checkout page versus existing one.
     */
    (function () {
      const variation = optimizely.activate('checkout_beta_experiment', userId);
      if (variation === 'beta') {
        // Pricing CTA buttons should link to the checkout-beta page
        $('.pricing-cta-aws').attr('href', '/checkout-beta/?subscription-type=aws');
        $('.pricing-cta-gcp').attr('href', '/checkout-beta/?subscription-type=gcp');
      }

      // Track the metrics
      $('.checkout-addons').click(function() {
        // record each unique user that clicks the checkout CTAs
        optimizely.track('clicked_checkout_addon', userId);
      })
    })();

    /**
     * Experiment: Unified Checkout Flow
     * Description: Compare conversion of unified flow versus existing flow.
     */
    (function () {
      const variation = optimizely.activate('unified_checkout_flow_experiment', userId);
      if (variation === 'unified') {
        // Navbar buy now button should link to the pricing-beta page
        $('#navbar-buy-now').attr('href', '/pricing-beta/');
        // Pricing CTA buttons should link to the checkout-beta page
        $('.pricing-cta-aws').attr('href', '/checkout-beta/?subscription-type=aws');
        $('.pricing-cta-gcp').attr('href', '/checkout-beta/?subscription-type=gcp');
      }

      // Track the metrics
      $('.btn-checkout').click(function() {
        // record each unique user that clicks the checkout CTAs
        optimizely.track('clicked_checkout_cta', userId);
      })
    })();
  });
})(window.jQuery);

