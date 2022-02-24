
// Get current year
var d = new Date();
$('#year').text(d.getFullYear());

// GET CURRENT DATE WITH RAW JAVASCRIPT
var date = d.getUTCDate();
var month = d.getUTCMonth() + 1; // Since getMonth() returns month from 0-11 not 1-12
var year = d.getUTCFullYear();
 
$('#current-date').text(date + "/" + month + "/" + year);

// GET CURRENT DATE IN STRING FORMAT WITH moment.js
$('#today').text(moment().format('dddd, MMMM D, YYYY'));

// GET LIVE TIME WITH MOMENT.JS
function live_seconds() {
	$('#current-time').text(moment().format('hh:mm:ss A'));
}
setInterval(live_seconds, 1000);
