const search = document.getElementById("search-bar");
const searchResults = document.getElementById("search-results");

search.addEventListener('input', searchGames);

// Performs AJAX call when text is added to search bar; Removes all results when all text is deleted
function searchGames() {
    const input = search.value.trim();

    if (input.length === 0) {
        searchResults.innerHTML = "";

    } else {
        fetch(searchUrl+`?q=${encodeURIComponent(input)}`)
            .then(res => res.json())
            .then(data => {
            displayGames(data);
        });
    }
}

function displayGames(games) {
    searchResults.innerHTML = "";

    // Creates all the appropriate elements of a small game display for each game in the search results
    games.results.forEach(game => {
        const result = create('div', searchResults, "game-small");

        const img = create('img', result);
        img.src = game.image;
        img.alt = game.name;

        const info = create('div', result, "gs-info");

        const title = create('span', info);

        const link = create('a', title);
        link.textContent = game.name;
        link.href = gameUrl.replace('reallycoolplaceholder', game.slug);

        const tagsText = create('span', info);
        tagsText.textContent = "Tags: ";

        const tagList = create('div', info, "tag_list");

        for (let i = 0; i < game.tags.length; i++) {
            const tagName = create('span', tagList, "tag_name");

            if (i >= 5) {
                tagName.textContent = "+" + (game.tags.length - 5) + " more";
                break;
            }
            
            tagName.textContent = game.tags[i];
        }

        const release = create('span', info);
        release.textContent = "Release: " + game.release;
    });
}

// Creates a new HTML element with given parameters
function create(type, parent = null, classType = null) {
    let element = document.createElement(type);

    if (classType) {
        element.classList.add(classType);
    }

    if (parent) {
        parent.appendChild(element);
    }

    return element;
}