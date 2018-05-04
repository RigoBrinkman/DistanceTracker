var inputZipCode = "";
var standardZipCode = "3039ek";
var myDistances = [];
var sortableDistances = [];
var table;


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
		console.log(JSON.parse(localStorage.getItem("inputData"))[1][0]);
		table = document.getElementById("results");
		var row;
		var cell
		for (i in returnArray) {
			row = table.insertRow(-1);
			for (j in returnArray[i]) {
				cell = row.insertCell(-1);
				cell.innerHTML = returnArray[i][j];
			}

			myDistances[i] = row.insertCell(-1);
		}
	}
	var data = reader.readAsText(file);

}

calculate();

function calculate() {
	var srcLink = "https://maps.googleapis.com/maps/api/staticmap?key=AIzaSyCmhQzDCLErPCgSsp7p6PX4Uz7gWzqLijo&size=1000x200&scale=2&markers=";
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
	var directionsService = new google.maps.DirectionsService();
	var directionsRequest;
	var apiResponse;
	var counter = 0;
	for (i = 0; i < table.rows.length; i++) {

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
				//				sortableDistances[counter] = apiResponse.routes[0].legs[0].distance.value;
				sortTableRows(table, counter);
				counter++;
			}
			else {
				console.log("Error");
			}
		});
	}
	//	row.insertBefore();


}

function sortTableRows(table, rowNo) {
	var switched = false;
	for (i = rowNo; i <= rowNo; i++) {
		if (i == 0) {
			console.log("Done")
			return;
		}
		if (parseFloat(table.rows[i].cells[4].innerHTML) < parseFloat(table.rows[i - 1].cells[4].innerHTML)) {
			console.log("switching row " + i + " and " + (i - 1));
			table.rows[i].parentNode.insertBefore(table.rows[i], table.rows[i - 1]);
			i -= 2;
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