function calculate(destination){
	var data = readCsv();
	outputTable(destination, data);
}

function readCsv(){
	var output;
$.ajax({
    url: "data1.csv",
    async: false,
    success: function (csvd) {
        output = $.csv.toArrays(csvd);
    },
    dataType: "text",
    complete: function () {
        // call a function on complete 
    }
});}


function outputTable(destination, data){
	var table = document.getElementById(destination);
	var row = table.insertRow(0);
	var cell1 = row.insertCell(0);
	var cell2 = row.insertCell(1);
	cell1.innerHTML =  "AAA";
	cell2.innerHTML =  "VVV";

}