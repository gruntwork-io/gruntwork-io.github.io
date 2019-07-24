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
     * Description: Measure how many people will reach out to us based on prominent
     * CTAs on pages listed under Services.
     */
    (function () {
      $('.services-ctas').click(function() {
        // record each unique user that clicks the button
        optimizely.track('clicked_services_cta', userId)
      })
      const variation = optimizely.activate('services_cta_experiment', userId);
      if (variation === 'show') {
        $('.services-ctas').show();
      }
    })();

    /**
     * Experiment: Products CTA
     * Description: Measure how many people will reach out to us based on prominent
     * CTAs on pages listed under Products.
     */
    (function () {
      $('.products-ctas').click(function() {
        // record each unique user that clicks the button
        optimizely.track('clicked_products_cta', userId);
      })
      const variation = optimizely.activate('products_cta_experiment', userId);
      if (variation === 'show') {
        $('.products-ctas').show();
      }
    })();

  });
})(window.jQuery);

