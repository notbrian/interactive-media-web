// Make an array with only the first 5 trends
const trends = data[0].trends.slice(0, 5);
const today = document.querySelector("#today");

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
