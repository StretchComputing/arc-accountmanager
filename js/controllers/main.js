var EXELON = (function (r, $) {
  'use strict';

  r.controller = {

    // Check if the user is logged in
    isLoggedIn: function (eventType, matchObj, ui, page, evt) {
      try {
        RSKYBOX.log.info('entering', 'main.js.isLoggedIn');

        // Theoretically, don't need to preven default just to reroute a request, but could not get
        // this method to work without it.  Without it, it would just endlessly display loading indicator.
        evt.preventDefault();

        var authHeader = r.getAuthorizationHeader();
        if(authHeader.length > 0) {
          // token is valid, no need to log in, re-route to the home screen
          ui.toPage = $('#home');
        }

        // MUST be called when e.preventDefault() is called.
        ui.bCDeferred.resolve();

      } catch (e) {
        RSKYBOX.log.error(e, 'main.js.isLoggedIn');
      }
    },

    // Login
    loginBeforeShow: function () {
      try {
        RSKYBOX.log.info('entering', 'main.js.loginBeforeShow');

        if (r.loginView) {
          r.loginView.undelegateEvents();
          delete r.loginView;
        }
        r.loginView = new r.LoginView({
          el: $('#loginForm'),
          model: new r.Login(),
        });
      } catch (e) {
        RSKYBOX.log.error(e, 'main.js.loginBeforeShow');
      }
    },

    loginShow: function () {
      try {
        RSKYBOX.log.info('entering', 'main.js.loginShow');
        r.loginView.render();
        r.flash.check();
      } catch (e) {
        RSKYBOX.log.error(e, 'main.js.loginShow');
      }
    },

    // Home Screen
    homeBeforeCreate: function () {
      try {
        // TODO -- is the event handler called multiple times for each JQM page -- best guess, no, it's not
        RSKYBOX.log.info('entering', 'main.js.homeBeforeCreate');
        r.attachPanel("home");
      } catch (e) {
        RSKYBOX.log.error(e, 'main.js.homeBeforeCreate');
      }
    },

    homeInit: function () {
      try {
        RSKYBOX.log.info('entering', 'main.js.homeInit');

        if (r.requisitionsView) {
          r.requisitionsView.undelegateEvents();
          delete r.requisitionsView;
        }
        if (r.invoicesView) {
          r.invoicesView.undelegateEvents();
          delete r.invoicesView;
        }

        r.requisitionsView = new r.RequisitionsView({
          el: $('#pending'),
          collection: new r.Requisitions()
        });
        r.invoicesView = new r.InvoicesView({
          el: $('#pending'),
          collection: new r.Invoices()
        });

        r.refreshHome();
        r.homeInitComplete = true;

      } catch (e) {
        RSKYBOX.log.error(e, 'main.js.homeInit');
      }
    },

    requisitionBeforeCreate: function () {
      try {
        RSKYBOX.log.info('entering', 'main.js.requisitionBeforeCreate');
        r.attachPanel("requisition");
      } catch (e) {
        RSKYBOX.log.error(e, 'main.js.requisitionBeforeCreate');
      }
    },

    requisitionInit: function () {
      try {
        RSKYBOX.log.info('entering', 'main.js.requisitionInit');

        if (r.requisitionView) {
          r.requisitionView.undelegateEvents();
          delete r.requisitionView;
        }

        r.requisitionView = new r.RequisitionView({
          el: $('#requisitionDetails'),
          model: new r.Requisition()
        });

      } catch (e) {
        RSKYBOX.log.error(e, 'main.js.requisitionInit');
      }
    },

    requisitionShow: function () {
      try {
        RSKYBOX.log.info('entering', 'main.js.requisitionShow');
        var contrrequisition = r.session.params.id;

        // start by clearing any previous requisition that may already be displayed
        //$('#requisitionDetails').html("");
        var model = r.requisitionsView.collection.findWhere({"contrrequisition" : contrrequisition});
        r.requisitionView.setModel(model);
        r.requisitionView.render();

        if (r.reqAccountingsView) {
          r.reqAccountingsView.undelegateEvents();
          delete r.reqAccountingsView;
        }

        r.reqAccountingsView = new r.ReqAccountingsView({
          el: $('#reqAccounting'),
          collection: new r.ReqAccountings()
        });

        r.reqAccountingsView.collection.setUrl(model.get('axrefcode'));
        r.reqAccountingsView.collection.fetch({  headers: {'Authorization' : r.getAuthorizationHeader()},
                                                      statusCode: r.statusCodeHandlers(),
                                                      reset: true });
      } catch (e) {
        RSKYBOX.log.error(e, 'main.js.requisitionShow');
      }
    },

    invoiceBeforeCreate: function () {
      try {
        RSKYBOX.log.info('entering', 'main.js.invoiceBeforeCreate');
        r.attachPanel("invoice");
      } catch (e) {
        RSKYBOX.log.error(e, 'main.js.invoiceBeforeCreate');
      }
    },

    invoiceInit: function () {
      try {
        RSKYBOX.log.info('entering', 'main.js.invoiceInit');

        if (r.invoiceView) {
          r.invoiceView.undelegateEvents();
          delete r.invoiceView;
        }

        r.invoiceView = new r.InvoiceView({
          el: $('#invoiceDetails'),
          model: new r.Invoice()
        });
      } catch (e) {
        RSKYBOX.log.error(e, 'main.js.invoiceInit');
      }
    },

    invoiceShow: function () {
      try {
        RSKYBOX.log.info('entering', 'main.js.invoiceShow');
        var paymtrefno = r.session.params.id;

        // start by clearing any previous invoice that may already be displayed
        //$('#invoiceDetails').html("");
        var model = r.invoicesView.collection.findWhere({"paymtrefno" : paymtrefno});
        r.invoiceView.setModel(model);
        r.invoiceView.render();

        if (r.invAccountingsView) {
          r.invAccountingsView.undelegateEvents();
          delete r.invAccountingsView;
        }

        r.invAccountingsView = new r.InvAccountingsView({
          el: $('#invAccounting'),
          collection: new r.InvAccountings()
        });

        r.invAccountingsView.collection.setUrl(paymtrefno);
        r.invAccountingsView.collection.fetch({  headers: {'Authorization' : r.getAuthorizationHeader()},
                                                      statusCode: r.statusCodeHandlers(),
                                                      reset: true });

      } catch (e) {
        RSKYBOX.log.error(e, 'main.js.invoiceShow');
      }
    },

    scopeBeforeCreate: function () {
      try {
        RSKYBOX.log.info('entering', 'main.js.scopeBeforeCreate');
        r.attachPanel("scope");
      } catch (e) {
        RSKYBOX.log.error(e, 'main.js.scopeBeforeCreate');
      }
    },

    scopeInit: function () {
      try {
        RSKYBOX.log.info('entering', 'main.js.scopeInit');

        if (r.scopeView) {
          r.scopeView.undelegateEvents();
          delete r.scopeView;
        }

        r.scopeView = new r.ScopeView({
          el: $('#scopeDetails'),
          model: new r.Scope()
        });

      } catch (e) {
        RSKYBOX.log.error(e, 'main.js.scopeInit');
      }
    },

    scopeShow: function () {
      try {
        RSKYBOX.log.info('entering', 'main.js.scopeShow');
        var oleidscope = r.session.params.id;

        // start by clearing any previous scope that may already be displayed
        //$('#scopeDetails').html("");

        r.scopeView.model.setUrl(oleidscope);
        r.scopeView.model.fetch({  headers: {'Authorization' : r.getAuthorizationHeader()},
                                   statusCode: r.statusCodeHandlers() });

      } catch (e) {
        RSKYBOX.log.error(e, 'main.js.scopeShow');
      }
    },

    // Session Setup
    setupSession: function (eventType, matchObj, ui, page, evt) {
      try {
        RSKYBOX.log.info('entering', 'main.js.setupSession');
        r.session = r.session || {};
        r.session.params = r.router.getParams(location.hash);
      } catch (e) {
        RSKYBOX.log.error(e, 'main.js.setupSession');
      }
    },

    flashCheck: function () {
      try {
        RSKYBOX.log.info('entering', 'main.js.flashCheck');
        r.flash.check();
      } catch (e) {
        RSKYBOX.log.error(e, 'main.js.flashCheck');
      }
    }

  };

  r.refreshHome = function() {
      try {
        RSKYBOX.log.info('entering', 'main.js.refreshHome');

        $.mobile.showPageLoadingMsg();

        // first, clear the list that holds both the requisitions and invoices
        $('#pending').html("");

        // fetch requisitions and invoices
        r.requisitionsView.collection.fetch({  headers: {'Authorization' : r.getAuthorizationHeader()},
                                                    statusCode: r.statusCodeHandlers(),
                                                    reset: true });
        r.invoicesView.collection.fetch({      headers: {'Authorization' : r.getAuthorizationHeader()},
                                                    statusCode: r.statusCodeHandlers(),
                                                    reset: true });
      } catch (e) {
        RSKYBOX.log.error(e, 'main.js.refreshHome');
      }
  };

  r.unauthorized = function() {
      try {
        RSKYBOX.log.info('entering', 'main.js.unauthorized');
        r.logOut();
        if($.mobile.activePage.is('#login')) {
          r.flash.error('Authentication failed, please try again');
          // clear the password field
          $('#password').val("");
        } else {
          r.flash.set('warning', 'Your session ended, please login');
          $.mobile.changePage( "#login", { transition: "slideup", changeHash: false });
        }
      } catch (e) {
        RSKYBOX.log.error(e, 'main.js.unauthorized');
      }
  };

  r.attachPanel = function(pageName) {
    try {
      // attach panel -- built via template
      var template = _.template($('#leftPanelTemplate').html());
      var content = template({});
      
      // need to make panel ID unique for each JQM page
      content = content.replace("page_leftPanel", pageName+"_leftPanel");
      $('#'+pageName).append(content);

      // set the user name field on the panel
      $('.userName').html(r.getUserName());

    } catch (e) {
      RSKYBOX.log.error(e, 'main.js.attachPanel');
    }
  };
  
  // Define event handlers for panel. Done here so it only happens one time -- when HTML page is loaded
  $(document).on('click', '.logOut', function(){
    r.logOut();
    $.mobile.changePage( "#login", { transition: "slideup", changeHash: true });
    return false;
  });

  $(document).on('click', '.home', function(e){
    if($.mobile.activePage.is('#home')) {
      $('#home_leftPanel').panel("close");
    } else {
      $.mobile.changePage( "#home", { transition: "slideup", changeHash: true });
    }
    return false;
  });


  try {
    r.router = new $.mobile.Router([
      { '.*':                    { handler: 'setupSession',        events: 'bs'  } },
//      { '.*':                    { handler: 'flashCheck',        events: 's'   } },
      { '#login':                { handler: 'isLoggedIn',        events: 'bC', step: 'page' } },
      { '#login':                { handler: 'loginBeforeShow',   events: 'bs'  } },
      { '#login':                { handler: 'loginShow',         events: 's'   } },
      { '#home':                 { handler: 'homeBeforeCreate',  events: 'bc'  } },
      { '#home':                 { handler: 'homeInit',    events: 'i'  } },
      { '#requisition[?]id=.*':  { handler: 'requisitionBeforeCreate',  events: 'bc'  } },
      { '#requisition[?]id=.*':  { handler: 'requisitionInit',  events: 'i'  } },
      { '#requisition[?]id=.*':  { handler: 'requisitionShow',  events: 's'  } },
      { '#invoice[?]id=.*':      { handler: 'invoiceBeforeCreate',  events: 'bc'  } },
      { '#invoice[?]id=.*':      { handler: 'invoiceInit',  events: 'i'  } },
      { '#invoice[?]id=.*':      { handler: 'invoiceShow',  events: 's'  } },
      { '#scope[?]id=.*':        { handler: 'scopeBeforeCreate',  events: 'bc'  } },
      { '#scope[?]id=.*':        { handler: 'scopeInit',  events: 'i'  } },
      { '#scope[?]id=.*':        { handler: 'scopeShow',  events: 's'  } }
    ], r.controller);
  } catch (e) {
    RSKYBOX.log.error(e, 'EXELON.main.router');
  }

  return r;
}(EXELON || {}, jQuery));
