var MERCHANT = (function($){
	/*propNames correspond with the merchant object returned by calls to Merchant Create API*/
	return {merchantDisplay : [
	      { propName: "Status",                displayText: "Merchant Status",                    inputType: "option",   required:true, options: ["Potential", "In Talks", "Configuration", "Ready", "Active"]},
		  { propName: "AcceptTerms",           displayText: "Accepted the terms and conditions?", inputType: "checkbox", required:true},
		  { propName: "EIN",                   displayText: "Company Employer ID Number",         inputType: "text",     required:true},
		  { propName: "Street",                displayText: "Street Address",                     inputType: "text",     required:true},
		  { propName: "City",                  displayText: "City",                               inputType: "text",     required:true},
		  { propName: "State",                 displayText: "State",                              inputType: "text",     required:true},
		  { propName: "ZipCode",               displayText: "Zip Code",                           inputType: "text",     required:true},
		  { propName: "Name",                  displayText: "Company Name",                       inputType: "text",     required:true},
		  { propName: "PaymentAccepted",       displayText: "Credit Card Types Accepted",         inputType: "text",     required:true},
		  { propName: "TypeId",                displayText: "Merchant Classification",            inputType: "text",     required:true},
		  { propName: "POS",                   displayText: "POS Type",                           inputType: "select",   required:false, options: ["POS_MICROS", "POS_ISIS", "POS_ALOHA"]},
		  { propName: "eMail",                 displayText: "Email",                              inputType: "text",     required:true},
		  { propName: "TwitterHandler",        displayText: "Twitter Handler",                    inputType: "text",     required:false},
		  { propName: "FacebookHandler",       displayText: "Facebook Handler",                   inputType: "text",     required:false},
		  { propName: "Website",               displayText: "Website",                            inputType: "text",     required:false},
		  { propName: "PriceLevel",            displayText: "Price Level",                        inputType: "option",   required:false, options: ["LOW", "MEDIUM", "HIGH"]},
		  { propName: "NumTables",             displayText: "Number of Tables",                   inputType: "text",     required:false},
		  { propName: "NumSeats",              displayText: "Number of Seats",                    inputType: "text",     required:false},
		  { propName: "DecisionMakers",         displayText: "Decision Maker",                     inputType: "special",  required:false},
		  { propName: "TypeOfService",         displayText: "Type of Service",                    inputType: "option",   required:false, options: ["Sit Down", "Take Out"]},
		  { propName: "CurrentCreditRate",     displayText: "Current Credit Rate",                inputType: "text",     required:false},
		  { propName: "CurrentCreditFee",      displayText: "Current Credit Fee",                 inputType: "text",     required:false},
		  { propName: "Comments",			   displayText: "Comments",							  inputType: "text",	 required:false}
                            ],
                            
			decisionMaker : [
		  { propName: "FirstName",             displayText: "First Name",                         inputType: "text",     required:true },
		  { propName: "LastName",              displayText: "Last Name",                          inputType: "text",     required:true },
		  { propName: "Phone",                 displayText: "Phone Number",                       inputType: "text",     required:true },
		  { propName: "Position",              displayText: "Position",                           inputType: "text",     required:true },
		  { propName: "eMail",                 displayText: "Email Address",                      inputType: "text",     required:true }
	                        ]
	};
}(jQuery));