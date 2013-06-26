var EXELON = (function (r, $) {
  'use strict';

  r.controller = {

    // Check if the user is logged in
    isLoggedIn: function (eventType, matchObj, ui, page, evt) {
      try {
        RSKYBOX.log.info('entering', 'main.js.isLoggedIn');

        // Theoretically, don't need to prevent default just to reroute a request, but could not get
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
    
    // Customer Select Screen
    customerSelectBeforeCreate: function() {
    	try{
    		RSKYBOX.log.info('entering', 'main.js.customerSelectBeforeCreate')
    		
    		var recentCustomers = [];
    		/*TODO:Read in data from local storage*/
    		recentCustomers.push({name: "addNew", displayName : "Add New", onClick: function(e){
    			$.mobile.changePage( "#newCustomer", { transition: "slideup", changeHash: true });	
    		}});
    		/*Add names to list*/
    		var customerList = $('#recentCustomerList')
    		for(var i = 0; i < recentCustomers.length; i++){
    			var cust = recentCustomers[i];
    			customerList.append('<li><a class="' + cust.name + 'Cust">' + cust.displayName + '</a></li>');
    			$(document).on('click', '.'+cust.name+'Cust', cust.onClick);  //Register event handler
    		}
    		
    	}
    	catch(e){
    		RSKYBOX.log.error(e, 'main.js.custmoerSelectBeforeCreate')
    	}
    },
    
    customerSelectInit: function() {
    	try{
    		RSKYBOX.log.info('entering', 'main.js.customerSelectInit')
    		
    	}
    	catch(e){
    		RSKYBOX.log.error(e, 'main.js.custmoerSelectInit')
    	}
    },
    
    customerSelectShow: function() {
    	try{
    		RSKYBOX.log.info('entering', 'main.js.customerSelectShow')
    		
    	}
    	catch(e){
    		RSKYBOX.log.error(e, 'main.js.custmoerSelectShow')
    	}
    },
    
    newCustomerBeforeCreate: function() {
    	try{
    		RSKYBOX.log.info('entering', 'main.js.newCustomerBeforeCreate')
    		var form = $('#newCustForm');
    		form.append('<button class="newCustSubmit">Submit</button>');
    		form.append('<button class="newCustCancel">Cancel</button>');
    		$(document).on('click', '.newCustSubmit', function(e){
    			var newCustomer ={};
    			var inputs = $('#newCustForm :input');
    			newCustomer.display = new Array();
    			for(var i = 0; i < inputs.length; i++){
    				var input = inputs[i];
    				if(input.name == "")
    					continue;
    				var display = {};
    				display.name = input.name;
    				display.value = input.value;
    				newCustomer.display[i] = display;
    				newCustomer[input.name] = input.value;
    			}
    			/*Submit to server*/
    			
    			r.currentCustomer = newCustomer;
    			$.mobile.changePage( "#home", { transition: "slideup", changeHash: true });
    			
    			return;
    		});
    		$(document).on('click', '.newCustCancel', function(e){
    			$.mobile.changePage( "#customerSelect", { transition: "slideup", changeHash: true });
    			return;
    		});
    	}
    	catch(e){
    		RSKYBOX.log.error(e, 'main.js.newCustomerBeforeCreate')
    	}
    },
    
    newCustomerInit: function() {
    	try{
    		RSKYBOX.log.info('entering', 'main.js.newCustomerInit')
    		
    	}
    	catch(e){
    		RSKYBOX.log.error(e, 'main.js.newCustomerInit')
    	}
    },
    
    newCustomerShow: function() {
    	try{
    		RSKYBOX.log.info('entering', 'main.js.newCustomerShow')
    		
    	}
    	catch(e){
    		RSKYBOX.log.error(e, 'main.js.newCustomerShow')
    	}
    },
    
    // Home Screen
    homeBeforeCreate: function () {
      try {
        RSKYBOX.log.info('entering', 'main.js.homeBeforeCreate');
        r.attachPanel("home");
        /*put in the elements from the 'current customer' object*/
        var home = $('#homeStart');
        for(var i = 0; i <r.currentCustomer.display.length; i++){
        	var name = r.currentCustomer.display[i].name;
        	var value = r.currentCustomer.display[i].value;
        	if(name != "")
        		home.append('<h1>'+name + ": " + value + '</h1>');
        }
        
      } catch (e) {
        RSKYBOX.log.error(e, 'main.js.homeBeforeCreate');
      }
    },

    homeInit: function () {
      try {
        RSKYBOX.log.info('entering', 'main.js.homeInit');
      } catch (e) {
        RSKYBOX.log.error(e, 'main.js.homeInit');
      }
    },

    homeShow: function () {
      try {
        RSKYBOX.log.info('entering', 'main.js.homeShow');
        
      } catch (e) {
        RSKYBOX.log.error(e, 'main.js.homeShow');
      }
    },

    // Configure Screen
    configureBeforeCreate: function () {
      try {
        RSKYBOX.log.info('entering', 'main.js.configureBeforeCreate');
        r.attachPanel("configure");
      } catch (e) {
        RSKYBOX.log.error(e, 'main.js.configureBeforeCreate');
      }
    },

    configureInit: function () {
      try {
        RSKYBOX.log.info('entering', 'main.js.configureInit');
      } catch (e) {
        RSKYBOX.log.error(e, 'main.js.configureInit');
      }
    },

    configureShow: function () {
      try {
        RSKYBOX.log.info('entering', 'main.js.configureShow');
      } catch (e) {
        RSKYBOX.log.error(e, 'main.js.configureShow');
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

  $(document).on('click', '.configure', function(e){
    if($.mobile.activePage.is('#configure')) {
      $('#configure_leftPanel').panel("close");
    } else {
      $.mobile.changePage( "#configure", { transition: "slideup", changeHash: true });
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
      { '#home':                 { handler: 'homeShow',    events: 's'   } },
      { '#customerSelect':       { handler: 'customerSelectBeforeCreate', events: 'bc'} },
      { '#customerSelect':       { handler: 'customerSelectInit', events: 'i'} },
      { '#customerSelect':       { handler: 'customerSelectShow', events: 's'} },
      { '#newCustomer':          { handler: 'newCustomerBeforeCreate', events: 'bc'} },
      { '#newCustomer':          { handler: 'newCustomerInit', events: 'i'} },
      { '#newCustomer':          { handler: 'newCustomerShow', events: 's'} },
      { '#configure':            { handler: 'configureBeforeCreate',  events: 'bc'  } },
      { '#configure':            { handler: 'configureInit',    events: 'i'  } },
      { '#configure':            { handler: 'configureShow',    events: 's'   } }
    ], r.controller);
  } catch (e) {
    RSKYBOX.log.error(e, 'EXELON.main.router');
  }

  return r;
}(EXELON || {}, jQuery));
