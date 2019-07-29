(function($) {
  // Instantiate an Optimizely client
  const options = {
    sdkKey: '8E1RuW2VLAS2csau84LZRq',
    datafileOptions: {
      autoUpdate: true,
      updateInterval: 6000, // 1 minute in milliseconds
    }
  };
  const optimizelyClientInstance = window.optimizelySdk.createInstance(options);

  optimizelyClientInstance.onReady().then(() => {
    // optimizelyClientInstance is ready to use, with datafile downloaded from the Optimizely CDN

    const optimizelyEndUserIdCookieKey = 'optimizelyEndUserId';
    if (!getCookiebyName(optimizelyEndUserIdCookieKey)) {
      // Create optimizely UserID
      setCookie(optimizelyEndUserIdCookieKey, generateUUID(), 365);
    }
    const userId = getCookiebyName(optimizelyEndUserIdCookieKey);

    /**
     * Experiment: Services CTA
     * Description: This experiment seeks to test out the variations of navbar and checkout flows
     * to track the following in each variation:
     * How many people;
     *
     * - End up on the checkout page
     * - Click the checkout button
     * - End up on the contact page
     * - Contact us after reaching the contact page
     * - Click on the other buttons in the Nav
     * - Pick the add ons per cloud provider
     * - Click the learn more vs Get Demo
     * - Click ask a grunt vs contact sales
     */
    (function () {
      var variation = optimizelyClientInstance.activate('navbar_and_checkout_flow', userId);
      if (variation === 'original_nav_plus_original_checkout_flow') {
        // Pick the desired hidden elements to show for this variation
        $('#navbar-original').show();
        $('#learn-more').show();
      } else if (variation === 'original_nav_plus_beta_checkout_flow') {
        // execute code for original_nav_plus_beta_checkout_flow
      } else if (variation === 'beta_nav_plus_beta_checkout_flow') {
        // execute code for beta_nav_plus_beta_checkout_flow
      } else if (variation === 'beta_nav_plus_original_checkout_flow') {
        // execute code for beta_nav_plus_original_checkout_flow
      } else {
        // execute default code
      }


      // Metrics to track
      $('.contact-cta, .product-ctas, .service-ctas').click(function () {
        optimizelyClientInstance.track('user_clicked_checkout_button', userId);
      });
      $('.nav-item-central').click(function () {
        optimizelyClientInstance.track('user_clicked_on_other_navbar_buttons', userId);
      });
      $('.home-page-cta').click(function () {
        optimizelyClientInstance.track('user_clicked_home_page_main_cta', userId);
      });
    })();

    /**
     * Experiment: Products CTA
     * Description: Check if there is an increase in customer reach out based on prominent
     * CTAs on pages listed under Products.
     */
    // (function () {
    //   const variation = optimizely.activate('products_cta_experiment', userId);
    //   if (variation === 'show') {
    //     // The CTAs default display is set to hidden so set it to show
    //     $('.products-ctas').show();
    //   }

    //   // Track the metrics
    //   $('.products-ctas').click(function() {
    //     // record each unique user that clicks the button
    //     optimizely.track('clicked_products_cta', userId);
    //   })
    // })();

    /**
     * Experiment: Pricing Page Beta
     * Description: Compare engagement of new pricing page versus existing one.
     */
    // (function () {
    //   const variation = optimizely.activate('pricing_beta_experiment', userId);
    //   if (variation === 'beta') {
    //     // Navbar buy now button should link to the pricing-beta page
    //     $('#navbar-buy-now').attr('href', '/pricing-beta/');
    //   }

    //   // Track the metrics
    //   $('.pricing-ctas').click(function() {
    //     // record each unique user that clicks the button
    //     optimizely.track('clicked_pricing_cta', userId);
    //   })
    // })();

    /**
     * Experiment: Checkout Page Beta
     * Description: Compare engagement of new checkout page versus existing one.
     */
    // (function () {
    //   const variation = optimizely.activate('checkout_beta_experiment', userId);
    //   if (variation === 'beta') {
    //     // Pricing CTA buttons should link to the checkout-beta page
    //     $('.pricing-cta-aws').attr('href', '/checkout-beta/?subscription-type=aws');
    //     $('.pricing-cta-gcp').attr('href', '/checkout-beta/?subscription-type=gcp');
    //   }

    //   // Track the metrics
    //   $('.checkout-addons').click(function() {
    //     // record each unique user that clicks the checkout CTAs
    //     optimizely.track('clicked_checkout_addon', userId);
    //   })
    // })();

    /**
     * Experiment: Unified Checkout Flow
     * Description: Compare conversion of unified flow versus existing flow.
     */
    // (function () {
    //   const variation = optimizely.activate('unified_checkout_flow_experiment', userId);
    //   if (variation === 'unified') {
    //     // Navbar buy now button should link to the pricing-beta page
    //     $('#navbar-buy-now').attr('href', '/pricing-beta/');
    //     // Pricing CTA buttons should link to the checkout-beta page
    //     $('.pricing-cta-aws').attr('href', '/checkout-beta/?subscription-type=aws');
    //     $('.pricing-cta-gcp').attr('href', '/checkout-beta/?subscription-type=gcp');
    //   }

    //   // Track the metrics
    //   $('.btn-checkout').click(function() {
    //     // record each unique user that clicks the checkout CTAs
    //     optimizely.track('clicked_checkout_cta', userId);
    //   })
    // })();
  });
})(window.jQuery);

