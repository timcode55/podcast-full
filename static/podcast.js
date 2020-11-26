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
		response.json().then(async (data) => {
			console.log('133 data', data);
			console.log('newRating', data.podcasts[0].newRating);
			displayData(data);

			// SCRAPE DATA AND ADD TO DATABASE
			// const list = await getItunesLink(data);
			// axios.post('/podcasts', { urls: list }).then(function(response) {
			// 	// console.log(response);
			// });
		});
	});
}
getTopPodcastsByGenre();

// GET ITUNES LINK DATA
let newerArray = [];
async function getItunesLink(data) {
	let array = data.podcasts;
	for (let i = 0; i < array.length; i++) {
		let iTunesId = array[i].itunes_id;
		const testingData = await axios
			.get('/podcast_data?id=' + iTunesId)
			.then((response) => {
				newerArray.push(response.data.results[0].trackViewUrl);
			})
			.catch((error) => {
				newerArray.push('https://podcasts.apple.com');
				console.log(error);
			});
	}
	return newerArray;
}

let fullPodcastData;
async function displayData(data) {
	const response = await fetch('/podcasts');
	fullPodcastData = fullPodcastData || (await response.json());
	let ratingData = fullPodcastData;
	for (let pod of data.podcasts) {
		for (let item of ratingData) {
			let itemTitle = item.title;
			let podTitle = pod.title;

			if (itemTitle && podTitle) {
				let itemTrimTitle = itemTitle.trim();
				let itemPodTitle = podTitle.trim();
				if (itemTrimTitle === itemPodTitle) {
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
	let resultsArray = [];
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
		d = document.createElement('a');
		b.href = item[2];
		// c.innerHTML = `
		//     <a href="${item[1]}" target="_blank"><img class="img display-image" src=${item[0]}></a></img><br><div class ="toolTip">${item[3]
		// .substring(0, 800)
		// .replace(/(<([^>]+)>)/gi, '')}</div>`;
		d.innerHTML = `<div class="podcontainer">
    <div class="image">
      <a href="${item[1]}" target="_blank"><img class="podimage" src="${item[0]}" alt="pod1"></a>
    </div>
    <div class="podtitle">
      <h1>${item[4].substring(0, 52)}</h1>
    </div>
    <div class="desc">
      <p class="ptext">${item[3].substring(0, 200).replace(/(<([^>]+)>)/gi, '')}...</p>
    </div>
    <div class="podButtons">
      <div class="webButton">
      <a href=${item[2]} target="_blank"><button>Website</button></a>
      </div>
      <div class="webButton">
      <a href=${item[7]} target="_blank"><button>iTunes Link</button></a>
      </div>
    </div>
    <div class="contratings">
        <div class="footeritem">
          <img class="ratingimage" src="images/Hashtag-26-52px/icons8-hashtag-52.png" alt="ratingimage">
          <p class="ratingtext"># of Ratings</p>
          <p class="ratingtext">${item[6]}</p>
        </div>
        <div class="footeritem">
          <img class="ratingimage" src="images/Star-24-48px/icons8-star-48.png" alt="ratingimage">
          <p class="ratingtext">iTunes Rating</p>
          <p class="ratingtext">${item[5]}</p>
        </div>
        </div>
      </div>`;
		div.appendChild(d);
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
	getTopPodcastsByGenre(genreId, (page += 1));
	document.getElementById('left-arrow').style.visibility = 'visible';
	setTimeout(function() {
		document.body.scrollTop = document.documentElement.scrollTop = 0;
	}, 500);
});
leftArrow.addEventListener('click', (e) => {
	let genreId = genreIdArray[0];
	getTopPodcastsByGenre(genreId, (page -= 1));
	setTimeout(function() {
		document.body.scrollTop = document.documentElement.scrollTop = 0;
	}, 500);
});
