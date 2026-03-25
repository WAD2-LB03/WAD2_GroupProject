const scrollContainers = Array.from(document.getElementsByClassName("sideways-scroll"));
const scrollDamp = .2;

var scrollData = new Map();

// Creates a map of data to handle scrolling animations for each horizontal scrolling element
scrollContainers.forEach(container => {
    scrollData.set(container, {
        delta: 0,
        isScrolling: false
    });
});

scrollData.forEach((value, key) => {
    key.addEventListener('wheel', (e) => {
        e.preventDefault();

        value.delta += e.deltaY;

        if (!value.isScrolling) {
            value.isScrolling = true;
            requestAnimationFrame(() => step(value, key))
        }
    });
});


function step(value, key) {
    if (Math.abs(value.delta) > .5) {
        key.scrollLeft += value.delta * scrollDamp;
        value.delta *= .8;
        requestAnimationFrame(() => step(value, key));
    } else {
        value.delta = 0;
        value.isScrolling = false;
    }
}