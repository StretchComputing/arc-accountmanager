var EXELON = (function (r, $) {
  'use strict';


  r.LoginView = Backbone.View.extend({
    initialize: function () {
      try {
        _.bindAll(this, 'apiError');
        this.model.on('change', this.render, this);
        this.model.on('error', this.error, this);
        this.template = _.template($('#loginTemplate').html());
      } catch (e) {
        RSKYBOX.log.error(e, 'LoginView.initialize');
      }
    },

    events: {
      'submit': 'submit'
    },

    submit: function (evt) {
      try {
        var valid;
      
        var stubbedOff = true;
        if(stubbedOff) {
          RSKYBOX.log.info('THE LOGIN PROCESS IS CURRENTLY STUBBED OFF!!!', 'Login.submit');
          
          if(!r.currentCustomer) /*Make page transition to customer select page*/
      		{
      			$.mobile.changePage( "#customerSelect", { transition: "slideup", changeHash: true });
      		}
          
          else {
        	  $.mobile.changePage( "#home", { transition: "slideup", changeHash: false });
          }
          
          evt.preventDefault();
          return false;
        }

        valid = this.model.set({
          aduser: this.$("input[name='login']").val(),
          password: this.$("input[name='password']").val()
        });

        if (valid) {
          this.model.prepareNewModel();

          // using a direct ajax call instead of a model.save because we don't want to sent the entire User model to the server
          $.ajax({
            dataType: 'json',
            contentType: 'application/json',
            type: 'POST',
            url: this.model.url,
            data: JSON.stringify(this.model.getQueryObject()),
            success: this.success,
            statusCode: r.statusCodeHandlers(this.apiError)
          });
} evt.preventDefault();
        return false;
      } catch (e) {
        RSKYBOX.log.error(e, 'LoginView.submit');
      }
    },

    success: function (model, response) {
      try {
        RSKYBOX.log.info('entering', 'Login.success');
        EXELON.logIn(model);

        $.mobile.showPageLoadingMsg();

        // refresh the home page if it already exists. If it doesn't exist yet, it will be created and populated when first displayed
        if(r.homeInitComplete) { 
          RSKYBOX.log.info('refershing home sreen after successful login', 'Login.success');
          r.refreshHome();
        }
        $.mobile.changePage( "#home", { transition: "slideup", changeHash: false });
      } catch (e) {
        RSKYBOX.log.error(e, 'LoginView.success');
      }
    },

    error: function (model, response) {
      try {
        if (response.responseText) { return; }  // This is an apiError.
        RSKYBOX.log.info(response, 'LoginView.error');
        r.flash.warning(response);    // This is a validation error.
      } catch (e) {
        RSKYBOX.log.error(e, 'LoginView.error');
      }
    },

    apiError: function (jqXHR) {
      try {
        var code = r.getApiStatus(jqXHR.responseText);
        RSKYBOX.log.info(code, 'LoginView.apiError');

        if (!this.apiCodes[code]) {
          RSKYBOX.log.warn('Undefined apiStatus: ' + code, 'LoginView.apiError');
          this.apiCodes[code] = 'An unknown error occurred. Please try again.';
        }
        this.model.clear({silent: true});
        r.flash.warning(this.apiCodes[code]);
      } catch (e) {
        RSKYBOX.log.error(e, 'LoginView.apiError');
      }
    },

    render: function () {
      try {
        var content = this.template(this.model.getMock());

        $(this.el).empty();
        $(this.el).html(content);
        $(this.el).trigger('create');
        return this;
      } catch (e) {
        RSKYBOX.log.error(e, 'LoginView.render');
      }
    },

    apiCodes: {
      // no application level errors for this API. If authentication fails, an HTTP 401 is returned
    }
  });


  return r;
}(EXELON || {}, jQuery));
