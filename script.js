const container = document.querySelector("main");
const popupBlock = document.querySelector(".popup-wrapper");
const popupUpd = document.querySelector(".popup-upd");
const addForm = document.forms.addForm;
const updForm = document.forms.updForm;
const cards = document.getElementsByClassName("card");

popupBlock.querySelector(".popup__close").addEventListener("click", function() {
	popupBlock.classList.remove("active");
});

const createCard = function(cat, parent) {
    const card = document.createElement("div");
    card.className = "card";

    const img= document.createElement("div");
    img.className = "card-pic";
    if (cat.img_link) {
    img.style.backgroundImage = `url(${cat.img_link}` ;
    } else {
        img.style.backgroundImage = "url(img/cat.png)";
        img.style.backgroundSize = "contain";
        img.style.backgroundColor = "transparent";
    }

    const name = document.createElement("h3");
    name.innerText = cat.name;

    
    const del = document.createElement("button");
	del.innerText = "delete";
	del.id = cat.id;
	del.addEventListener("click", function(e) {
		let id = e.target.id;
		deleteCat(id, card);
	});

	const upd = document.createElement("button");
	upd.innerText = "update";
	upd.addEventListener("click", function(e) {
		popupUpd.classList.add("active");
		popupBlock.classList.add("active");
		showForm(cat);
		updForm.setAttribute("data-id", cat.id);
	})

	card.append(img, name, del, upd);
	parent.append(card);
}


const showForm = function(data) {
	console.log(data);
	for (let i = 0; i < updForm.elements.length; i++) {
		let el = updForm.elements[i];
		if (el.name) {
			if (el.type !== "checkbox") {
				el.value = data[el.name] ? data[el.name] : "";
			} else {
				el.checked = data[el.name];
			}
		}
	}
}

// createCard({name: "Вася", img_link:"https://i.pinimg.com/originals/22/cc/3b/22cc3bfc1fede6e2306cac7265515aa3.jpg"}, container);



fetch("https://sb-cats.herokuapp.com/api/2/Alex-842/show")
.then(res => res.json())
.then(result => {console.log(result);
    if (result.message === "ok") {
        console.log(result.data);
        result.data.forEach(function(el) {
            createCard(el, container);
        })
    }
})

// const cat = {
//     id: 4,
//     name: "Василий",
//     img_link: "https://www.wallpaperflare.com/static/27/787/660/cat-muzzle-eyes-brown-wallpaper.jpg"
// }


const addCat = function(cat) {
	fetch("https://sb-cats.herokuapp.com/api/2/Alex-842/add", {
		method: "POST",
		headers: { // обязательно для POST/PUT/PATCH
			"Content-Type": "application/json"
		},
		body: JSON.stringify(cat) // обязательно для POST/PUT/PATCH
	})
		.then(res => res.json())
		.then(data => {
			console.log(data);
			if (data.message === "ok") {
				createCard(cat, container);
                addForm.reset();
			}
		})
}





document.querySelector("#add").addEventListener("click", function(e) {
	e.preventDefault();
	popupBlock.classList.add("active")
})


const deleteCat = async function(id, tag) {
	/*
		fetch(`https://sb-cats.herokuapp.com/api/2/Alex-842/delete/${id}`, {
			method: "DELETE"
		})
		.then(res => res.json())
		.then(data => {
			console.log(data);
			if (data.message === "ok") {
				tag.remove();
			}
		})
	*/
	let res = await fetch(`https://sb-cats.herokuapp.com/api/2/Alex-842/delete/${id}`, {
		method: "DELETE"
	});

	let data = await res.json();
	
	if (data.message === "ok") {
		tag.remove();
	}
}


addForm.addEventListener("submit", function(e) {
	e.preventDefault();
	let body = {}; 

	for (let i = 0; i < addForm.elements.length; i++) {
		let el = addForm.elements[i];
		console.log(el);
		if (el.name) {
			body[el.name] = el.name === "favourite" ? el.checked : el.value;
		}
	}

	console.log(body);
	addCat(body);
});

updForm.addEventListener("submit", function(e) {
	e.preventDefault();
	let body = {}; 

	for (let i = 0; i < this.elements.length; i++) {
		let el = this.elements[i];
		if (el.name) {
			body[el.name] = el.name === "favourite" ? el.checked : el.value;
		}
	}
	delete body.id;
	console.log(body);
	updCat(body, updForm.dataset.id);
});

const updCat = async function(obj, id) {
	let res = await fetch(`https://sb-cats.herokuapp.com/api/2/Alex-842/update/${id}`, {
		method: "PUT",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(obj)
	})
	let answer = await res.json();
	console.log(answer);
	if (answer.message === "ok") {
		updCard(obj, id);
		updForm.reset();
		updForm.dataset.id = "";
		popupUpd.classList.remove("active");
		popupBlock.classList.remove("active");
	}
}

const updCard = function(data, id) {
	for (let i = 0; i < cards.length; i++) {
		let card = cards[i];
		if (card.dataset.id === id) {
			card.firstElementChild.style.backgroundImage = data.img_link ? `url(${data.img_link})` : `url(img/cat.png)`;
			card.querySelector("h3").innerText = data.name || "noname";
		}
	}
}


// Вработе
// const infoBlock = document.querySelector(".info-block");

// const showInfo = function (data) {
//     infoBlock.classList.add("active");
//     infoBlock.firstElementChild.innerHTML = `
//         <img class="info-img" src="${data.img_link}" alt="${data.name}">
//         <div class="information">
//             <h2>${data.name}</h2>
//             <h3>${data.age} ${getWord(data.age, "год", "года", "лет")}</h3>
//             <p>${data.description}</p>
//         </div>
//         <div class="info-close" onclick="closeInfo()"></div>
//     `;
// }

// const closeInfo = function () {
//     infoBlock.classList.remove("active");
// }