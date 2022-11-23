const container = document.querySelector("main");
const popupBlock = document.querySelector(".popup-wrapper");
const addForm = document.forms.addForm;

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
    card.append(img, name, del);
    parent.append(card);
}


const del = document.createElement("button");
	del.innerText = "delete";
    del.id = cat.id;
    del.addEventListener("click", function(e) {
    let id = e.target.id;
		deleteCat(id, card);
	});



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