const searchButton = document.getElementById("search-button");
const search = document.getElementById("search");

searchButton.addEventListener('click', search);

function search() {
    const input = search.value.trim();

    if (input.charAt(0) === '#') {

    } else {
        fetch(`/search?q=${encodeURIComponent(query)}`)
            .then(res => res.json())
            .then(data => {
            displayGames(data);
        });
    }
}

function displayGames(games) {
    
}

// Breaks the search into an array of tags by splitting them at ','
// Any '#'s are removed from strings and empty strings are removed from the list
function parseSearch(search) {  // Not used anymore but left in for future use
    return search.replace(/#/g, '').split(/[,]+/).filter(Boolean);
}