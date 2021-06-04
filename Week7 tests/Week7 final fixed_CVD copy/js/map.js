// Global variables
let choromap;
let chorolat = 0;
let chorolon = 0;
let chorozl = 3;
let choropath = '';

let chorogeojsonPath = 'data/waste1.json'; //where the geojson file is located
let chorogeojson_data; //placeholder for data
let chorogeojson_layer; //placeholder for layer of geojson

let brew = new classyBrew();
let chorofieldtomap;

//legend box creation. extends leaflet, and place it in bottom right
let legend = L.control({position: 'bottomright'});

let info_panel = L.control(); //postion of panel is default to top right



// initialize
$( document ).ready(function() {
	createChoroMap(chorolat,chorolon,chorozl);
	getChoroGeoJSON();
});

// create the map
function createChoroMap(lat,lon,zl){
	choromap = L.map('choromap').setView([chorolat,chorolon], chorozl);

	var OpenStreetMap_HOT = L.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Tiles style by <a href="https://www.hotosm.org/" target="_blank">Humanitarian OpenStreetMap Team</a> hosted by <a href="https://openstreetmap.fr/" target="_blank">OpenStreetMap France</a>'

	}).addTo(choromap);
}

// function to get the geojson data
function getChoroGeoJSON(){

	$.getJSON(chorogeojsonPath,function(data){
		console.log(data)

		// put the data in a global variable
		chorogeojson_data = data;

		// call the map function
		mapChoroGeoJSON('Mismanaged_plastic_waste_2010_tonnes') // add a field to be used
	})
}

//calling this function with ANY FIELD will REDRAW the map to fit those parameters 
function mapChoroGeoJSON(field /*, num_class, etc....*/){

	// clear layers in case it has been mapped already
	if (chorogeojson_layer){
		chorogeojson_layer.clearLayers()
	}
	
	// globalize the field to map
	chorofieldtomap = field;

	// create an empty array
	let values = [];

	// based on the provided field, enter each value into the array
	chorogeojson_data.features.forEach(function(item,index){
		if(item.properties[field] != undefined){
			values.push(parseFloat(item.properties[field]))
		}
		//values.push(item.properties[field])
	})

	// set up the "brew" options
	brew.setSeries(values);
	brew.setNumClasses(9 /*num_class*/); //how many groups of colors there are 
	brew.setColorCode('YlGn');
	brew.classify('quantile'); //how the color groups are classiflied 

    // create the geojson layer
    chorogeojson_layer = L.geoJson(chorogeojson_data,{
        style: getChoroStyle,
        onEachFeature: onEachChoroFeature // actions on each feature
    }).addTo(choromap);

	choromap.fitBounds(chorogeojson_layer.getBounds())

    // create the legend. function is created towards bottom of code
	createChoroLegend();

    // create the infopanel
	createInfoPanel(); //(not create legend as in the lab)
}


function getChoroStyle(feature){
	return {
		stroke: true,
		color: 'white',
		weight: 1,
		fill: true,
		fillColor: brew.getColorInRange(feature.properties[chorofieldtomap]),
		fillOpacity: 0.8
	}
}


// return the color for each feature. called in getChoroStyle --> gets color from population estimate number from data 
/*function getColor(d) {
	return d > 1000000 ? '#800026' : // syntax: if value of d is greater than xxxxx, then make it xxx color.
		   d > 500000  ? '#BD0026' :
		   d > 100000  ? '#E31A1C' :
		   d > 50000  ? '#FC4E2A' :
		   d > 10000   ? '#FD8D3C' :
		   d > 5000   ? '#FEB24C' :
		   d > 1000   ? '#FED976' :
					  '#FFEDA0';
}*/

function createChoroLegend(){
	legend.onAdd = function (choromap) {
        //creates the html div that holds the info for legend
		var div = L.DomUtil.create('div', 'info legend'),
        //brew info that gets put into legend
		breaks = brew.getBreaks(),
		labels = [],
		from, to;
		
		for (var i = 0; i < breaks.length; i++) {
			from = breaks[i];
			to = breaks[i + 1];
			if(to) {
				labels.push(
                    //the numbers that are actually put into the legend
					'<i style="background:' + brew.getColorInRange(to) + '"></i> ' +
					from.toFixed(2) + ' &ndash; ' + to.toFixed(2));
				}
			}
			
			div.innerHTML = labels.join('<br>');
			return div;
		};
		
		legend.addTo(choromap);
}

// Function that defines what will happen on user interactions with each feature
function onEachChoroFeature(feature, layer) {
	layer.on({
		mouseover: highlightFeature,
		mouseout: resetHighlight,
		click: zoomToChoroFeature
	});
}

// on mouse over, highlight the feature
function highlightFeature(e) {
	var chorolayer = e.target;

	// style to use on mouse over
	chorolayer.setStyle({
		weight: 2,
		color: '#666',
		fillOpacity: 0.8
	});

	if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
		chorolayer.bringToFront();
	}
    //updates the infopanel
    info_panel.update(chorolayer.feature.properties)
}

// on mouse out, reset the style, otherwise, it will remain highlighted
function resetHighlight(e) {
	chorogeojson_layer.resetStyle(e.target);
    info_panel.update(); // resets infopanel when not highlighted, to default
}

// on mouse click on a feature, zoom in to it
function zoomToChoroFeature(e) {
	choromap.fitBounds(e.target.getBounds());
}

function createInfoPanel(){

	info_panel.onAdd = function (choromap) {
		this._div = L.DomUtil.create('div', 'choroinfo'); // create a div with a class "info"
		this.update();
		return this._div;
	};

	// method that we will use to update the control based on feature properties fed to it. 
    //whatever is highlighted, put that in the info panel.
	info_panel.update = function (properties) {
		// if feature is highlighted
		if(properties){
			this._div.innerHTML = `<b>${properties.name}</b><br>${chorofieldtomap}: ${properties[chorofieldtomap]}`;
		}
		// if feature is not highlighted:
        //but if nothing is highlighted, then panel will tell user to do something
		else
		{
			this._div.innerHTML = 'Hover over a country';
		}
	};

	info_panel.addTo(choromap);
}
