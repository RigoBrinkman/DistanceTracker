var inputZipCode = "";
var standardZipCode = "3034CV";
var myDistances = [];
var sortableDistances = [];
var table;
var distancesAreSet;


document.getElementById("file-select").onchange = function () {

	input = document.getElementById("file-select");

	var file = input.files[0];
	var reader = new FileReader();


	reader.onload = function (progressEvent) {
		var returnArray = this.result.split("\n");
		returnArray.splice(returnArray.length - 1, 1)

		for (i in returnArray) {
			returnArray[i] = returnArray[i].split("\t");
		}

		localStorage.setItem("inputData", JSON.stringify(returnArray));
		console.log(JSON.parse(localStorage.getItem("inputData")));
		table = document.getElementById("results");
		var row;
		var cell
		for (i in returnArray) {
			row = table.insertRow(-1);
			for (j in returnArray[i]) {
				cell = row.insertCell(-1);
				if(i == 0){
					cell.innerHTML = returnArray[i][j].bold();
				}else{
					cell.innerHTML = returnArray[i][j];
				}
			}

			myDistances[i] = row.insertCell(-1);
		}
	}
	var data = reader.readAsText(file);

}

calculate();

function calculate() {
	var srcLink = "https://maps.googleapis.com/maps/api/staticmap?key=AIzaSyCmhQzDCLErPCgSsp7p6PX4Uz7gWzqLijo&size=512x150&scale=2&markers=";
	inputZipCode = document.getElementById("dest-zip").value;
	if (inputZipCode === "") {
		srcLink += standardZipCode;
	} else {
		srcLink += inputZipCode;
		processDistances(inputZipCode);
	}
	document.getElementById("map-img").src = srcLink;

}

function processDistances(input) {
	if(distancesAreSet){
		for(i in myDistances){
			myDistances[i].innerHTML = null;
		}
	}
	distancesAreSet = true;
	var directionsService = new google.maps.DirectionsService();
	var directionsRequest;
	var apiResponse;
	var counter = 1;
	table.rows[0].cells[4].innerHTML = "Distance".bold();
	for (i = 1; i < table.rows.length; i++) {

		directionsRequest = {
			origin: table.rows[i].cells[3].innerHTML,
			destination: input,
			travelMode: google.maps.DirectionsTravelMode.DRIVING,
			unitSystem: google.maps.UnitSystem.METRIC,
		};

		directionsService.route(directionsRequest, function (response, status) {
			if (status == google.maps.DirectionsStatus.OK) {
				apiResponse = response;

				table.rows[counter].cells[4].innerHTML = apiResponse.routes[0].legs[0].distance.text;
				sortTableRows(table, counter);
				counter++;
				console.log(apiResponse);
				
				document.getElementById("showingDistanceTo").innerHTML = "Showing distance to:&nbsp";
				document.getElementById("showingDistanceTo").append(apiResponse.routes[0].legs[0].end_address);
				
			}
			else {
				console.log("Error");
			}
		});
	}


}

function sortTableRows(table, rowNo) {
	var switched = false;
	for (i = rowNo; i > 1; i--) {
		if (parseFloat(table.rows[i].cells[4].innerHTML) < parseFloat(table.rows[i - 1].cells[4].innerHTML)) {
			console.log("switching row " + i + " and " + (i - 1));
			table.rows[i].parentNode.insertBefore(table.rows[i], table.rows[i - 1]);
		}else{
			break;
		}
	}
}

function filterTable() {
	var hideThisRow;
	for (i = 0; i < table.rows.length; i++) {
		hideThisRow = true;
		for (j = 0; j < table.rows[i].cells.length; j++) {
			if (table.rows[i].cells[j].innerHTML.toLowerCase().includes(document.getElementById("filter-field").value.toLowerCase())) {
				hideThisRow = false;
				console.log("KEEP");
			}
		}
		if (hideThisRow) {
			table.rows[i].style.display = 'none';
		} else {
			table.rows[i].style.display = '';
		}
	}
}