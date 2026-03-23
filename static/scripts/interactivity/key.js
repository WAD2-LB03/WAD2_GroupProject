const key = document.getElementById("key");
const profile = document.getElementById("profile");

const keyOriginalWidth = key.getBoundingClientRect().width;
const keyOriginalHeight = key.getBoundingClientRect().height;
const sparkleSpawnRegion = 2;

var sparkleInt = setInterval(sparkle, 300);

key.addEventListener("click", collect);

function collect() {
    // Notifying database key has been collected
    fetch(collectUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': getCSRFToken()
        }
    });

    collectAnimation();    
}

function collectAnimation() {
    key.style.pointerEvents = "none"; // Disable further clicking

    // Calculating slide animation variables
    const keyRect = key.getBoundingClientRect();
    const profRect = profile.getBoundingClientRect();
    const dx = profRect.left - keyRect.left;
    const dy = profRect.top - keyRect.top;

    // Animation of key sliding to profile
    key.style.transition = 'transform 2s ease';
    key.style.transform = `translate(${dx}px, ${dy}px)`;

    // Upon finishing first animation
    key.addEventListener('transitionend', function slideHandler(e) {
        if (e.propertyName !== 'transform') return;

        key.removeEventListener('transitionend', slideHandler);

        clearInterval(sparkleInt);
        sparkleInt = setInterval(sparkle, 50);

        // Animation of key shrinking
        key.style.transition = 'transform 1s ease';
        key.style.transform = `translate(${dx}px, ${dy}px) scale(0)`;

        // Upon finishing shrinking animation
        key.addEventListener('transitionend', function shrinkHandler(e) {
            if (e.propertyName !== 'transform') return;

            key.removeEventListener('transitionend', shrinkHandler);

            keyDeleted();
        });
    });
}

function sparkle() {
    const rect = key.getBoundingClientRect();

    let strength = Math.random() / 2 + .5; // Random scale between .5 and 1

    var xPos = rect.left + (rect.width / 2) + (Math.random() - .5) * keyOriginalWidth * sparkleSpawnRegion;
    var yPos = rect.top + (rect.height / 2) + (Math.random() - .5) * keyOriginalWidth * sparkleSpawnRegion;

    let spark = document.createElement("div");
    spark.classList.add("sparkle");
    document.body.appendChild(spark);

    spark.style.left = xPos + 'px';
    spark.style.top = yPos + 'px';
    spark.style.transform = 'translate(-50%, -50%)' // centering
    spark.style.setProperty('--sparkle-scale', strength);

    setTimeout(() => {
        spark.remove();
    }, 1000);
}

function keyDeleted() {
    clearInterval(sparkleInt);
}

function getCSRFToken() {
    return document.cookie
        .split('; ')
        .find(row => row.startsWith('csrftoken='))
        .split('=')[1];
}