let cities = ['San Francisco','New York','Philadelphia','Tokyo','Los Angeles']

let data = [
		{
			'title':'Legions of Honor (San Francisco, US)',
			'lat': 37.784500,
			'lon': -122.500800,
			'description': 'This museum was my first US museum I visited. At the time, I was learning about ancient Greek art in my art history class, which was why I went to this museum for the ancient Greek art exhibition.', 
			'url': 'https://www.mercurynews.com/wp-content/uploads/2017/11/09klimt-gods4.jpg?w=1860'
		},
		{
			'title':'American Museum of Natural History (New York, US)',
			'lat': 40.781300,
			'lon': -73.974000,
			'description': 'It was my dream to visit this museum only because this museum featured in the film, Night at the Museum. Although there are a lot of sections where you can learn about animals and nature, this museum also displays ancient American art, which is one of my favorite arts.',
			'url': 'https://static01.nyt.com/images/2006/12/17/arts/17ande.1.600.jpg?quality=75&auto=webp&disable=upscale'
		},
		{
			'title':'Philadelphia Museum of Art (Philadelphia, US)',
			'lat': 39.965600,
			'lon': -75.181000,
			'description': 'This is my most favorite museum! I really enjoyed learning about Medieval and early Renaissance art across Europe. Not only were artifacts exceptional, but also the decorations of each room were detailed. I want to visit this museum again in the future.',
			'url': 'https://i.pinimg.com/originals/af/fc/94/affc94bea86070b87ee671d777746cb9.jpg'
		},
		{
			'title':'Los Angeles County Museum of Art (Los Angeles, US)',
			'lat': 34.063900,
			'lon': -118.359200,
			'description': 'Pop art is also one of my favorite arts, and this is why I wanted to visit here to see Andy Warhols paintings.',
			'url': 'https://live.staticflickr.com/5642/30500745093_5a80fa3722_b.jpg'
		},
		{
			'title':'National Museum of Nature and Science (Tokyo, Japan)',
			'lat': 35.716300,
			'lon': 139.776500,
			'description': 'This museum does many exhibitions from foreign museums. When I was small, my grandparents took me to this museum. One of my favorite exhibitions was about ancient Egypt. Since then, I have been interested in art history.',
			'url': 'https://resources.matcha-jp.com/archive_files/jp/2015/07/DSC00947-1024x680.jpg'
		}
];

var map = L.map('map').setView([35.716300,139.776500], 3);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
		attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
	}).addTo(map);


// create a feature group
let myMarkers = L.featureGroup();


// loop through cities
data.forEach(function(item,index){
		let marker = L.marker([item.lat,item.lon]).bindPopup('<b>' + item.title + '</b>' + ": " + '<br>' + item.description + "<br> <img src = '"+ item.url +"' width = '75%'>").openPopup();
		console.log('The latitude for ' + item.title + ' is ' + item.lat)

		myMarkers.addLayer(marker)


		$('.sidebar').append(`<div class="sidebar-item" onclick="flyToIndex(${index})">${item.title}</div>`)

	});

	myMarkers.addTo(map)


	// define layers
	let layers = {
		"My Favorite Museums": myMarkers
	}

	// add layer control box
	L.control.layers(null,layers).addTo(map)

	map.fitBounds(myMarkers.getBounds())


	function flyToIndex(index){
		map.flyTo([data[index].lat,data[index].lon],12)
		myMarkers.getLayers()[index].openPopup()

	

	}