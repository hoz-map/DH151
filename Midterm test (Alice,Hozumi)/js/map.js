// Global variables
let map;
let lat = 0;
let lon = 0;
let zl = 2;
// path to csv data
let path = "data/usa-world-plastic-20161718.csv";
let toppath = "data/DH151_Waste3Top.csv";
// global variables
let exportmarkers2016 = L.featureGroup();
let importmarkers2016 = L.featureGroup();

let exportmarkers2017 = L.featureGroup();
let importmarkers2017 = L.featureGroup();

/*let exportmarkers2018 = L.featureGroup();
let importmarkers2018 = L.featureGroup();*/

let topmarkers = L.featureGroup();

// initialize
$( document ).ready(function() {
    createMap(lat,lon,zl);
	readCSV(path);
    //possible issues; check here
    readCSV(toppath,topmarkers);
});

// create the empty map
function createMap(lat,lon,zl){
	map = L.map('map').setView([lat,lon], zl);

	L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
		attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
	}).addTo(map);
}

function readCSV(path,featuregroup){
	Papa.parse(path, {
		header: true,
		download: true,
		complete: function(data) {
			console.log(data);

			// map the data
			mapCSV(data, featuregroup);
		}
	});
} 
/*
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
*/
/*
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
*/

function mapCSV(data,featuregroup/*,featuregroup,color*/){
	//design for circles of points of export
    let circleOptionsExport = {
        radius: 15,
        weight: 1,
        color: "green",
        fillColor: "green",
        fillOpacity: 0.1, 
    }

    //design for circles of points of import
	let circleOptionsImport = {
		radius: 15,
		weight: 1,
		color: "red",
		fillColor: null,
		fillOpacity: 0.1,
	}
    // design for top 15% circkes	
    let circleOptionsTOP = {
        radius: 5,
        weight: 1,
        color: 'white',
        fillColor: "orange", // use the argument for color here
        fillOpacity: .5,
    }

    data.data.forEach(function(item,index){

		if (item["Trade Flow"] === "Export" || item["Trade Flow"] === "Re-Export"){
            if (item.Year === "2016"){
                circleOptionsExport.radius = item["Netweight (kg)"] * 0.0000001

                let exportmarker = L.circleMarker([item.exportLat,item.exportLong], circleOptionsExport)
                .on('mouseover',
                    function(index){
                    this.bindPopup(`${item.Reporter + " " + item["Trade Flow"] + "ed " + item["Netweight (kg)"] + " kg of plastic waste to " + item.Partner + " in " + item.Year}`).openPopup();
                })
                exportmarkers2016.addLayer(exportmarker)
    
                let importmarker = L.circleMarker([item.importLat, item.importLong], circleOptionsImport)
                .on('mouseover', function(index){
                    this.bindPopup(`${item.Partner + " imported " + item["Netweight (kg)"] + " kg of plastic waste from " + item.Reporter + " in " + item.Year}`).openPopup()
                })
                importmarkers2016.addLayer(importmarker);
            }
            if (item.Year === "2017"){
                circleOptionsExport.radius = item["Netweight (kg)"] * 0.0000001

                let exportmarker = L.circleMarker([item.exportLat,item.exportLong], circleOptionsExport)
                .on('mouseover',
                    function(index){
                    this.bindPopup(`${item.Reporter + " " + item["Trade Flow"] + "ed " + item["Netweight (kg)"] + " kg of plastic waste to " + item.Partner + " in " + item.Year}`).openPopup();
                })
                exportmarkers2017.addLayer(exportmarker)
    
                let importmarker = L.circleMarker([item.importLat, item.importLong], circleOptionsImport)
                .on('mouseover', function(index){
                    this.bindPopup(`${item.Partner + " imported " + item["Netweight (kg)"] + " kg of plastic waste from " + item.Reporter + " in " + item.Year}`).openPopup()
                })
                importmarkers2017.addLayer(importmarker);
            }

            /*if (item.Year === "2018"){
                circleOptionsExport.radius = item["Netweight (kg)"] * 0.0000001

                let exportmarker = L.circleMarker([item.exportLat,item.exportLong], circleOptionsExport)
                .on('mouseover',
                    function(index){
                    this.bindPopup(`${item.Reporter + " " + item["Trade Flow"] + "ed " + item["Netweight (kg)"] + " kg of plastic waste to " + item.Partner + " in " + item.Year}`).openPopup();
                })
                exportmarkers2018.addLayer(exportmarker)
    
                let importmarker = L.circleMarker([item.importLat, item.importLong], circleOptionsImport)
                .on('mouseover', function(index){
                    this.bindPopup(`${item.Partner + " imported " + item["Netweight (kg)"] + " kg of plastic waste from " + item.Reporter + " in " + item.Year}`).openPopup()
                })
                importmarkers2018.addLayer(importmarker);
            }*/
		}
		else {
            if(item.Year === "2016"){
                circleOptionsImport.radius = item["Netweight (kg)"] * 0.0000001
                circleOptionsImport.fillColor= "red"
                let importmarker = L.circleMarker([item.exportLat,item.exportLong], circleOptionsImport)
                .on('mouseover',function(){
                    this.bindPopup(`${item.Reporter + " " + item["Trade Flow"] + "ed " + item["Netweight (kg)"] + " kg of plastic waste from " + item.Partner}`).openPopup()
                })
                importmarkers2016.addLayer(importmarker)
            }

            if (item.Year === "2017"){
                circleOptionsImport.radius = item["Netweight (kg)"] * 0.0000001
                circleOptionsImport.fillColor= "red"
                let importmarker = L.circleMarker([item.exportLat,item.exportLong], circleOptionsImport)
                .on('mouseover',function(){
                    this.bindPopup(`${item.Reporter + " " + item["Trade Flow"] + "ed " + item["Netweight (kg)"] + " kg of plastic waste from " + item.Partner}`).openPopup()
                })
                importmarkers2017.addLayer(importmarker)
            }

            /*if (item.Year === "2018"){
                circleOptionsImport.radius = item["Netweight (kg)"] * 0.0000001
                circleOptionsImport.fillColor= "red"
                let importmarker = L.circleMarker([item.exportLat,item.exportLong], circleOptionsImport)
                .on('mouseover',function(){
                    this.bindPopup(`${item.Reporter + " " + item["Trade Flow"] + "ed " + item["Netweight (kg)"] + " kg of plastic waste from " + item.Partner}`).openPopup()
                })
                importmarkers2018.addLayer(importmarker)
            }*/
		}

    //top 15% countries
        circleOptionsTOP.radius = item.Mismanaged_plastic_waste * 50

		// create marker (use Latitude instead of lat bc the console said Lantitude instead of lat)
		let topmarker = L.circleMarker([item.Latitude,item.Longitude], circleOptionsTOP)
        .on('mouseover', function(){
        		this.bindPopup(`<b>${item.Country}</b><p>${item.Mismanaged_plastic_waste}kg/person/day</p>`).openPopup()
		})

		// add marker to featuregroup
		// featuregroup is now an argument, so no need to hard  it here
		featuregroup.addLayer(topmarker)
		
		

	// add featuregroup of markers to map
		importmarkers2016.addTo(map)
		exportmarkers2016.addTo(map)

        importmarkers2017.addTo(map)
		exportmarkers2017.addTo(map)

        /*importmarkers2018.addTo(map)
		exportmarkers2018.addTo(map)*/

        featuregroup.addTo(map)
	})

	let addedlayers = {
        "2016 Exports": exportmarkers2016,
        "2016 Imports": importmarkers2016,

        "2017 Exports": exportmarkers2017,
        "2017 Imports": importmarkers2017,

        /*"2018 Exports": exportmarkers2018,
        "2018 Imports": importmarkers2018,*/

        "Top 15% Mismanaged Plastic": featuregroup,
    }


// add layer control box. "null" is for basemap. layers, i.e., is defined above
L.control.layers(null,addedlayers).addTo(map);

	// fit markers to map so that the map goes to the fitted markers
	map.fitBounds(importmarkers2016.getBounds())
}