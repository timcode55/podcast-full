// POPULATE SELECTION BOXES WITH PODCAST CATEGORIES --!

function getCategories() {
	fetch('https://listen-api.listennotes.com/api/v2/genres', {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json',
			'X-ListenAPI-Key': '89c65a60479f48a18b39223f8f721ef1'
		},
		credentials: 'same-origin'
	}).then((response) => {
		response.json().then((data) => {
			let genreSelector = document.getElementById('selection');
			let genreSelector2 = document.getElementById('selection2');
			let fullArray = [];
			let array = [];
			let array2 = [];

			// CREATE FULL ARRAY OF CATEGORIES AND SORT
			for (let i = 0; i < data.genres.length; i++) {
				fullArray.push(data.genres[i]);
			}
			fullArray.sort(function(a, b) {
				if (a.name < b.name) {
					return -1;
				}
				if (a.name > b.name) {
					return 1;
				}
				return 0;
			});

			// DIVIDE FULL ARRAY INTO SELECTION BOX 1
			for (let i = 0; i < 82; i++) {
				array.push(fullArray[i]);
			}
			for (let i = 82; i < fullArray.length; i++) {
				array2.push(fullArray[i]);
			}
			array.forEach((item) => {
				const option = new Option(item.name, item.name);
				genreSelector.add(option, undefined);
			});

			// DIVIDE FULL ARRAY INTO SELECTION BOX 2

			array2.forEach((el) => {
				const option2 = new Option(el.name, el.name);
				genreSelector2.add(option2, undefined);
			});
		});
	});
}

getCategories();

// EVENT LISTENER FOR CHANGE IN SELECTION BOX CATEGORY
let genreIdArray = [];
function getGenre() {
	let e = document.getElementById('selection');

	e.addEventListener('change', function() {
		let selectedGenre = e.options[e.selectedIndex].text;
		newerArray = [];
		let displayTitle = document.querySelector('.title');
		displayTitle.innerHTML = `TOP PODCASTS - ${selectedGenre.toUpperCase()}`;
		getGenreId(selectedGenre);
	});
}
getGenre();

function getGenre2() {
	let e2 = document.getElementById('selection2');

	e2.addEventListener('change', function() {
		let selectedGenre = e2.options[e2.selectedIndex].text;
		newerArray = [];
		let displayTitle = document.querySelector('.title');
		displayTitle.innerHTML = `TOP PODCASTS - ${selectedGenre.toUpperCase()}`;
		getGenreId(selectedGenre);
	});
}
getGenre2();

// GET ALL GENRE CATEGORIES OF PODCASTS

function getGenreId(selectedGenre) {
	fetch('https://listen-api.listennotes.com/api/v2/genres', {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json',
			'X-ListenAPI-Key': '89c65a60479f48a18b39223f8f721ef1'
		},
		credentials: 'same-origin'
	}).then((response) => {
		response.json().then((data) => {
			let genreArray = data.genres;
			for (let i = 0; i < genreArray.length; i++) {
				if (genreArray[i].name === selectedGenre) {
					let genreId = genreArray[i].id;
					genreIdArray.unshift(genreId);

					getTopPodcastsByGenre(genreId, (page = 1));
				}
			}
		});
	});
}
getGenreId();

// GET ALL TOP PODCASTS FOR SPECIFIC GENRE

function getTopPodcastsByGenre(genreId, page) {
	if (page === 1) {
		document.getElementById('left-arrow').style.visibility = 'hidden';
	}
	fetch(
		'https://listen-api.listennotes.com/api/v2/best_podcasts?genre_id=' +
			genreId +
			'&page=' +
			page +
			'&region=us&safe_mode=0',
		{
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				'X-ListenAPI-Key': '89c65a60479f48a18b39223f8f721ef1'
			},
			credentials: 'same-origin'
		}
	).then((response) => {
		response.json().then((data) => {
			displayData(data);
			getItunesLink(data);
		});
	});
}
getTopPodcastsByGenre();

// GET ITUNES LINK DATA
let newerArray = [];
async function getItunesLink(data) {
	// DISPLAY ITUNES LINKS ON DEFAULT MAIN PAGE
	document.querySelectorAll('.div-style a.img-link').forEach((el, i) => {
		el.href = newerArray[i];
	});
	let array = data.podcasts;
	for (let i = 0; i < array.length; i++) {
		let iTunesId = array[i].itunes_id;
		console.log(iTunesId);
		const testingData = await axios
			.get('http://localhost:4000/podcast_data?id=' + iTunesId)
			.then((response) => {
				newerArray.push(response.data.results[0].trackViewUrl);
			})
			.catch((error) => {
				newerArray.push('');
			});
	}
	document.querySelectorAll('.div-style a.pod-infoLink').forEach((el, i) => {
		el.href = newerArray[i];
	});
}

function displayData(data) {
	let display = document.querySelector('.listen');
	display.innerHTML = ``;
	let array = data.podcasts;
	let resultsArray = [];

	console.log(newerArray);
	for (let i = 0; i < array.length; i++) {
		resultsArray.push([ array[i].image, array[i].listennotes_url, array[i].website, array[i].description ]);
	}
	for (let item of resultsArray) {
		let displayImage = document.createElement('img');
		// let toolTip = document.createElement('div');
		displayImage.classList.add('display-image');
		// toolTip.classList.add('toolTip');
		let div = document.createElement('div');
		div.classList.add('div-style');
		displayImage.src = item[0];
		// toolTip.src = item[3];
		a = document.createElement('a');
		b = document.createElement('a');
		c = document.createElement('a');
		b.href = item[2];
		a.classList = 'pod-infoLink';
		c.classList = 'img-link';
		a.innerHTML = `
          <button class="button red info">Podcast Info</button>`;
		b.innerHTML = `
          <button class="button red webLink">Website</button>`;
		c.innerHTML = `
          <img class="img display-image" src=${item[0]}></img><br><div class ="toolTip">${item[3]
			.substring(0, 800)
			.replace(/(<([^>]+)>)/gi, '')}</div>`;
		// console.log(item[3]);
		div.appendChild(c);
		div.appendChild(a);
		div.appendChild(b);
		display.classList.add('block');
		display.appendChild(div);
	}
}

// ARROW FOR MORE RESULTS

let rightArrow = document.getElementById('right-arrow');
let leftArrow = document.getElementById('left-arrow');
let page = 1;

rightArrow.addEventListener('click', (e) => {
	newerArray = [];
	let genreId = genreIdArray[0];
	// console.log(genreId);

	getTopPodcastsByGenre(genreId, (page += 1));
	document.getElementById('left-arrow').style.visibility = 'visible';
	setTimeout(function() {
		document.body.scrollTop = document.documentElement.scrollTop = 0;
	}, 500);
	// console.log(page);
});
leftArrow.addEventListener('click', (e) => {
	let genreId = genreIdArray[0];
	getTopPodcastsByGenre(genreId, (page -= 1));
	setTimeout(function() {
		document.body.scrollTop = document.documentElement.scrollTop = 0;
	}, 500);
});