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
			console.log(data);
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
			console.log(fullArray);
			testing(fullArray);

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
// let genreIdArray = [];
// function getGenre() {
// 	let e = document.getElementById('selection');

// 	e.addEventListener('change', function() {
// 		let selectedGenre = e.options[e.selectedIndex].text;
// 		newerArray = [];
// 		let displayTitle = document.querySelector('.title');
// 		displayTitle.innerHTML = `TOP PODCASTS - ${selectedGenre.toUpperCase()}`;
// 		getGenreId(selectedGenre);
// 	});
// }
// getGenre();

// function getGenre2() {
// 	let e2 = document.getElementById('selection2');

// 	e2.addEventListener('change', function() {
// 		let selectedGenre = e2.options[e2.selectedIndex].text;
// 		newerArray = [];
// 		let displayTitle = document.querySelector('.title');
// 		displayTitle.innerHTML = `TOP PODCASTS - ${selectedGenre.toUpperCase()}`;
// 		getGenreId(selectedGenre);
// 	});
// }
// getGenre2();

// GET ALL GENRE CATEGORIES OF PODCASTS

// function getGenreId(selectedGenre) {
// 	fetch('https://listen-api.listennotes.com/api/v2/genres', {
// 		method: 'GET',
// 		headers: {
// 			'Content-Type': 'application/json',
// 			'X-ListenAPI-Key': '89c65a60479f48a18b39223f8f721ef1'
// 		},
// 		credentials: 'same-origin'
// 	}).then((response) => {
// 		response.json().then((data) => {
// 			console.log('data in getGenreId', data);
// 			let genreArray = data.genres;
// 			for (let i = 0; i < 4; i++) {
// 				let genreId = genreArray[i].id;
// 				genreIdArray.unshift(genreId);
// 				setTimeout(() => {
// 					// console.log(data.genres[i]);
// 					getTopPodcastsByGenre(genreId, (page = 1));
// 					if (i === 4) {
// 						loopDone();
// 					}
// 				}, i * 20000); // multiple i by 1000
// 			}
// 		});
// 	});
// }
// getGenreId();

// GET ALL TOP PODCASTS FOR SPECIFIC GENRE
function testing(array) {
	console.log('120', array);
	for (let i = 0; i < 4; i++) {
		let genreId = array[i].id;
		// array.unshift(genreId);
		setTimeout(() => {
			// console.log(data.genres[i]);
			getTopPodcastsByGenre(genreId, (page = 1));
			if (i === 4) {
				loopDone();
			}
		}, i * 90000); // multiple i by 1000
	}
}

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
		response.json().then(async (data) => {
			displayData(data);

			// SCRAPE DATA AND ADD TO DATABASE
			console.log('data going into scraping', data);
			const list = await getItunesLink(data);
			axios.post('/podcasts', { urls: list }).then(function(response) {
				console.log(response);
				response.config.data.urls = [];
			});
		});
	});
}
// getTopPodcastsByGenre();

// GET ITUNES LINK DATA
let newerArray = [];
async function getItunesLink(data) {
	// DISPLAY ITUNES LINKS ON DEFAULT MAIN PAGE
	// document.querySelectorAll('.div-style a.img-link').forEach((el, i) => {
	// 	el.href = newerArray[i];
	// });
	let array = data.podcasts;
	for (let i = 0; i < array.length; i++) {
		let iTunesId = array[i].itunes_id;
		// console.log(iTunesId);
		const testingData = await axios
			.get('/podcast_data?id=' + iTunesId)
			.then((response) => {
				// console.log(response);
				newerArray.push(response.data.results[0].trackViewUrl);
				// document.querySelectorAll('.rating-container button.button.red.info a')[i].href = 'www.google.com';
			})
			.catch((error) => {
				newerArray.push('https://podcasts.apple.com');
			});
	}
	// console.log(newerArray);
	// document.querySelectorAll('.rating-container button.button.red.info').forEach((el, i) => {
	// 	el.href = newerArray[i];
	// 	// getData(data);
	// });
	return newerArray;
}

let fullPodcastData;
async function displayData(data) {
	// for (let item of data) {
	// 	item.push({ test: 1 });
	// }

	// for (let j = 0; j < birdArray.length; j++) {
	// 	console.log(birdArray[j].podcasts[j].title);
	// }
	// console.log(ratingArray);
	// let ratingSubArray = [];
	const response = await fetch('/podcasts');
	fullPodcastData = fullPodcastData || (await response.json());
	// console.log(ratingData);
	let ratingData = fullPodcastData;
	console.log(data);
	for (let pod of data.podcasts) {
		// console.log(pod.website);

		for (let item of ratingData) {
			// console.log(item.url);
			// console.log(pod.title);
			let itemTitle = item.title;
			let podTitle = pod.title;

			if (itemTitle && podTitle) {
				let itemTrimTitle = itemTitle.trim();
				let itemPodTitle = podTitle.trim();
				if (itemTrimTitle === itemPodTitle) {
					// console.log(itemTrimTitle);
					// console.log(itemPodTitle);
					if (item.rating === undefined) {
						pod.newRating = 'N/A';
					} else {
						pod.newRating = item.rating;
					}
					pod.numberOfRatings = item.numberOfRatings || 'N/A';
					pod.url = item.url;
				}
			}
		}
	}

	let display = document.querySelector('.listen');
	display.innerHTML = ``;
	let array = data.podcasts;
	console.log(array);
	let resultsArray = [];
	// console.log(newerArray.length);

	// console.log(newerArray.length);
	for (let i = 0; i < array.length; i++) {
		resultsArray.push([
			array[i].image,
			array[i].listennotes_url,
			array[i].website,
			array[i].description,
			array[i].title,
			array[i].newRating,
			array[i].numberOfRatings,
			array[i].url
		]);
	}
	for (let item of resultsArray) {
		// console.log(item);
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
		// d = document.createElement('a');
		b.href = item[2];

		// console.log(ratingArray);
		a.setAttribute('target', '_blank');
		b.setAttribute('target', '_blank');
		// d.setAttribute('target', '_blank');
		a.classList = 'pod-infoLink';
		c.classList = 'img-link';
		c.setAttribute('id', `${item[4]}`);
		a.innerHTML = `
    <div class="rating-container"><button class="rating-overlay button red">${item[5]}</button><button class="number-ratings button red"># of ratings ${item[6]}</button><button class="button red info"><a href="${item[7]}"target="_blank">Podcast Info</button></a></div>`;
		b.innerHTML = `
          <button class="button red webLink">Website</button>`;
		c.innerHTML = `
          <a href="${item[1]}" target="_blank"><img class="img display-image" src=${item[0]}></a></img><br><div class ="toolTip">${item[3]
			.substring(0, 800)
			.replace(/(<([^>]+)>)/gi, '')}</div>`;

		// d.innerHTML = `<button class="button test"><a href=""target="_blank">Podcast Test</button></a>`;
		// console.log(item[3]);
		div.appendChild(c);
		div.appendChild(a);
		div.appendChild(b);
		// div.appendChild(d);
		display.classList.add('block');
		display.appendChild(div);
		// getData(data);
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

// Right after paste
