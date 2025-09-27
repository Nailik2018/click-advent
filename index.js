const COUNT = 24;
const STORAGE_KEY = "advent_opened_fullscreen";
const GRID = document.getElementById("grid");

// --- URL Parameter einlesen ---
const params = new URLSearchParams(window.location.search);
// const AUTOMATED = params.get("automated") === "true"; // default = false
// const RESET = params.get("reset") === "true";
const IMAGE_DIRECTORY = AdventCalendarConfig.imageDirectory;
const IMAGE_NAME = AdventCalendarConfig.imageName;
const AUTOMATED = params.has("automated")
    ? params.get("automated") === "true"
    : AdventCalendarConfig.automated;

const RESET = params.has("reset")
    ? params.get("reset") === "true"
    : AdventCalendarConfig.reset;

// Reset?
if (RESET) {
    localStorage.removeItem(STORAGE_KEY);
}

const OPENED = new Set(JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]"));

// Heutiges Datum
const TODAY = new Date();
const CURRENT_DAY = TODAY.getDate(); // z.B. 27 für 27. Dezember

function canIOpen(i) {
    return (i + 1) <= CURRENT_DAY;
}

for (let i = 0; i < COUNT; i++) {
    const door = document.createElement("div");
    door.className = `door door-${i+1}`;
    door.style.background = AdventCalendarConfig.primaryColor;
    door.style.color = AdventCalendarConfig.fontColor;
    if (OPENED.has(i)) {
        // schon geöffnet aus localStorage
        openDoor(door, i, false);
    } else if (AUTOMATED && canIOpen(i)) {
        // automatisches Öffnen, wenn erlaubt
        openDoor(door, i, true);
    } else {
        // geschlossen lassen
        door.textContent = i + 1;
        door.addEventListener("click", () => {
            if (canIOpen(i)) {
                openDoor(door, i, true);
            } else {
                alert("Dieses Türchen darf erst am " + (i+1) + ". Dezember geöffnet werden!");
            }
        });
    }
    GRID.appendChild(door);
}

function openDoor(door, i, save) {
    door.classList.add("opened");
    //door.innerHTML = `<img src="./assets/images/2025/10/bild_${i + 1}.png" alt="Tür ${i + 1}">`;
    door.innerHTML = `<img src="${getImageDirectory(IMAGE_DIRECTORY, IMAGE_NAME, TODAY)}_${i + 1}.png" alt="Tür ${i + 1}">`;
    if (save) {
        OPENED.add(i);
        localStorage.setItem(STORAGE_KEY, JSON.stringify([...OPENED]));
    }
}

function getImageDirectory(imageDirectory, imageName, today) {
    // Sicherstellen, dass imageDirectory mit '/' endet
    if (!imageDirectory.endsWith('/')) imageDirectory += '/';
    return imageDirectory + today.getFullYear() + '/' + (today.getMonth() + 1) + '/' + imageName;
}