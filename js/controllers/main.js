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
          // token is valid, no need to log in, re-route to the selectMerchant screen
          ui.toPage = $('#selectMerchant');
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
    
    // selectMerchant Screen
    selectMerchantBeforeCreate: function () {
      try {
        RSKYBOX.log.info('entering', 'main.js.selectMerchantBeforeCreate');
        r.attachPanel("selectMerchant");
        
        $("#selectMerchantSearch").bind('click', function(e){
        	$("#selectMerchantList").prev("form.ui-listview-filter").toggle();
        });
        
        var content =  $("#selectMerchantContent");
        
       content.on("tap", ".editButton", function(e){
        	var index = $(this).attr("index");
        	r.merchantToEdit = r.merchantList[index];
        	$.mobile.changePage("#editMerchant", {transition : "slide"});
        });
        
        content.on("tap", ".selectButton", function(e){
        	var index = $(this).attr("index");
        	r.activeMerchant = r.merchantList[index];
        	$.mobile.changePage("#merchantDisplay", {transition:"slide"});
        });
        
        content.on("tap", ".backButton", function(e){
        	var index = $(this).attr("index");
      	    $("#selectMerchantListSwipeMenuElm"+index).hide();
        	$("#selectMerchantListElm"+index).show();
        });
        /*put in the elements from the 'current customer' object*/
      } catch (e) {
        RSKYBOX.log.error(e, 'main.js.selectMerchantBeforeCreate');
      }
    },

    selectMerchantInit: function () {
      try {
        RSKYBOX.log.info('entering', 'main.js.selectMerchantInit');
        $("#selectMerchantList").prev("form.ui-listview-filter").hide();
      } catch (e) {
        RSKYBOX.log.error(e, 'main.js.selectMerchantInit');
      }
    },

    selectMerchantShow: function () {
      try {
        RSKYBOX.log.info('entering', 'main.js.selectMerchantShow');
        
        if(!r.merchantList)
        	r.getMerchants();
        else
        	r.writeMerchantList($('#selectMerchantList'), r.merchantList);
      } catch (e) {
        RSKYBOX.log.error(e, 'main.js.selectMerchantShow');
      }
    },
    
    selectMerchantHide: function(){
    	try{
    		RSKYBOX.log.info('entering', 'main.js.selectMerchantHide');
    		$('#selectMerchantList').empty();
    	}
    	catch(e){
    		RSKYBOX.log.error(e, 'main.js.selectMerchantHide');
    	}
    },
    
    editMerchantBeforeCreate : function(){
    	try{
    		RSKYBOX.log.info('entering', 'main.js.editMerchantBeforeCreate');
    		
    		$('#editMerchantContent').bind("swiperight", function(e){
    			$.mobile.back();
    		});
    	}
    	catch(e){
    		RSKYBOX.log.error(e, 'main.js.editMerchantBeforeCreate');
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
    
    createNewMerchantBeforeCreate : function(){
    	try{
    		RSKYBOX.log.info('entering', 'main.js.createNewMerchantBeforeCreate');
    		
    		$('#createNewMerchantContent').bind("swiperight", function(e){
    			$.mobile.back();
    		});
    	}
    	catch(e){
    		RSKYBOX.log.error(e, 'main.js.createNewMerchantBeforeCreate');
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
    		$(".collapsedListItem").each(function(){
    			$(this).hide();
    		});
    		
    		$("#displayMerchantInfoCollapse").bind("tap", function(e){
    			$(".collapsedListItem").each(function(){
    				$(this).toggle();
    			});
    			
    			var li = $('#merchantDisplayBasicInfo')
    			if($(this).attr("status") === "up"){
    				$(this).attr("status", "down");
    				li.buttonMarkup({icon:"arrow-d"})
    			}
    			else{
    				$(this).attr("status", "up");
    				li.buttonMarkup({icon:"arrow-u"});
    			}

    		});

    		$('#merchantDisplayAddNote').bind("click", function(e){
    			$('#merchantDisplayAddNoteBox').toggle();
    		});

    		$('#merchantDisplayAddNoteSave').bind('click', function(e){
    			var textArea = $('#merchantDisplayNoteText');
    			
    			if(textArea.prop('value') === ""){
    				return; //No need to save empty notes
    			}
    			
    			var newNote = {  Type : "SALES_NOTE",
    							 LastUpdatedBy : r.getUserName(),
    							 LastUpdated : new Date(),
    							 Note : textArea.prop('value') };
    			r.activeMerchant.Notes.push(newNote);
    			textArea.prop('value', "");
    			$('#merchantDisplayAddNoteBox').hide();

    			/*Update the displays on this page*/
    			var NoteTemplate = _.template($('#NoteDisplayTemplate').html())
    			var notesDisplay = $('#merchantDisplayNotesDisplay');
    			notesDisplay.prepend(NoteTemplate(newNote));
    			notesDisplay.listview('refresh');

    		});

    		$('#merchantDisplayAddNoteCancel').bind('click', function(e){
    			$('#merchantDisplayNoteText').prop('value', "");
    			$('#merchantDisplayAddNoteBox').hide();
    		});

    		$("#merchantDisplayStatusSpecific").bind('swiperight', function(){
    			/*A long if/elif chain based on the different statuses*/
    			$.mobile.changePage("#configure", {transition:"slide"});
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

  r.refreshselectMerchant = function() {
      try {
        RSKYBOX.log.info('entering', 'main.js.refreshselectMerchant');

        $.mobile.showPageLoadingMsg();
      } catch (e) {
        RSKYBOX.log.error(e, 'main.js.refreshselectMerchant');
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
  
  $(document).on('click', '.geoLocation', function(){
		try {
			navigator.geolocation.getCurrentPosition(r.displayGeoLocation, function(){alert("geo error")});
			return false;
    } catch (e) {
      RSKYBOX.log.error(e, 'main.js.click.logOut');
    }
  });

  r.displayGeoLocation = function(position) {
    try {
      RSKYBOX.log.info('entering', 'main.js.displayGeoLocation');
		  var message = "latitude: " + position.coords.latitude + ", longitude: " + position.coords.longitude;
			alert(message);
    } catch (e) {
      RSKYBOX.log.error(e, 'displayGeoLocation');
    }
  };

  $(document).on('click', '.selectMerchant', function(e){
		try {
			if($.mobile.activePage.is('#selectMerchant')) {
				$('#selectMerchant_leftPanel').panel("close");
			} else {
				$.mobile.changePage( "#selectMerchant", { transition: "slideup", changeHash: true });
			}
			return false;
    } catch (e) {
      RSKYBOX.log.error(e, 'main.js.click.selectMerchant');
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
                    	r.writeMerchantList($('#selectMerchantList'), r.merchantList);
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
		  
		  var merchantTemplate = _.template($('#selectMerchantTemplate').html());
		  
		  var templateData = {};
		  
		  for(var i = 0; i < merchantList.length; i++){
			  var m = merchantList[i];
			  templateData.Name = m.Name;
			  templateData.Status = m.Status;
			  templateData.Street = m.Street;
			  templateData.City = m.City;
			  templateData.State = m.State;
			  templateData.ZipCode = m.ZipCode;
			  templateData.index = i.toString();
			
			  location.append(merchantTemplate(templateData));
			
			  var merchantSelect = $('#selectMerchantList' + i);
			  //merchantSelect.bind('tap', r.merchantSelectTap);
			  merchantSelect.bind("tap", r.merchantSelectHorizontalSwipe);
			  merchantSelect.bind("swipeleft", r.merchantSelectHorizontalSwipe);
			  merchantSelect.bind("swiperight", r.merchantSelectHorizontalSwipe);	
		  }
		  
		  $('#selectMerchantContent').trigger('create');
		  location.listview('refresh');
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
		  $('#'+pageId+'PocList').prepend(pocTemplate({FirstName : "", LastName : "", 
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
			var newNote = {  Type : "NOTE_SALES",
							 LastUpdatedBy : r.getUserName(),
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

		  if(newMerchant){//If its new, take to merchant info screen
			  r.activeMerchant = merchant;
			  $.mobile.changepage("#merchantDisplay", {transition:"slide"});
		  }
		  else{//If not, take back to where ever the editing was triggered
			  $.mobile.back({transition:"slide"});
		  }

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
  };
  
  /*The event handler for selecting a merchant on the merchant select screen*/
  r.merchantSelectTap = function(){
	  var index = $(this).attr('index');
	  r.activeMerchant = r.merchantList[index];
	  $.mobile.changePage('#merchantDisplay', {changeHash:false, transition:"slide" } )
  };

  r.merchantSelectHorizontalSwipe = function(){
	  var index = $(this).attr('index');
	  $("#selectMerchantListElm"+index).hide();
	  $("#selectMerchantListSwipeMenuElm"+index).show();
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

  try {
    r.router = new $.mobile.Router([
      { '.*':                    { handler: 'setupSession',        events: 'bs'  } },
//      { '.*':                    { handler: 'flashCheck',        events: 's'   } },
      { '#login':                { handler: 'isLoggedIn',        events: 'bC', step: 'page' } },
      { '#login':                { handler: 'loginBeforeShow',   events: 'bs'  } },
      { '#login':                { handler: 'loginShow',         events: 's'   } },
      { '#selectMerchant':                 { handler: 'selectMerchantBeforeCreate',  events: 'bc'  } },
      { '#selectMerchant':                 { handler: 'selectMerchantInit',    events: 'i'  } },
      { '#selectMerchant':                 { handler: 'selectMerchantShow',    events: 's'   } },
      { '#selectMerchant':                 { handler: 'selectMerchantHide',    events: 'h'   } },
      { '#editMerchant':         { handler: 'editMerchantBeforeCreate',  events: 'bc' } },
      { '#editMerchant':         { handler: 'editMerchantShow',          events: 's'  } },
      { '#editMerchant':         { handler: 'editMerchantHide',          events: 'h'  } },
      { '#createNewMerchant':    { handler: 'createNewMerchantBeforeCreate', events: 'bc'} },
      { '#createNewMerchant':    { handler: 'createNewMerchantShow',         events: 's' } },
      { '#createNewMerchant':    { handler: 'createNewMerchantHide',         events: 'h' } },
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
