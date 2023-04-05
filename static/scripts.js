function calculateLoanRepayment() {
    //Look up the input and output elements in the document
    let loanAmount = document.getElementById("amount");
    let apr = document.getElementById("apr");
    let years = document.getElementById("years");
    let payment = document.getElementById("payment");
    let total = document.getElementById("total");
    let totalinterest = document.getElementById("totalinterest");
    
  // Get the user's input from the input elements.
  // Convert interest from a percentage to a decimal, and convert from
  // an annual rate to a monthly rate. Convert payment period in years
  // to the number of monthly payments.
  let principal = parseFloat(loanAmount.value);
  let interestRatePerMonth = parseFloat(apr.value) / 100 / 12;
  let payments = parseFloat(years.value) * 12;
    
  // compute the monthly payment figure
  let x = Math.pow(1 + interestRatePerMonth, payments); //Math.pow computes powers
  let monthly = (principal*x*interestRatePerMonth)/(x-1);
  
  // If the result is a finite number, the user's input was good and
  // we have meaningful results to display
  if (isFinite(monthly)){
    // Fill in the output fields, rounding to 2 decimal places
    payment.innerHTML = monthly.toFixed(2);
    total.innerHTML = (monthly * payments).toFixed(2);
    totalinterest.innerHTML = ((monthly*payments)-principal).toFixed(2);
  
  
   // Advertise: find and display local lenders, but ignore network errors
   try { // Catch any errors that occur within these curly braces
  //  getLenders(amount.value, apr.value, years.value, zipcode.value);
   }
    
    catch(e) { /* And ignore those errors */ }
   // Finally, chart loan balance, and interestRatePerMonth and equity payments
   chart(principal, nterestRatePerMonth, monthly, payments);
   }
   else {
   // Result was Not-a-Number or infinite, which means the input was
   // incomplete or invalid. Clear any previously displayed output.
   payment.innerHTML = ""; // Erase the content of these elements
   total.innerHTML = ""
   totalinterest.innerHTML = "";
   chart(); // With no arguments, clears the chart
   }
  }

  // Automatically attempt to restore input fields when the document first loads.
  window.onload = function() {
   // If the browser supports localStorage and we have some stored data
   if (window.localStorage && localStorage.loan_amount) {
   document.getElementById("amount").value = localStorage.loan_amount;
   document.getElementById("apr").value = localStorage.loan_apr;
   document.getElementById("years").value = localStorage.loan_years;
   }
  };
  // Pass the user's input to a server-side script which can (in theory) return
  // a list of links to local lenders interested in making loans. This example
  // does not actually include a working implementation of such a lender-finding
  // service. But if the service existed, this function would work with it.
  function getLenders(loanAmount, apr, years) {
   // If the browser does not support the XMLHttpRequest object, do nothing
   if (!window.XMLHttpRequest) return;
   // Find the element to display the list of lenders in
   var ad = document.getElementById("lenders");
   if (!ad) return; // Quit if no spot for output 
    
    // Encode the user's input as query parameters in a URL
   var url = "getLenders.php" + // Service url plus
   "?amt=" + encodeURIComponent(loanAmount) + // user data in query string
   "&apr=" + encodeURIComponent(apr) +
   "&yrs=" + encodeURIComponent(years) ;

   // Fetch the contents of that URL using the XMLHttpRequest object
   var req = new XMLHttpRequest(); // Begin a new request
   req.open("GET", url); // An HTTP GET request for the url
   req.send(null); // Send the request with no body
   // Before returning, register an event handler function that will be called
   // at some later time when the HTTP server's response arrives. This kind of
   // asynchronous programming is very common in client-side JavaScript.
   req.onreadystatechange = function() {
   if (req.readyState == 4 && req.status == 200) {
   // If we get here, we got a complete valid HTTP response
   var response = req.responseText; // HTTP response as a string
   var lenders = JSON.parse(response); // Parse it to a JS array
   // Convert the array of lender objects to a string of HTML
   var list = "";
   for(var i = 0; i < lenders.length; i++) {
   list += "<li><a href='" + lenders[i].url + "'>" +
   lenders[i].name + "</a>";
   }
   // Display the HTML in the element from above.
   ad.innerHTML = "<ul>" + list + "</ul>";
   }
   }
  }
