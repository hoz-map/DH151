// Global variables
let map;
let lat = 0;
let lon = 0;
let zl = 3;
// path to csv data
let toppath = "data/DH151_waste_Top 10.csv";
let bottompath = "data/DH151_waste_Bottom 10.csv";

// global variables
let topmarkers = L.featureGroup();
let bottommarkers = L.featureGroup();

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
    readCSV(toppath);
});

// function to read csv data
function readCSV(toppath){
	Papa.parse(toppath, {
		header: true,
		download: true,
		complete: function(data) {
			console.log(data);
			
			// map the data
			mapCSV(data);

		}
	});
}

function mapCSV(data){
	
    let circleOptions = {
        radius: 5,
        weight: 1,
        color: 'white',
        fillColor: 'red',
        fillOpacity: .5,
    }

	// loop through each entry
	data.data.forEach(function(item,index){
		// create marker (use Latitude instead of lat bc the console said Lantitude instead of lat)
		let topmarker = L.circleMarker([item.Latitude,item.Longitude], circleOptions)
        .on('mouseover', function(){
        		this.bindPopup(`<b>${item.Country}</b><p>${item.Waste_generation_rate_kg_person_day}kg/person/day</p>`).openPopup()
		})

		// add marker to featuregroup
		topmarkers.addLayer(topmarker)

	})

	// add featuregroup to map
	topmarkers.addTo(map)

	// fit markers to map
	map.fitBounds(topmarkers.getBounds())
};



// initialize
$( document ).ready(function() {
	createMap(lat,lon,zl);
    readCSV(bottompath);
});

// function to read csv data
function readCSV(bottompath){
	Papa.parse(bottompath, {
		header: true,
		download: true,
		complete: function(data) {
			console.log(data);
			
			// map the data
			mapCSV(data);

		}
	});
}

function mapCSV(data){
	
    let circleOptions = {
        radius: 5,
        weight: 1,
        color: 'white',
        fillColor: 'green',
        fillOpacity: .5,
    }

	// loop through each entry
	data.data.forEach(function(item,index){
		// create marker (use Latitude instead of lat bc the console said Lantitude instead of lat)
		let bottommarker = L.circleMarker([item.Latitude,item.Longitude], circleOptions)
        .on('mouseover', function(){
        		this.bindPopup(`<b>${item.Country}</b><p>${item.Waste_generation_rate_kg_person_day}kg/person/day</p>`).openPopup()
		})

		// add marker to featuregroup
		bottommarkers.addLayer(bottommarker)

	})

	// add featuregroup to map
	bottommarkers.addTo(map)

	// fit markers to map
	map.fitBounds(bottommarkers.getBounds())
}

