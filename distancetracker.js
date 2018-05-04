var inputZipCode = "";
var standardZipCode = "3039ek";
var myDistances = [];
var table;
var i;

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

				myDistances[counter].innerHTML = apiResponse.routes[0].legs[0].distance.text;
				counter++;
			}
			else {
				console.log("Error");
			}
		});
	}


}

function initMap() {
	var directionsService = new google.maps.DirectionsService;
	var directionsDisplay = new google.maps.DirectionsRenderer;
	var map = new google.maps.Map(document.getElementById('map'), {
		zoom: 7,
		center: { lat: 41.85, lng: -87.65 }
	});
	directionsDisplay.setMap(map);

	var onChangeHandler = function () {
		calculateAndDisplayRoute(directionsService, directionsDisplay);
	};
	document.getElementById('start').addEventListener('change', onChangeHandler);
	document.getElementById('end').addEventListener('change', onChangeHandler);
}



document.getElementById("file-select").onchange = function () {

	input = document.getElementById("file-select");

	var file = input.files[0];
	var reader = new FileReader();


	reader.onload = function (progressEvent) {
		var returnArray = this.result.split("\n");
		returnArray.splice(returnArray.length - 1, 1)

		var i;
		var j;
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