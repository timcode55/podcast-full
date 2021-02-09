import categoriesArray from '../category-list';

let array1 = [];
let array2 = [];
// DIVIDE ARRAY INTO SELECTION BOX 1
for (let i = 0; i < 80; i++) {
	array1.push(categoriesArray[i]);
}
for (let i = 80; i < categoriesArray.length; i++) {
	array2.push(categoriesArray[i]);
}
// array.forEach((item) => {
// 	const option = new Option(item.name, item.name);
// 	genreSelector.add(option, undefined);
// });

// DIVIDE ARRAY INTO SELECTION BOX 2

// array2.forEach((el) => {
// 	const option2 = new Option(el.name, el.name);
// 	genreSelector2.add(option2, undefined);
// });

export { array1, array2 };
