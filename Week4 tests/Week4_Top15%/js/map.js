// Global variables
let map;
let lat = 0;
let lon = 0;
let zl = 3;
// path to csv data
let toppath = "data/DH151_Waste3Top.csv";

// global variables
let topmarkers = L.featureGroup();

// create the map
function createMap(lat,lon,zl){
	map = L.map('map').setView([lat,lon], zl);

	L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
		attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
	}).addTo(map);
}

// initialize
$( document ).ready(function() {
	createMap(lat,lon,zl);

	// readCSV now accepts 3 arguments
	// call it twice, once for each layer
    readCSV(toppath,topmarkers,'red');
});

// function to read csv data
// this now accepts arguments for path, the featuregroup variable, and the desired color for the circle
function readCSV(path,featuregroup,color){
	Papa.parse(path, {
		header: true,
		download: true,
		complete: function(data) {
			console.log(data);
			
			// map the data
			// need to feed this 3 arguments as well
			mapCSV(data,featuregroup,color);

		}
	});
}

// this has also been modified to accept three arguments
function mapCSV(data,featuregroup,color){
	
    let circleOptions = {
        radius: 5,
        weight: 1,
        color: 'white',
        fillColor: color, // use the argument for color here
        fillOpacity: .5,
    }

	// loop through each entry
	data.data.forEach(function(item,index){

		circleOptions.radius = item.Mismanaged_plastic_waste * 50

		// create marker (use Latitude instead of lat bc the console said Lantitude instead of lat)
		let topmarker = L.circleMarker([item.Latitude,item.Longitude], circleOptions)
        .on('mouseover', function(){
        		this.bindPopup(`<b>${item.Country}</b><p>${item.Mismanaged_plastic_waste}kg/person/day</p>`).openPopup()
		})

		// add marker to featuregroup
		// featuregroup is now an argument, so no need to hard code it here
		featuregroup.addLayer(topmarker)
		

	})

	// add featuregroup to map
	featuregroup.addTo(map)

	// fit markers to map
	map.fitBounds(featuregroup.getBounds())
}