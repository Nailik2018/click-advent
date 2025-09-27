const COUNT = AdventCalendarConfig.doors;
const STORAGE_KEY = "advent_opened_fullscreen";
const GRID = document.getElementById("grid");
const PRIMARY_COLOR = AdventCalendarConfig.primaryColor;
const SECONDARY_COLOR = AdventCalendarConfig.secondaryColor;

document.documentElement.style.setProperty('--door-bg', AdventCalendarConfig.primaryColor);
document.documentElement.style.setProperty('--door-color', AdventCalendarConfig.fontColor);
document.documentElement.style.setProperty('--rows', AdventCalendarConfig.rows);
document.documentElement.style.setProperty('--columns', AdventCalendarConfig.columns);
document.documentElement.style.setProperty('--secondary-color', AdventCalendarConfig.secondaryColor);

// --- URL Parameter einlesen ---
const params = new URLSearchParams(window.location.search);
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
    const img = document.createElement("img");
    img.src = `${getImageDirectory(IMAGE_DIRECTORY, IMAGE_NAME, TODAY)}_${i + 1}.png`;
    img.alt = `Tür ${i + 1}`;
    img.onerror = () => {
        door.style.background = SECONDARY_COLOR;
        img.remove();
    };
    door.innerHTML = "";
    door.appendChild(img);
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