let searchBar = document.querySelector("input");
let wordContainer = document.querySelector(".word");
let searchedText = document.querySelector(".word-text");
let text = document.querySelector(".text");
let volumeBtn = document.querySelector(".fa-volume-high");
let searchingText = document.querySelector(".searching-text");
let searchingWord = document.querySelector(".searching-word");
let searchingResult = document.querySelector(".search-result");
let audio;

function fetchApi(word) {
  if (audio) {
    audio = undefined;
  }
  searchingResult.innerHTML = "";
  document.querySelector("ul").innerHTML = "";
  text.innerHTML = "";
  wordContainer.style.display = "none";
  searchingText.style.display = "block";
  searchingWord.innerHTML = `${word}`;
  fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`)
    .then((res) => {
      if (res.status == 404) {
        throw new Error(
          `Sorry pal, we couldn't find definitions for the word you were looking for.`
        );
      }
      return res.json();
    })
    .then((data) => {
      searchingText.style.display = "none";
      if (data[0].phonetics[0].audio != "") {
        audio = new Audio(data[0].phonetics[0].audio);
      }
      wordContainer.style.display = "flex";
      searchedText.innerHTML = data[0].word;
      if (data[0].phonetic) {
        text.innerHTML = data[0].phonetic;
      }
      data[0].meanings.forEach((item) => {
        let listItem = document.createElement("li");
        listItem.innerHTML = `
        <div class="parts-of-speech-result">
            <h4 class="parts-of-speech">${item.partOfSpeech}</h4>
            <p class="meaning-text">
              ${item.definitions[0].definition}
            </p>
            <p>
              <span class="example">Example:</span>
              <span class="example-text">${
                item.definitions[0].example
                  ? item.definitions[0].example
                  : "Sorry example for this not Found"
              }</span>
            </p>
          </div>
        `;
        document.querySelector("ul").appendChild(listItem);
      });
    })
    .catch((err) => {
      searchingResult.innerHTML = `Sorry pal, we couldn't find definitions for the word you were looking for.`;
      searchingText.style.display = "none";
      console.error(err);
    });
}

searchBar.addEventListener("keyup", (e) => {
  if (e.key === "Enter" && e.target.value) {
    fetchApi(e.target.value);
  }
});

volumeBtn.addEventListener("click", (e) => {
  if (audio) {
    audio.play();
  } else {
    let utterance = new SpeechSynthesisUtterance(`${searchedText.textContent}`);
    speechSynthesis.speak(utterance);
  }
});
