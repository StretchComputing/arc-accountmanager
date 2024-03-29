var ARC = (function (r, $) {
  'use strict';


  r.LoginView = Backbone.View.extend({
    initialize: function () {
      try {
        _.bindAll(this, 'apiError', 'success');
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
      
        $.mobile.showPageLoadingMsg();

//        var stubbedOff = true;
//        if(stubbedOff) {
//          RSKYBOX.log.info('THE LOGIN PROCESS IS CURRENTLY STUBBED OFF!!!', 'Login.submit');
          
//          $.mobile.changePage( "#selectMerchant", { transition: "slideup", changeHash: false });
          
//          evt.preventDefault();
//          return false;
//        }

        valid = this.model.set({
          Login: this.$("input[name='login']").val(),
          Password: this.$("input[name='password']").val()
        });

        if (valid) {
          this.model.prepareNewModel();

					var loginUrl = baseUrl + "customers/token";
          // using a direct ajax call instead of a model.save because we don't want to send the entire User model to the server
          $.ajax({
            dataType: 'json',
            contentType: 'application/json',
            type: 'POST',
            url: loginUrl,
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
				// Login not part of the results returned by server, so add it in so it gets stored and can be used for rskybox later
				model.Results.Login = this.model.get('Login');
        r.logIn(model.Results);
        $.mobile.changePage( "#selectMerchant", { transition: "slideup", changeHash: true});
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
			106: "Username and/or Password incorrect, please try again"
    }
  });


  return r;
}(ARC || {}, jQuery));
