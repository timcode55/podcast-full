// POPULATE SELECTION BOXES WITH PODCAST CATEGORIES --!

const categoryArray = [
	{ id: 139, name: 'VR & AR', parent_id: 127 },
	{ id: 140, name: 'Web Design', parent_id: 127 },
	{ id: 142, name: 'English Learning', parent_id: 116 },
	{ id: 143, name: 'Programming', parent_id: 127 },
	{ id: 144, name: 'Personal Finance', parent_id: 67 },
	{ id: 115, name: 'Training', parent_id: 111 },
	{ id: 146, name: 'LGBTQ', parent_id: 122 },
	{ id: 195, name: 'Education for Kids', parent_id: 132 },
	{ id: 149, name: 'Venture Capital', parent_id: 93 },
	{ id: 138, name: 'Movie', parent_id: 68 },
	{ id: 150, name: 'Chinese History', parent_id: 125 },
	{ id: 151, name: 'Locally Focused', parent_id: 67 },
	{ id: 154, name: 'San Francisco Bay Area', parent_id: 152 },
	{ id: 155, name: 'Denver', parent_id: 152 },
	{ id: 157, name: 'Startup', parent_id: 93 },
	{ id: 158, name: 'NFL', parent_id: 78 },
	{ id: 159, name: 'Harry Potter', parent_id: 68 },
	{ id: 71, name: 'Islam', parent_id: 69 },
	{ id: 165, name: 'Storytelling', parent_id: 122 },
	{ id: 166, name: 'YouTube', parent_id: 68 },
	{ id: 83, name: 'Other Games', parent_id: 82 },
	{ id: 152, name: 'United States', parent_id: 151 },
	{ id: 160, name: 'Star Wars', parent_id: 68 },
	{ id: 163, name: 'AI & Data Science', parent_id: 127 },
	{ id: 78, name: 'Professional', parent_id: 77 },
	{ id: 79, name: 'Outdoor', parent_id: 77 },
	{ id: 80, name: 'College & High School', parent_id: 77 },
	{ id: 81, name: 'Amateur', parent_id: 77 },
	{ id: 90, name: 'Self-Help', parent_id: 88 },
	{ id: 109, name: 'Medicine', parent_id: 107 },
	{ id: 118, name: 'Local', parent_id: 117 },
	{ id: 136, name: 'Crypto & Blockchain', parent_id: 127 },
	{ id: 148, name: 'American History', parent_id: 125 },
	{ id: 162, name: 'Game of Thrones', parent_id: 68 },
	{ id: 156, name: 'China', parent_id: 151 },
	{ id: 147, name: 'SEO', parent_id: 173 },
	{ id: 177, name: 'Stand-Up', parent_id: 133 },
	{ id: 120, name: 'Regional', parent_id: 117 },
	{ id: 121, name: 'National', parent_id: 117 },
	{ id: 69, name: 'Religion & Spirituality', parent_id: 67 },
	{ id: 242, name: 'Physics', parent_id: 107 },
	{ id: 153, name: 'New York', parent_id: 152 },
	{ id: 137, name: 'NBA', parent_id: 78 },
	{ id: 167, name: 'Audio Drama', parent_id: 122 },
	{ id: 169, name: 'Sales', parent_id: 93 },
	{ id: 164, name: 'Apple', parent_id: 127 },
	{ id: 161, name: 'Star Trek', parent_id: 68 },
	{ id: 262, name: 'After Shows', parent_id: 68 },
	{ id: 217, name: 'Sports News', parent_id: 99 },
	{ id: 73, name: 'Judaism', parent_id: 69 },
	{ id: 219, name: 'Religion', parent_id: 69 },
	{ id: 122, name: 'Society & Culture', parent_id: 67 },
	{ id: 260, name: 'Wilderness', parent_id: 77 },
	{ id: 135, name: 'True Crime', parent_id: 67 },
	{ id: 74, name: 'Other', parent_id: 69 },
	{ id: 191, name: 'Mental Health', parent_id: 88 },
	{ id: 125, name: 'History', parent_id: 67 },
	{ id: 132, name: 'Kids & Family', parent_id: 67 },
	{ id: 70, name: 'Spirituality', parent_id: 69 },
	{ id: 249, name: 'Cricket', parent_id: 77 },
	{ id: 102, name: 'Food', parent_id: 100 },
	{ id: 94, name: 'Careers', parent_id: 93 },
	{ id: 98, name: 'Investing', parent_id: 93 },
	{ id: 181, name: 'Self-Improvement', parent_id: 111 },
	{ id: 91, name: 'Alternative Health', parent_id: 88 },
	{ id: 85, name: 'Video Games', parent_id: 82 },
	{ id: 244, name: 'Documentary', parent_id: 122 },
	{ id: 185, name: 'Science Fiction', parent_id: 168 },
	{ id: 200, name: 'Animation & Manga', parent_id: 82 },
	{ id: 131, name: 'Tech News', parent_id: 99 },
	{ id: 222, name: 'Chemistry', parent_id: 107 },
	{ id: 247, name: 'Baseball', parent_id: 77 },
	{ id: 248, name: 'Basketball', parent_id: 77 },
	{ id: 141, name: 'Golf', parent_id: 77 },
	{ id: 197, name: 'Pets & Animals', parent_id: 132 },
	{ id: 206, name: 'Home & Garden', parent_id: 82 },
	{ id: 124, name: 'Personal Journals', parent_id: 122 },
	{ id: 250, name: 'Fantasy Sports', parent_id: 77 },
	{ id: 112, name: 'Educational Technology', parent_id: 111 },
	{ id: 113, name: 'Higher Education', parent_id: 111 },
	{ id: 114, name: 'K-12', parent_id: 111 },
	{ id: 130, name: 'Gadgets', parent_id: 127 },
	{ id: 129, name: 'Podcasting', parent_id: 127 },
	{ id: 96, name: 'Shopping', parent_id: 93 },
	{ id: 87, name: 'Aviation', parent_id: 82 },
	{ id: 204, name: 'Games', parent_id: 82 },
	{ id: 86, name: 'Hobbies', parent_id: 82 },
	{ id: 134, name: 'Music', parent_id: 67 },
	{ id: 208, name: 'Music Commentary', parent_id: 134 },
	{ id: 209, name: 'Music History', parent_id: 134 },
	{ id: 210, name: 'Music Interviews', parent_id: 134 },
	{ id: 95, name: 'Business News', parent_id: 99 },
	{ id: 213, name: 'Daily News', parent_id: 99 },
	{ id: 214, name: 'Entertainment News', parent_id: 99 },
	{ id: 215, name: 'News Commentary', parent_id: 99 },
	{ id: 216, name: 'Politics', parent_id: 99 },
	{ id: 72, name: 'Buddhism', parent_id: 69 },
	{ id: 75, name: 'Christianity', parent_id: 69 },
	{ id: 76, name: 'Hinduism', parent_id: 69 },
	{ id: 107, name: 'Science', parent_id: 67 },
	{ id: 221, name: 'Astronomy', parent_id: 107 },
	{ id: 237, name: 'Earth Sciences', parent_id: 107 },
	{ id: 238, name: 'Life Sciences', parent_id: 107 },
	{ id: 239, name: 'Mathematics', parent_id: 107 },
	{ id: 110, name: 'Natural Sciences', parent_id: 107 },
	{ id: 241, name: 'Nature', parent_id: 107 },
	{ id: 108, name: 'Social Sciences', parent_id: 107 },
	{ id: 105, name: 'Design', parent_id: 100 },
	{ id: 126, name: 'Philosophy', parent_id: 122 },
	{ id: 123, name: 'Places & Travel', parent_id: 122 },
	{ id: 245, name: 'Relationships', parent_id: 122 },
	{ id: 77, name: 'Sports', parent_id: 67 },
	{ id: 251, name: 'Football', parent_id: 77 },
	{ id: 253, name: 'Hockey', parent_id: 77 },
	{ id: 254, name: 'Rugby', parent_id: 77 },
	{ id: 255, name: 'Running', parent_id: 77 },
	{ id: 256, name: 'Soccer', parent_id: 77 },
	{ id: 257, name: 'Swimming', parent_id: 77 },
	{ id: 258, name: 'Tennis', parent_id: 77 },
	{ id: 259, name: 'Volleyball', parent_id: 77 },
	{ id: 68, name: 'TV & Film', parent_id: 67 },
	{ id: 263, name: 'Film History', parent_id: 68 },
	{ id: 264, name: 'Film Interviews', parent_id: 68 },
	{ id: 265, name: 'Film Reviews', parent_id: 68 },
	{ id: 266, name: 'TV Reviews', parent_id: 68 },
	{ id: 127, name: 'Technology', parent_id: 67 },
	{ id: 261, name: 'Wrestling', parent_id: 77 },
	{ id: 67, name: 'Podcasts', parent_id: null },
	{ id: 100, name: 'Arts', parent_id: 67 },
	{ id: 104, name: 'Books', parent_id: 100 },
	{ id: 106, name: 'Fashion & Beauty', parent_id: 100 },
	{ id: 101, name: 'Performing Arts', parent_id: 100 },
	{ id: 103, name: 'Visual Arts', parent_id: 100 },
	{ id: 93, name: 'Business', parent_id: 67 },
	{ id: 171, name: 'Entrepreneurship', parent_id: 93 },
	{ id: 97, name: 'Management', parent_id: 93 },
	{ id: 173, name: 'Marketing', parent_id: 93 },
	{ id: 119, name: 'Non-Profit', parent_id: 93 },
	{ id: 133, name: 'Comedy', parent_id: 67 },
	{ id: 175, name: 'Comedy Interviews', parent_id: 133 },
	{ id: 176, name: 'Improv', parent_id: 133 },
	{ id: 111, name: 'Education', parent_id: 67 },
	{ id: 178, name: 'Courses', parent_id: 111 },
	{ id: 128, name: 'How To', parent_id: 111 },
	{ id: 116, name: 'Language Learning', parent_id: 111 },
	{ id: 168, name: 'Fiction', parent_id: 67 },
	{ id: 183, name: 'Comedy Fiction', parent_id: 168 },
	{ id: 184, name: 'Drama', parent_id: 168 },
	{ id: 117, name: 'Government', parent_id: 67 },
	{ id: 88, name: 'Health & Fitness', parent_id: 67 },
	{ id: 89, name: 'Fitness', parent_id: 88 },
	{ id: 192, name: 'Nutrition', parent_id: 88 },
	{ id: 92, name: 'Sexuality', parent_id: 88 },
	{ id: 145, name: 'Parenting', parent_id: 132 },
	{ id: 198, name: 'Stories for Kids', parent_id: 132 },
	{ id: 82, name: 'Leisure', parent_id: 67 },
	{ id: 84, name: 'Automotive', parent_id: 82 },
	{ id: 203, name: 'Crafts', parent_id: 82 },
	{ id: 99, name: 'News', parent_id: 67 }
];
let fullArray = [];
function getCategories() {
	let genreSelector = document.getElementById('selection');
	let genreSelector2 = document.getElementById('selection2');

	let array = [];
	let array2 = [];

	// CREATE FULL ARRAY OF CATEGORIES AND SORT
	for (let i = 0; i < categoryArray.length; i++) {
		fullArray.push(categoryArray[i]);
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
	// console.log(fullArray);

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
			display.innerHTML = ``;
			loader.classList.remove('hidden');
			document.getElementById('right-arrow').style.visibility = 'hidden';
			document.getElementById('left-arrow').style.visibility = 'hidden';
			displayData(data);
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

let display = document.querySelector('.listen');
document.getElementById('right-arrow').style.visibility = 'hidden';
document.getElementById('left-arrow').style.visibility = 'hidden';
// let fullPodcastData;
let resultsArray = [];
async function displayData(data) {
	console.log(data, 'data in front end');
	const response = await fetch('/podcasts');
	const responseData = await response.json();
	console.log(responseData, 'response');

	//LOOP AND SEARCH FOR BACKEND DATA

	const dataArray = data.podcasts;
	for (let item of dataArray) {
		for (let pod of responseData) {
			if (pod.id === item.id) {
				console.log(pod, 'pod yeaaaaa');
				const {
					description,
					genre,
					image,
					itunes,
					listennotesurl,
					numberOfRatings,
					rating,
					title,
					website
				} = pod;
				let displayImage = document.createElement('img');
				displayImage.classList.add('display-image');
				let div = document.createElement('div');
				div.classList.add('div-style');
				displayImage.src = item[0];
				a = document.createElement('a');
				b = document.createElement('a');
				c = document.createElement('a');
				d = document.createElement('a');
				b.href = item[2];
				d.innerHTML = `<div class="podcontainer">
    <div class="image">
      <a href="${listennotesurl}" target="_blank"><img class="podimage" src="${image}" alt="pod1"></a>
    </div>
    <div class="podtitle">
      <h1>${title.substring(0, 52)}</h1>
    </div>
    <div class="desc">
      <p class="ptext">${description.substring(0, 200).replace(/(<([^>]+)>)/gi, '')}...</p>
    </div>
    <div class="podButtons">
      <div class="webButton">
      <a href=${website} target="_blank"><button>Website</button></a>
      </div>
      <div class="webButton">
      <a href=${itunes} target="_blank"><button>iTunes Link</button></a>
      </div>
    </div>
    <div class="contratings">
        <div class="footeritem">
          <img class="ratingimage" src="images/Hashtag-26-52px/icons8-hashtag-52.png" alt="ratingimage">
          <p class="ratingtext"># of Ratings</p>
          <p class="ratingtext">${numberOfRatings}</p>
        </div>
        <div class="footeritem">
          <img class="ratingimage" src="images/Star-24-48px/icons8-star-48.png" alt="ratingimage">
          <p class="ratingtext">iTunes Rating</p>
          <p class="ratingtext">${rating}</p>
        </div>
        </div>
      </div>`;
				div.appendChild(d);
				display.classList.add('block');
				display.appendChild(div);
				document.getElementById('right-arrow').style.visibility = 'visible';
				if (page > 1) {
					document.getElementById('left-arrow').style.visibility = 'visible';
				}
				let loader = document.getElementById('preloader');
				loader.classList.add('hidden');
			}
		}
	}
}

//GET FULL DATABASE OBJECT AND USE THAT

display.innerHTML = ``;
// let array = data.podcasts;
// let dbArray = responseData;

// for (let i = 0; i < resultsArray.length; i++) {
// const result = dbArray.id.find(array[i].id);
// console.log(result, 'result');

// for (let item of resultsArray) {
// 	let displayImage = document.createElement('img');
// 	displayImage.classList.add('display-image');
// 	let div = document.createElement('div');
// 	div.classList.add('div-style');
// 	displayImage.src = item[0];
// 	a = document.createElement('a');
// 	b = document.createElement('a');
// 	c = document.createElement('a');
// 	d = document.createElement('a');
// 	b.href = item[2];
// 	// c.innerHTML = `
// 	//     <a href="${item[1]}" target="_blank"><img class="img display-image" src=${item[0]}></a></img><br><div class ="toolTip">${item[3]
// 	// .substring(0, 800)
// 	// .replace(/(<([^>]+)>)/gi, '')}</div>`;
// 	d.innerHTML = `<div class="podcontainer">
//     <div class="image">
//       <a href="${item[1]}" target="_blank"><img class="podimage" src="${item[0]}" alt="pod1"></a>
//     </div>
//     <div class="podtitle">
//       <h1>${item[4].substring(0, 52)}</h1>
//     </div>
//     <div class="desc">
//       <p class="ptext">${item[3].substring(0, 200).replace(/(<([^>]+)>)/gi, '')}...</p>
//     </div>
//     <div class="podButtons">
//       <div class="webButton">
//       <a href=${item[2]} target="_blank"><button>Website</button></a>
//       </div>
//       <div class="webButton">
//       <a href=${item[7]} target="_blank"><button>iTunes Link</button></a>
//       </div>
//     </div>
//     <div class="contratings">
//         <div class="footeritem">
//           <img class="ratingimage" src="images/Hashtag-26-52px/icons8-hashtag-52.png" alt="ratingimage">
//           <p class="ratingtext"># of Ratings</p>
//           <p class="ratingtext">${item[6]}</p>
//         </div>
//         <div class="footeritem">
//           <img class="ratingimage" src="images/Star-24-48px/icons8-star-48.png" alt="ratingimage">
//           <p class="ratingtext">iTunes Rating</p>
//           <p class="ratingtext">${item[5]}</p>
//         </div>
//         </div>
//       </div>`;
// 	div.appendChild(d);
// 	display.classList.add('block');
// 	display.appendChild(div);
// 	document.getElementById('right-arrow').style.visibility = 'visible';
// 	if (page > 1) {
// 		document.getElementById('left-arrow').style.visibility = 'visible';
// 	}
// 	let loader = document.getElementById('preloader');
// 	loader.classList.add('hidden');
// }
// }

// ARROW FOR MORE RESULTS
let loader = document.getElementById('preloader');
let rightArrow = document.getElementById('right-arrow');
let leftArrow = document.getElementById('left-arrow');
let page = 1;

rightArrow.addEventListener('click', (e) => {
	loader.classList.remove('hidden');
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
