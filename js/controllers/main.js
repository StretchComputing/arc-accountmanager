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
    
    // Home Screen
    homeBeforeCreate: function () {
      try {
        RSKYBOX.log.info('entering', 'main.js.homeBeforeCreate');
        r.attachPanel("home");
        /*put in the elements from the 'current customer' object*/
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
        if(!r.merchantList)
        	r.getMerchants();
        else
        	r.writeMerchantList($('#merchantListCollapsible'), r.merchantList);
      } catch (e) {
        RSKYBOX.log.error(e, 'main.js.homeShow');
      }
    },
    
    homeHide: function(){
    	try{
    		RSKYBOX.log.info('entering', 'main.js.homeHide');
    		var toClear = $('#merchantListCollapsible');
    		toClear.empty(); /*Remove all old html in the list*/
    	}
    	catch(e){
    		RSKYBOX.log.error(e, 'main.js.homeHide');
    	}
    },
    
    
    
    editMerchantShow: function(){
    	try{
    		RSKYBOX.log.info('entering', 'main.js.editMerchantShow');
    		
    		r.merchantForm("editMerchant", false);
    		
    	}
    	catch(e){
    		RSKYBOX.log.error(e, 'main.js.editMerchantShow');
    	}
    },
    
    editMerchantHide: function(){
    	try{
    		RSKYBOX.log.info('entering', 'main.js.editMerchantHide');
    		$('#editMerchantContent').empty();
    		delete r.merchantToEdit.index;
    		delete r.merchantToEdit.pageIdPrefix;
    		
    		//deregister event handler for save
    		$('#editMerchantSave').unbind('click');
    	}
    	catch(e){
    		RSKYBOX.log.error(e, 'main.js.editMerchantHide');
    	}
    },

    createNewMerchantShow : function(){
    	try{
    		RSKYBOX.log.info('entering', 'main.js.createNewMerchantShow');
    		r.merchantForm("createNewMerchant", true);
    	}
    	catch(e){
    		RSKYBOX.log.error(e, 'main.js.createNewMerchantShow');
    	}
    },
    
    createNewMerchantHide: function(){
    	try{
    		RSKYBOX.log.info('entering', 'main.js.createNewMerchantHide');
    		$('#createNewMerchantContent').empty();
    		$('#createNewMerchantSave').unbind('click');
    	}
    	catch(e){
    		RSKYBOX.log.error(e, 'main.js.createNewMerchantHide');
    	}
    },
    
    /*Merchant Display Screen (displays information about the active merchant*/
    merchantDisplayBeforeCreate: function (){
    	try{
    		RSKYBOX.log.info('entering', 'main.js.merchantDisplayBeforeCreate');
    		r.attachPanel("merchantDisplay");
    		
    		  $('#merchantDisplayNoteSave').bind('click', function(e){
    				var textArea = $('#merchantDisplayNoteTextArea');
    				var newNote = {  UserName : r.getUserName(),
    						 		 LastUpdated : new Date(),
    						 		 Note : textArea.prop('value') };
    				r.activeMerchant.Notes.push(newNote);
    				textArea.prop('value', "");
    				$('#merchantDisplayNotePopup').popup('close');
    				
    				var act = { 'Type' : 'Note',
							  'UserName' : r.getUserName(),
							  'Date' : newNote.LastUpdated,
							  'Note' : newNote.Note};
    				r.activeMerchant.Activities.push(act);
    				
    				/*Update the displays on this page*/
    				var NoteTemplate = _.template($('#NoteDisplayTemplate').html())
    				var notesDisplay = $('#merchantDisplayNotesDisplay');
    				notesDisplay.prepend(NoteTemplate(newNote));
    				notesDisplay.listview('refresh');
    				
    				var activityDisplay = $('#merchantDisplayActivityFeed');
    				activityDisplay.prepend($('<li />', {
    					text : (MERCHANT.activityFeed[act.Type])(act) }));
    				activityDisplay.listview('refresh');

    			});
    			
    			$('#merchantDisplayNoteCancel').bind('click', function(e){
    				$('#merchantDisplayNoteTextArea').prop('value', "");
    				$('#merchantDisplayNotePopup').popup('close');
    			});
    	}
    	catch(e){
    		RSKYBOX.log.error(e, 'main.js.merchantDisplayBeforeCreate');
    	}
    },
    
    merchantDisplayShow: function(){
    	try{
    		RSKYBOX.log.info('entering', 'main.js.merchantDisplayShow');
    		
    		$('#merchantDisplayHead').text(r.activeMerchant.Name);
    		
    		var content = $('#merchantDisplayContent');
    		var template = _.template($('#merchantDisplayContentTemplate').html());
    		
    		content.append(template(r.activeMerchant));
    		
    		$('#merchantDisplayEdit').bind('click', function(e){
    			r.merchantToEdit = r.activeMerchant;
    			$.mobile.changePage("#editMerchant", { transition: "slideup", changeHash: true });
    		});
    		
    		
    		content.trigger('create');
    		
    	}
    	catch(e){
    		RSKYBOX.log.error(e, 'main.js.merchantDisplayShow');
    	}
    },
    
    merchantDisplayHide: function(){
    	try{
    		RSKYBOX.log.info('entering', 'main.js.merchantDisplayHide');
    		$('#merchantDisplayContent').empty();
    		$('#merchantDisplayHead').empty();
    	}
    	catch(e){
    		RSKYBOX.log.error(e, 'main.js.merchantDisplayHide');
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
	r.setConfigurePage(r.merchantList);
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
      RSKYBOX.log.info('entering', 'main.js.attachPanel');
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
		try {
			r.logOut();
			$.mobile.changePage( "#login", { transition: "slideup", changeHash: true });
			return false;
    } catch (e) {
      RSKYBOX.log.error(e, 'main.js.click.logOut');
    }
  });

  $(document).on('click', '.home', function(e){
		try {
			if($.mobile.activePage.is('#home')) {
				$('#home_leftPanel').panel("close");
			} else {
				$.mobile.changePage( "#home", { transition: "slideup", changeHash: true });
			}
			return false;
    } catch (e) {
      RSKYBOX.log.error(e, 'main.js.click.home');
    }
  });

  $(document).on('click', '.configure', function(e){
		try {
			if($.mobile.activePage.is('#configure')) {
				$('#configure_leftPanel').panel("close");
			} else {
				$.mobile.changePage( "#configure", { transition: "slideup", changeHash: true });
			}
			return false;
    } catch (e) {
      RSKYBOX.log.error(e, 'main.js.click.configure');
    }
  });

  var devUrl = 'http://dev.dagher.mobi/rest/v1/';
	var prdUrl = 'https://arc.dagher.mobi/rest/v1/';
  r.getMerchants = function() {
    try {
      RSKYBOX.log.info('entering', 'main.js.getMerchants');
      var closeurl = devUrl + 'merchants/list';
      var jsonobj = {};

      $.ajax({
        type: 'search',
        data: JSON.stringify(jsonobj),
        datatype: 'json',
        contenttype: 'application/json',
        url: closeurl,
        statuscode: r.statusCodeHandlers(),
				headers: {'Authorization' : r.getAuthorizationHeader()},
        success: function(data, status, jqXHR) {
                    try {
                    	r.merchantList = data.Results;
                    	r.fixMerchants(r.merchantList);
                    	r.writeMerchantList($('#merchantListCollapsible'), r.merchantList);
                    	var jtest = 5;
                    } catch (e) {
                      RSKYBOX.log.error(e, 'getMerchants.success');
                    }
                  }
      });
    } catch (e) {
      RSKYBOX.log.error(e, 'getMerchants');
    }
  };
  
  /*Makes a call to Merchant Create*/
  r.createMerchant = function(merchant){
	try {
		RSKYBOX.log.info('entering', 'main.js.createMerchant');
		RSKYBOX.log.info('Currently stubbed off:', 'main.js.createMerchant');
		/*
		var closeurl = devUrl + 'merchants/new';
		var jsonobj = cleanMerchant(merchant);
		
		$.ajax({
			type: 'post',
			data: JSON.stringify(jsonobj),
			datatype: 'json',
			contenttype: 'application/json',
			url: closeurl,
			statuscode : r.statusCodeHandlers(),
			success: function(){
				RSKYBOX.log.info('finished', 'main.js.createMerchant');
			}
		});*/
	}  
	catch(e){
		RSKYBOX.log.error(e,'main.js.createMerchant');
	};
  };
  
  r.updateMerchant = function(merchant){
	  try{
		  RSKYBOX.log.info('entering', 'main.js.updateMerchant');
		  RSKYBOX.log.info('Currently stubbed off:', 'main.js.updateMerchant');
		  
		  /*
		  if(merchant.EIN)
			  var closeurl = devUrl + merchants/update/ + merchant.EIN;
		  else
			  return; fail
		  
		  var jsonobj = cleanMerchant(merchant);
		  
		  $.ajax({
			  type : 'put',
			  data : JSON.stringify(jsonobj),
			  contenttype : 'application/json',
			  url : closeurl,
			  statuscode : r.statusCodeHandlers(),
			  success : function(){
				  RSKYBOX.log.info('finished', 'main.js.updateMerchant');
			  }
		  });
		  */
	  }
	  catch(e){
		  RSKYBOX.log.error(e, 'main.js.updateMerchant');
	  }
  };
  
  /*Remove all forms equal to "" */
  r.cleanMerchant = function(merchant){
	  var newMerchant = {};
	  for(var i = 0; i < MERCHANT.merchantDisplay.length; i++){
		  var prop = MERCHANT.merchantDisplay[i].propName;
		  if(merchant[prop] === "" || merchant[prop] === undefined){
			  continue;
		  }
		  else{
			  newMerchant[prop] = merchant[prop];
		  }
	  }
	  return newMerchant;
  };
  
  r.writeMerchantList = function(location, merchantList){
	  try{
		  RSKYBOX.log.info('entering', 'main.js.writeMerchantList');
		  
		  var merchantTemplate = _.template($('#collapsibleMercahntList').html());
		  
		  for(var i = 0; i < merchantList.length; i++){
			  merchantList[i].Number = i.toString();
			  merchantList[i].r = r; //Reference to other functions
			  location.append(merchantTemplate(merchantList[i]));
			  delete merchantList[i].Number;
			  delete merchantList[i].r;
			  
			  var choose = $('#merchantChoose'+i,location);
			  choose.bind('click', function(e){
				  var name = $(this).attr('merchantName');
				  r.activeMerchant = r.getMerchantByName(name);
				  $.mobile.changePage("#merchantDisplay");
			  });
			  
			  var edit = $('#merchantEdit' + i, location);
			  edit.bind('click', function(e){
				  var name = $(this).attr('merchantName');
				  r.merchantToEdit = r.getMerchantByName(name);
				  $.mobile.changePage( "#editMerchant", { transition: "slideup", changeHash: true });
			  });
		  }
		  
		  $('#homeContent').trigger('create');
	  }
	  catch(e){
		  RSKYBOX.log.error(e,'main.js.writeMerchantList');
	  }
  };
  
  r.getMerchantByName = function(name){
	  for(var i = 0; i < r.merchantList.length; i++){
		  if(name === r.merchantList[i].Name)
			  return r.merchantList[i];
	  }
  };
  
  r.fixMerchants = function(merchantList){
	  var propList = MERCHANT.merchantDisplay;
	  for(var merchIndex = 0; merchIndex < merchantList.length; merchIndex++){
		  var merchant = merchantList[merchIndex];
		  for(var propIndex = 0; propIndex < propList.length; propIndex++){
			  var prop = propList[propIndex].propName
			  if(merchant[prop] === undefined){
				  merchant[prop] = "";
			  }
		  }
		  var elm;
		  if( !(merchantList[merchIndex].DecisionMakers))
			  merchantList[merchIndex].DecisionMakers = [];
		  if( !(merchantList[merchIndex].Notes))
			  merchantList[merchIndex].Notes = [];
		  if( !(merchantList[merchIndex].Activities))
			  merchantList[merchIndex].Activities = [];
	  }
  };
  

	// merchants param:  an array of merchant javascript objects to be displayed
  r.displayMerchants = function(merchants) {
    try {
      RSKYBOX.log.info('entering', 'main.js.displayMerchants');

			// Creates the template object from the index.html <script> definition
			var merchantEntryTemplate = _.template($('#merchantEntryTemplate').html());

			var listHtmlContent = "";
			for(var merIndex = 0; merIndex < merchants.length; merIndex++) {
				// Call the template passing the merchant object.  This is where the fields in the merchant object are
				// substituted into the  <%= xyzField  %> constructs in the template. The template returns HTML ready
				// to be placed into the Document Object Model (DOM)
				listHtmlContent += merchantEntryTemplate(merchants[merIndex]);
			}

			// ok, now put the concatenated HTML from the for loop above into the DOM
			$('#merchantList').html(listHtmlContent);
    } catch (e) {
      RSKYBOX.log.error(e, 'displayMerchants');
    }
  };
  
  /*builds either the editMerchant or createNewMerchant page depending on the
   * given pageId and value of newMerchant (true for createNewMerchant, false for editMerhcant
   */
  r.merchantForm = function(pageId, newMerchant){

	  var merchant;
	  if(newMerchant){
		  merchant = {};
		  r.fixMerchants([merchant]);//create the necessary properties
		  //Do not modify the header
	  }
	  else{
		  merchant = r.merchantToEdit;
		  var head = $('#'+pageId+'Head').text('Editing ' + merchant.Name);//Modify the header
	  }

	  var start = new Date(); //measures the time it takes to fill out the form.

	  /*Modify the body*/
	  var content = $('#'+pageId+'Content');

	  merchant.pageIdPrefix = pageId;//Used for template
	  merchant.index = 0; //Also used in the template call
	  var editMerchantTemplate = _.template($('#editMerchantForm').html());

	  content.append(editMerchantTemplate(merchant));

	  var addNewPoc = $('#pocAddNew');

	  /*Register all the delete button handlers*/
	  for(var i = 0; i < merchant.index; i++){
		  r.registerDelete(pageId,i);
	  };

	  addNewPoc.bind('click', function(e){
		  var pocTemplate = _.template($('#decisionMakerForm').html());
		  $('#'+pageId+'PocList').append(pocTemplate({FirstName : "", LastName : "", 
			  Phone : "", Position : "", eMail : "", index : merchant.index,
			  pageIdPrefix : merchant.pageIdPrefix}));
		  $('#'+pageId+'PocList').trigger('create');

		  r.registerDelete(pageId,merchant.index);
		  merchant.index++;
	  });

	  $('#'+pageId+'GetLngLat').bind('click', function(e){
		  var lngObj = $('#'+pageId+'Longitude');
		  var latObj = $('#'+pageId+'Latitude');

		  var street = $('#'+pageId+'Street').val();
		  var city = $('#'+pageId+'City').val();
		  var state = $('#'+pageId+'State').val();
		  var zip = $('#'+pageId+'ZipCode').val();
		  if(street === "" || city === "" || state === ""){
			  var pop = $('#'+pageId+'RequiredPopup');
			  pop.empty();
			  pop.append($('<h1 />', {text : "You must fill out a fill address to find the longitude /latitude"}));
			  pop.popup("open");
			  return;
		  }

		  var address = r.readyAddress(street,city,state,zip);

		  r.fetchLngLat(lngObj,latObj,address);
	  });

	  var notesToAdd = [];
	  var activitiesToAdd = [];
	  
	  $('#'+pageId+'NoteSave').bind('click', function(e){
			var textArea = $('#'+pageId+'NoteTextArea');
			var newNote = {  UserName : r.getUserName(),
					 		 LastUpdated : new Date(),
					 		 Note : textArea.prop('value') };
			notesToAdd.push(newNote);
			textArea.prop('value', "");
			$('#'+pageId+'NotePopup').popup('close');
			
			var act = { 'Type' : 'Note',
					  'UserName' : r.getUserName(),
					  'Date' : newNote.LastUpdated,
					  'Note' : newNote.Note};
			activitiesToAdd.push(act);
	  });
	  
	  $('#'+pageId+'NoteCancel').bind('click', function(e){
			$('#'+pageId+'NoteTextArea').prop('value', "");
			$('#'+pageId+'NotePopup').popup('close');
		});
	  
	  $('#'+pageId+'Save').bind('click', function(e){
		  var form = $('#'+pageId+'List :input');
		  var formsFilled = [];
		  for(var i = 0; i < form.length; i++){
			  if(form[i].getAttribute('pocProp') !== null){
				  continue;//Skip these, do them below
			  }

			  if(form[i].required && form[i].value === ""){
				  var pop = $('#'+pageId+'RequiredPopup');
				  pop.empty();
				  pop.append($('<h1 />', {text : "The " + form[i].name + " field is required."}));
				  pop.popup("open");
				  return;
			  }

			  if(form[i].type === 'checkbox'){
				  merchant[form[i].name] = ( (form[i].value === 'on') ? true : false);
			  }
			  else{
				  merchant[form[i].name] = form[i].value;
				  if(form[i].value !== ""){//This field was actually filled out
					  formsFilled.push(form[i].name);
				  }
			  }
		  }

		  var pocForm = $('div[formType]');//Select all with a custom attribute defined in the template
		  var pocList = [];
		  for(var i = 0; i < pocForm.length; i++){
			  var inputs = $(':input',pocForm[i]);
			  var poc = {};
			  for(var j = 0; j < inputs.length; j++){
				  poc[inputs[j].getAttribute('pocProp')] = inputs[j].value;
			  }
			  pocList.push(poc);
		  }
		  merchant.DecisionMakers = pocList;

		  merchant.Notes = merchant.Notes.concat(notesToAdd);
		  merchant.Activities = merchant.Activities.concat(activitiesToAdd);
		  
		  if(newMerchant){
			  r.createMerchant(merchant);
			  r.merchantList.push(merchant);
		  }
		  else{
			  r.updateMerchant(merchant);
		  }

		  /*Create the activity*/
		  var end = new Date();
		  var editTime = end.getTime() - start.getTime();
		  var activity;

		  if(newMerchant){
			  activity = {'Type' : 'MerchantCreate',
					  'Date' : end,
					  UserName : r.getUserName(),
					  FormsFilled : formsFilled,
					  EditTime : editTime
			  }
		  }
		  else{
			  activity = {'Type' : 'MerchantEdit',
					  'Date' : end,
					  UserName : r.getUserName(),
					  FormsFilled : formsFilled,
					  EditTime : editTime
			  }
		  }
		  merchant.Activities.push(activity);

		  $.mobile.back();

	  });

	  content.trigger('create');
  };
  
  /* Makes a call to the geocode API to get the longitude and latitude from the address
   * Expects the longitude and latiude forms to write into and a properly formatted address
   * address should encode all spaces as +'s
   */
  r.fetchLngLat = function(lngObj, latObj, Address){
	  try{
		  RSKYBOX.log.info('entering', 'main.js.fetchLngLat');
		  var geocodeURL = "http://maps.googleapis.com/maps/api/geocode/json?address="+ Address;
		  geocodeURL += '&sensor=false';
		  $.ajax({
			  dataType : 'json',
			  url : geocodeURL,
			  type : "GET",
			  success : function(data){
				  if(data.results.length >= 1){
					  var res = data.results[0];
					  lngObj.val(res.geometry.location.lng);
					  latObj.val(res.geometry.location.lat);
				  }
				  
			  }
		  });
	  }
	  catch(e){
		  RSKYBOX.log.info(e, 'main.js.fetchLngLat');
	  }
  };
  
  r.readyAddress = function(street,city,state,zip){
	  try{
		  RSKYBOX.log.info('entering', 'main.js.readyAddress');
			var address = street.replace(/\s+/g, '+');//replace all white space with +
			address += ',+';
			address += city.replace(/\s+/g, '+');
			address += ',+';
			address += state.replace(/\s+/g, '+');
			address += ',+';
			address += zip.replace(/\s+/g, '+');
			return address;
	  }
	  catch(e){
		  RSKYBOX.log.info(e,'main.js.readyAddress');
	  }
  };
  
  /*Register handlers for the delete buttons for POC objects given prefix and index*/
  r.registerDelete = function(idPrefix, i){
		var del = $('#'+idPrefix + 'Delete' +i);
		del.bind('click', function(e){
			$('#pocForm'+i).remove();
		});
		$('#'+idPrefix + 'PocList').trigger('create');
  };
  
  /*returns a letter (a,b,c,d, or e) based on the status field of a merchant*/
  r.getStatusTheme = function(Status){
	  var key = MERCHANT.merchantDisplay[0].options;
	  if(Status === key[1])
		  return 'b';
	  if(Status === key[2])
		  return 'e';
	  if(Status === key[3])
		  return 'c';
	  if(Status === key[4])
		  return 'a';
	  return 'd';
  };

  r.setConfigurePage = function(merchants) {
      try{
	  RSKYBOX.log.info('entering','main.js.setConfigurePage');
	  
	  var configureMerchantListTemplate = _.template($('#ConfigureMerchantListTemplate').html());
	  var configureMerchantListHtml = "";
	  var nextMerchant;

	  for(var merIndex = 0; merIndex < merchants.length; merIndex++) {
	      nextMerchant = configureMerchantListTemplate(merchants[merIndex]);
	      nextMerchant = nextMerchant.replace("merchant_configSelect", "ConfigSelect" + merIndex);
	      configureMerchantListHtml += nextMerchant;
	  }

	  $('#ConfigureMerchantSelect').html(configureMerchantListHtml);

	  for(var merIndex = 0; merIndex < merchants.length; merIndex++) {
	      $('#' + 'ConfigSelect' + merIndex).attr('merNum',merIndex);
	      $('#' + 'ConfigSelect' + merIndex).click(function() {
		      var merIndex = $(this).attr('merNum');
		      $('#StartConfigure').attr("merchantId",merchants[merIndex].Id);
		      $('#StartConfigure>span').empty();
		      $('#StartConfigure>span').text("Start Configure: " + merchants[merIndex].Name);
		  });
	  }
	  
	  $('#StartConfigure').off();
	  $('#StartConfigure').click(function() {
		  var merchantId = $(this).attr('merchantId'); 
		  if(merchantId) {
		      r.getMerchantConfigurationInfo(merchantId);
		  }
	      });
	      
	  $('#ConfigureMerchantSelect').listview('refresh');
	  
      } catch (e) {
	  RSKYBOX.log.error(e, 'setConfigurePage');
      }
  };

  r.getMerchantConfigurationInfo = function(merchantID) {
      try{
	  RSKYBOX.log.info('entering','js.main.getMerchantConfigurationInfo');
	  
	  
	  var closeurl = devUrl + 'merchants/list';
	  var jsonobj = {"Config":true,
	                 "Id": merchantID};
	  
	  $.ajax({
		  type: 'search',
		      data: JSON.stringify(jsonobj),
		      datatype: 'json',
		      contentType: 'application/json',
		      url: closeurl,
		      statuscode: r.statusCodeHandlers(),
		      headers: {'Authorization' : r.getAuthorizationHeader()},
		      success: function(data, status, jqXHR) {
		      try {
			  if(r.merchantBeingConfigured)
			      r.clearExistingConfigureStepsPages();
			  r.merchantBeingConfigured = data.Results[0];
			  r.currentNumberOfSteps = r.merchantBeingConfigured.Configuration[0].Steps.length;
			  if(!r.numberOfConfigureStepsPages)
			      r.numberOfConfigureStepsPages = 0;
			  r.fixMerchantBeingConfigured();
			  r.getMerchantConfigurationNotes(r.merchantBeingConfigured.Id);
			  var jtest = 5;
		      } catch (e) {
			  RSKYBOX.log.error(e, 'getMerchantConfigurationInfo.success');
		      }
		  }
	      });
      } catch (e) {
	  RSKYBOX.log.error(e, 'getMerchantConfigurationInfo');
      }
  };

  //Check to make sure all configure fields are provided. If not, fill in with dummy or empty values
  r.fixMerchantBeingConfigured = function() {
      try{
	  RSKYBOX.log.info('entering','main.js.fixMerchantBeingConfigured');
	  
	  var confObj = r.merchantBeingConfigured.Configuration[0];
	  var confStep;
	  var confSubStep;

	  if(confObj.DateCompleted === undefined)
	      confObj.DateCompleted = null;

	  if(confObj.CurrentStep === undefined)
	      confObj.CurrentStep = 1;
	  
	  for(var stepIndex = 0; stepIndex < confObj.Steps.length; stepIndex++){
	      confStep = confObj.Steps[stepIndex];
	      
	      if(confStep.Title === undefined)
		  confStep.Title = "";
	      
	      if(confStep.Number === undefined)
		  confStep.Number = stepIndex + 1;

	      if(confStep.Instructions === undefined)
                  confStep.Instructions = "NO INSTRUCTIONS";

	      if(confStep.LastUpdated === undefined)
                  confStep.LastUpdated = null;

	      if(confStep.LastUpdatedBy === undefined)
                  confStep.LastUpdatedBy = "";

	      if(confStep.IsCompleted === undefined)
                  confStep.IsCompleted = false;

	      if(confStep.Screenshots === undefined)
                  confStep.Screenshots = [];

	      for(var ssIndex = 0; ssIndex < confStep.Screenshots.length; ssIndex++){
		  
		  if(confStep.Screenshots[ssIndex].Name === undefined)
		      ConfStep.Screenshots[ssIndex].Name = "";
		  
		  if(confStep.Screenshots[ssIndex].URL === undefined)
		      ConfStep.Screenshots[ssIndex].URL = "";
	      }

	      if(confStep.SubSteps === undefined)
                  confStep.SubSteps = [{}];

	      for(var subStepIndex = 0; subStepIndex < confStep.SubSteps.length; subStepIndex++) {
		  confSubStep = confStep.SubSteps[subStepIndex];

		  if(confSubStep.Number === undefined)
		      confSubStep.Number = subStepIndex + 1;

		  if(confSubStep.RequireInput === undefined){
		      if(confSubStep.Input === undefined)
			  confSubStep.RequireInput = "#NA";
		      else
			  confSubStep.RequireInput = false;
		  }
		  
		  if(confSubStep.Description === undefined)
                      confSubStep.Description = "NO DESCRIPTION";
		  
		  if(confSubStep.IsCompleted === undefined)
                      confSubStep.IsCompleted = false;

		  if(confSubStep.Input === undefined) {
		      if(confSubStep.RequireInput != "#NA")
			  confSubStep.Input = "";
		      else
			  confSubStep.Input = "#NA";
		  }  
	      }
	  }
      } catch (e) {
	  RSKYBOX.log.error(e,'fixMerchantBeingConfigured');
      }
  };

  r.clearExistingConfigureStepsPages = function() {
      try{
	  RSKYBOX.log.info('entering','main.js.removeExistingConfigureStepsPages');

	  var cSteps = r.merchantBeingConfigured.Configuration[0].Steps;
	  for(var stepIndex = 0; stepIndex < cSteps.length; stepIndex++){
	      $('#ConfigureStep_' + (stepIndex + 1)).remove();
	      r.numberOfConfigureStepsPages = 0;
	  }

      } catch (e) {
	  RSKYBOX.log.error(e,'removeExistingConfigureStepsPages');
      }
  };

  r.writeEmptyConfigureStepsPages = function() {
      try{
	  RSKYBOX.log.info('entering','main.js.writeEmptyConfigureStepsPages');
	  
	  var allStepsPagesEmptyHtml = "";
	  var currentStepEmpty;
	  var stepsLen = r.merchantBeingConfigured.Configuration[0].Steps.length;
	  
	  for(var stepIndex = 0; stepIndex < stepsLen; stepIndex++) {
	      if(stepIndex >= r.numberOfConfigureStepsPages) {
		  currentStepEmpty = '<div data-role="page" stepNumber="' + (stepIndex + 1) + '" id="ConfigureStep_' + (stepIndex + 1) + '"></div>';
		  r.numberOfConfigureStepsPages++;
		  allStepsPagesEmptyHtml += currentStepEmpty;
	      }
	  }
	  
	  if(allStepsPagesEmptyHtml)
	      $("#ConfigureStepsTemplate").before(allStepsPagesEmptyHtml);
	  
	  r.setConfigureStepsPages();
	  
      } catch (e) {
	  RSKYBOX.log.error(e,'writeEmptyConfigureStepsPages');
      }
  };
  
  r.getMerchantConfigurationNotes = function(merchantId) {
      try{
          RSKYBOX.log.info('entering','js.main.getMerchantConfigurationNotes');

          var closeurl = devUrl + 'merchants/notes/list';
          var jsonobj = {};

          $.ajax({
                  type: 'search',
                      data: JSON.stringify(jsonobj),
                      datatype: 'json',
                      contentType: 'application/json',
                      url: closeurl,
                      statuscode: r.statusCodeHandlers(),
                      headers: {'Authorization' : r.getAuthorizationHeader()},
                      success: function(data, status, jqXHR) {
                      try {
                          r.merchantNotes1 = data.Results;
			  r.writeEmptyConfigureStepsPages();
                          var goToStep = $('#ConfigureStep_' + r.merchantBeingConfigured.Configuration[0].CurrentStep);
                          $.mobile.changePage(goToStep);
			  
                          var jtest = 5;
                      } catch (e) {
                          RSKYBOX.log.error(e, 'getMerchantConfigurationNotes.success');
                      }
                  }
              });
      } catch (e) {
          RSKYBOX.log.error(e, 'getMerchantConfigurationNotes');
      }
      
  };

  r.insertConfigurationNotes = function(stepNumber) {
      try{
	  RSKYBOX.log.info('entering','main.js.insertConfigurationNotes');
	  
	  var configureInsertNoteTemplate = _.template($('#ConfigureInsertNoteTemplate').html());
	  var allNotesHtml = "";
	  var noteHtml;
	  var cNote;
	  
	  for(var noteIndex = 0; noteIndex < r.merchantNotes1.length; noteIndex++) {
	      cNote = r.merchantNotes1[noteIndex];
	      
	      if(cNote.Type = "NOTE_SALES") {
		  noteHtml = configureInsertNoteTemplate(cNote);
		  noteHtml = noteHtml.replace("ConfigureNote_Step_Id","ConfigureNote_" + stepNumber + "_" + cNote.Id);
		  allNotesHtml += noteHtml;
	      }
	  } 
	  
	  $('#ConfigurationInsertNotes_' + stepNumber).after(allNotesHtml);
   
      } catch(e) {
	  RSKYBOX.log.error(e,'insertConfigurationNotes');
      }
  };

	  
  r.setConfigureStepsPages = function() {
      try{
	  RSKYBOX.log.info('entering','main.js.setConfigureStepsPages');
	  
	  var configureSubStepsTemplate = _.template($('#ConfigureSubStepsTemplate').html());
	  var configureStepsTemplate = _.template($('#ConfigureStepsTemplate').html());

	  var nextSubStepAdded;
	  var nextStepAdded;

	  for(var stepIndex = 0; stepIndex < r.merchantBeingConfigured.Configuration[0].Steps.length; stepIndex++) {
	      
	      var subStepsHtml = "";
	      var cStep = r.merchantBeingConfigured.Configuration[0].Steps[stepIndex];
	      
	      for(var subStepIndex = 0; subStepIndex < cStep.SubSteps.length; subStepIndex++) {
		  
		  var cSubStep = cStep.SubSteps[subStepIndex];

		  nextSubStepAdded = configureSubStepsTemplate(cSubStep);
		  nextSubStepAdded = nextSubStepAdded.replace("ConfigureCheck_Step_SubStep", "ConfigureCheck_" + cStep.Number + "_" + cSubStep.Number);
		  if(cSubStep.Input != '#NA'){
		      nextSubStepAdded = nextSubStepAdded.replace("ConfigureInput_Step_SubStep", "ConfigureInput_" + cStep.Number + "_" + cSubStep.Number);
		  }
		  subStepsHtml += nextSubStepAdded;
	      }

	      //fix Screenshot URL Images/... -> images/...
	      for(var screenshotIndex = 0; screenshotIndex < cStep.Screenshots.length; screenshotIndex++) {
		  cStep.Screenshots[screenshotIndex].URL = cStep.Screenshots[screenshotIndex].URL.replace('/Images','images');
		  cStep.Screenshots[screenshotIndex].URL = cStep.Screenshots[screenshotIndex].URL.replace('JPG','png');
	      }
	      // --- 
	      
	      nextStepAdded = configureStepsTemplate(cStep);
	      nextStepAdded = nextStepAdded.replace("SUBSTEPS", subStepsHtml);
	      nextStepAdded = nextStepAdded.replace("ConfigureSubSteps_Step","ConfigureSubSteps_" + cStep.Number);
	      nextStepAdded = nextStepAdded.replace("ConfigureStepBack_Number","ConfigureStepBack_" + cStep.Number);
	      nextStepAdded = nextStepAdded.replace("ConfigureStepForward_Number","ConfigureStepForward_" + cStep.Number);
	      nextStepAdded = nextStepAdded.replace("ConfigurationNotesList_Step","ConfigurationNotesList_" + cStep.Number);
	      nextStepAdded = nextStepAdded.replace("ConfigurationInsertNotes_Step","ConfigurationInsertNotes_" + cStep.Number);
	      nextStepAdded = nextStepAdded.replace("ConfigurationNotesAdd_Step","ConfigurationNotesAdd_" + cStep.Number);
	      
	      $("#ConfigureStep_" + cStep.Number).append(nextStepAdded);
	      
	      r.insertConfigurationNotes(cStep.Number);
	  }
	  
	  //set the Check List up
	  $('#ConfigureCheckListContents').empty();
	  
	  var ConfigureListHtml = "";
	  var ConfigureListNextHtml;
	  var ConfigureCheckListContentTemplate = _.template($('#ConfigureCheckListContentTemplate').html());
	  
	  for(var stepIndex = 0; stepIndex < r.merchantBeingConfigured.Configuration[0].Steps.length; stepIndex++){
	      var cStep = r.merchantBeingConfigured.Configuration[0].Steps[stepIndex];
	      
	      for(var subStepIndex = 0; subStepIndex < cStep.SubSteps.length; subStepIndex++){
		  cSubStep = cStep.SubSteps[subStepIndex];
		  ConfigureListNextHtml = ConfigureCheckListContentTemplate(cSubStep);
		  ConfigureListNextHtml = ConfigureListNextHtml.replace('ConfigureListCheck_Step_SubStep','ConfigureListCheck_' + cStep.Number + '_' + cSubStep.Number);
		  if(cSubStep.Input != '#NA'){
		      ConfigureListNextHtml = ConfigureListNextHtml.replace('ConfigureListInput_Step_SubStep','ConfigureListInput_' + cStep.Number + '_' + cSubStep.Number);
		  }
		  ConfigureListHtml += ConfigureListNextHtml;
	      }
	  }

	  $('#ConfigureCheckListContents').append(ConfigureListHtml);
	  if(r.configureListExists){
	      $('#ConfigureCheckList').trigger('create');
	  }
	  r.configureListExists = true;
	  // --- 
	  
	  for(var stepIndex = 0; stepIndex < r.merchantBeingConfigured.Configuration[0].Steps.length; stepIndex++){
	      
	      cStep = r.merchantBeingConfigured.Configuration[0].Steps[stepIndex];
	      if(stepIndex == 0)
		  $("#ConfigureStepBack_" + cStep.Number).attr('href','#configure');  
	      else 
		  $("#ConfigureStepBack_" + cStep.Number).attr('href','#ConfigureStep_' + (cStep.Number - 1));

	      if(stepIndex == r.merchantBeingConfigured.Configuration[0].Steps.length - 1)
		  $("#ConfigureStepForward_" + cStep.Number).attr('href','#configure');
	      else
		  $("#ConfigureStepForward_" + cStep.Number).attr('href','#ConfigureStep_' + (cStep.Number + 1));
	      
	      for(var subStepIndex = 0; subStepIndex < cStep.SubSteps.length; subStepIndex++) {
		  
		  cSubStep = cStep.SubSteps[subStepIndex];
		  
		  //Set handlers on checkboxes
		  $("#ConfigureCheck_" + cStep.Number + "_" + cSubStep.Number).click(function() {
			  var step_substep_pattern = /\d+/g;
			  var checkBoxId = $(this).attr('id');
			  var step_substep = checkBoxId.match(step_substep_pattern);
			  var isChecked = $(this).prop('checked');
			  var cStep = r.merchantBeingConfigured.Configuration[0].Steps[step_substep[0] - 1];
			  var cSubStep = cStep.SubSteps[step_substep[1] - 1];
			  cSubStep.IsCompleted = isChecked;
			  r.setConfigureCheckBoxPair(cStep, cSubStep);
		      });
		  $("#ConfigureListCheck_" + cStep.Number + "_" + cSubStep.Number).click(function() {
                          var step_substep_pattern = /\d+/g;
                          var checkBoxId = $(this).attr('id');
                          var step_substep = checkBoxId.match(step_substep_pattern);
                          var isChecked = $(this).prop('checked');
			  var cStep = r.merchantBeingConfigured.Configuration[0].Steps[step_substep[0] - 1];
			  var cSubStep = cStep.SubSteps[step_substep[1] - 1];
			  cSubStep.IsCompleted = isChecked;
			  r.setConfigureCheckBoxPair(cStep, cSubStep);
                      });
		  // ---
	      
		  //Initialize checkboxes
		  if(cSubStep.IsCompleted){
		      $("#ConfigureCheck_" + cStep.Number + "_" + cSubStep.Number).prop('checked',true);
		      $("#ConfigureListCheck_" + cStep.Number + "_" + cSubStep.Number).prop('checked',true);
		  }
		  // ---
		  
		  //Initialize text Inputs
		  if(cSubStep.Input && cSubStep.Input != '#NA') {
		      if(cSubStep.IsCompleted){
			  $('#ConfigureInput_' + cStep.Number + '_' + cSubStep.Number).val(cSubStep.Input);
			  $('#ConfigureListInput_' + cStep.Number + '_' + cSubStep.Number).val(cSubStep.Input);
		      } else {
			  $('#ConfigureInput_' + cStep.Number + '_' + cSubStep.Number).attr('placeholder',cSubStep.Input);
			  $('#ConfigureListInput_' + cStep.Number + '_' + cSubStep.Number).attr('placeholder',cSubStep.Input);
		      }
		  }
		  // ---

		  //Set handlers for changes in Input
		  $('#ConfigureInput_' + cStep.Number + '_' + cSubStep.Number).change(function() {
			  var step_substep_pattern = /\d+/g;
                          var checkBoxId = $(this).attr('id');
                          var step_substep = checkBoxId.match(step_substep_pattern);
			  var cStep = r.merchantBeingConfigured.Configuration[0].Steps[step_substep[0] - 1];
                          var cSubStep = cStep.SubSteps[step_substep[1] - 1];
			  cSubStep.Input = $(this).val();
			  $('#ConfigureListInput_' + cStep.Number + '_' + cSubStep.Number).val(cSubStep.Input);
		      });
		  $('#ConfigureListInput_' + cStep.Number + '_' + cSubStep.Number).change(function() {
			  var step_substep_pattern = /\d+/g;
                          var checkBoxId = $(this).attr('id');
                          var step_substep = checkBoxId.match(step_substep_pattern);
                          var cStep = r.merchantBeingConfigured.Configuration[0].Steps[step_substep[0] - 1];
                          var cSubStep = cStep.SubSteps[step_substep[1] - 1];
                          cSubStep.Input = $(this).val();
                          $('#ConfigureInput_' + cStep.Number + '_' + cSubStep.Number).val(cSubStep.Input);
		      });
		  // ---
	      }
	  }
      } catch (e) {
	  RSKYBOX.log.error(e, 'setConfigureStepsPages');
      }
  };
  
  r.setConfigureCheckBoxPair = function(step,substep) {
      try{  
	  RSKYBOX.log.info('entering','main.js.setConfigureCheckBoxPair');
	  
	  if(substep.IsCompleted) {
	      var isChecked = true;
	  } else {
	      var isChecked = false;
	  }
	  $("#ConfigureCheck_" + step.Number + "_" + substep.Number).prop('checked',isChecked).checkboxradio('refresh');
	  $("#ConfigureListCheck_" + step.Number + "_" + substep.Number).prop('checked',isChecked).checkboxradio('refresh');
      } catch (e) {
	  RSKYBOX.log.error(e,'setConfigureCheckBoxPair');
      }
  };
  
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
      { '#home':                 { handler: 'homeHide',    events: 'h'   } },
      { '#editMerchant':         { handler: 'editMerchantShow',     events: 's'} },
      { '#editMerchant':         { handler: 'editMerchantHide',     events: 'h'} },
      { '#createNewMerchant':    { handler: 'createNewMerchantShow', events: 's' } },
      { '#createNewMerchant':    { handler: 'createNewMerchantHide', events: 'h' } },
      { '#merchantDisplay':		 { handler: 'merchantDisplayBeforeCreate',  events: 'bc'} },
      { '#merchantDisplay':      { handler: 'merchantDisplayShow',			events: 's' } },
      { '#merchantDisplay':      { handler: 'merchantDisplayHide',			events: 'h' } },
      { '#configure':            { handler: 'configureBeforeCreate',  events: 'bc'  } },
      { '#configure':            { handler: 'configureInit',    events: 'i'  } },
      { '#configure':            { handler: 'configureShow',    events: 's'   } }
    ], r.controller);
  } catch (e) {
    RSKYBOX.log.error(e, 'EXELON.main.router');
  }

  return r;
}(EXELON || {}, jQuery));
