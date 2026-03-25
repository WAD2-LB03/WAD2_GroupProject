const elements = document.getElementsByClassName("sideways-scroll");

Array.from(elements).forEach((element) => {
    element.addEventListener('wheel', (e) => {
        e.preventDefault();

        element.scrollBy({
            left: e.deltaY,
            behavior: 'smooth'
        });
    },
    { passive: false });
});