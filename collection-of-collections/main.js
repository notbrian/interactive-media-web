// Make an array with only the first 5 trends
const trends = data[0].trends.slice(0, 5);
const today = document.querySelector("#trends-active");

// Populates the today div with trends
for (let i = 0; i < trends.length; i++) {
  const trendData = trends[i];
  //   const div = document.createElement("div");
  //   div.classList = "trend";
  //   const p = document.createElement("p");
  //   p.innerText = `${i + 1}.  ${trendData.name}`;
  //   const a = document.createElement("a");
  //   a.href = trendData.url;
  //   a.innerText = "Link to trend";

  //   div.append(p, a);
  //   today.append(div);

  today.innerHTML += `
  <div class="trend">
  <p>${i + 1}.  ${trendData.name}</p>
  <a href="${trendData.url}">Link to trend</a>
  </div>`;
}

// Sets the div to be scrolled on the August 14th trending tweets (for mobile)

const mainDiv = document.querySelector("#main");
mainDiv.scrollLeft = mainDiv.scrollWidth / 3;

// Code to setup gallery

let galleryElements = [];
let galleryIndex = 1;
let galleryIndexMax;

// Sets up variables for gallery

function setupGallery() {
  const galleryChildren = document.querySelector("#main").children;
  for (let index = 0; index < galleryChildren.length; index++) {
    galleryElements.push(galleryChildren[index]);
  }
  galleryIndexMax = galleryChildren.length - 1;
}

setupGallery();

// Function that animates the gallery

function animateGallery() {
  for (let index = 0; index < galleryElements.length; index++) {
    // Logic flow to set correct classes on elements
    if (index === galleryIndex - 1) {
      galleryElements[index].id = "trends-offLeft";
    }

    if (index === galleryIndex) {
      galleryElements[index].id = "trends-active";
    }

    if (index === galleryIndex + 1) {
      galleryElements[index].id = "trends-offRight";
    }
  }

  // Fades buttons when you're at the end of the gallery

  if (galleryIndex === galleryIndexMax) {
    document
      .querySelector(".galleryButton-right")
      .classList.add("galleryButton-faded");
  } else {
    document
      .querySelector(".galleryButton-right")
      .classList.remove("galleryButton-faded");
  }

  if (galleryIndex == 0) {
    document
      .querySelector(".galleryButton-left")
      .classList.add("galleryButton-faded");
  } else {
    document
      .querySelector(".galleryButton-left")
      .classList.remove("galleryButton-faded");
  }
}

// Button functions to animate the gallery

function moveLeft() {
  if (galleryIndex >= galleryIndexMax) return;
  galleryIndex++;
  animateGallery();
}

function moveRight() {
  if (galleryIndex <= 0) return;
  galleryIndex--;
  animateGallery();
}
