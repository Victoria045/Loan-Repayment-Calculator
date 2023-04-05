function calculateLoanRepayment() {
    //input and output elements looked up in the document
    let loanAmount = document.getElementById("amount");
    let apr = document.getElementById("apr");
    let years = document.getElementById("years");
    let payment = document.getElementById("payment");
    let total = document.getElementById("total");
    let totalinterest = document.getElementById("totalinterest");
    
  // Obtaining the user's input from the input elements.
  // Convert interestRatePerMonth from a percentage to a decimal, and convert from
  // an annual rate to a monthly rate. Convert payment period in years
  // to the number of monthly payments.
  let principal = parseFloat(loanAmount.value);
  let interestRatePerMonth = parseFloat(apr.value) / 100 / 12;
  let payments = parseFloat(years.value) * 12;
    
  // compute the monthly payment figure
  let x = Math.pow(1 + interestRatePerMonth, payments); //Math.pow computes powers
  let monthly = (principal*x*interestRatePerMonth)/(x-1);
  
  // Meaningful results to display if results is finite
  if (isFinite(monthly)){
    // Output fields, rounded to 2 decimal places
    payment.innerHTML = monthly.toFixed(2);
    total.innerHTML = (monthly * payments).toFixed(2);
    totalinterest.innerHTML = ((monthly*payments)-principal).toFixed(2);
  

   try { // Catch any errors in the elements
    getLenders(amount.value, apr.value, years.value);
   }
    
    catch(e) { /* And ignore these errors */ };
   }
   else {
   // Clear previously displayed output.
   payment.innerHTML = ""; // Erase the content of the elements
   total.innerHTML = ""
   totalinterest.innerHTML = "";
   }
  }

  // Attempt to restore input fields when the document first loads.
  window.onload = function() {
   if (window.localStorage && localStorage.loan_amount) {
   document.getElementById("amount").value = localStorage.loan_amount;
   document.getElementById("apr").value = localStorage.loan_apr;
   document.getElementById("years").value = localStorage.loan_years;
   }
  };
  // Passing the user's input to a server-side script
  function getLenders(loanAmount, apr, years) {
   if (!window.XMLHttpRequest) return;
   // Finding the element to display the list of lenders in
   var ad = document.getElementById("lenders");
   if (!ad) return; // Quit if no spot for output 
    
    // User's input encoded as query parameters in a URL
   var url = "getLenders.php" + // Service url plus
   "?amt=" + encodeURIComponent(loanAmount) + // user data in query string
   "&apr=" + encodeURIComponent(apr) +
   "&yrs=" + encodeURIComponent(years) ;

   // Contents of the URL fetched using the XMLHttpRequest object
   var req = new XMLHttpRequest(); // Begin a new request
   req.open("GET", url); // An HTTP GET request for the url
   req.send(null); // Request with no sent with no body
   // event handler function that will be called when the HTTP server's response arrives.
   req.onreadystatechange = function() {
   if (req.readyState == 4 && req.status == 200) {
   var response = req.responseText; // HTTP response as a string
   var lenders = JSON.parse(response); // Parse it to a JS array
   //Array of lender objects converted to a string of HTML
   var list = "";
   for(var i = 0; i < lenders.length; i++) {
   list += "<li><a href='" + lenders[i].url + "'>" +
   lenders[i].name + "</a>";
   }
   //Above HTML element displayed.
   ad.innerHTML = "<ul>" + list + "</ul>";
   }
   }
  }
