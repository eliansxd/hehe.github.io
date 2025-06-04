import { randomRange, sleep } from "./utils.js";
import config from "./config.js";

function initialize() {
    const titleElement = document.querySelector("title");
    const { search } = window.location;
    const searchParams = new URLSearchParams(search);
    const title = searchParams.get("title") || config.defaultTitle;
    titleElement.textContent = title;
}

function createTexts() {
    const texts = config.defaultTexts;
    const elmLength = config.defaultMaxTextLength;
    const textContainer = document.getElementById("text-container");

    function clone() {
        const textElement = document.getElementById("text-default");
        return textElement.cloneNode(true);
    }
    function setText(elm, text) {
        elm.textContent = text;
        elm.attributes.removeNamedItem("hidden");
    }

    for (let i = 0; i < elmLength; i++) {
        const textElement = clone();
        const text = texts[randomRange(0, texts.length - 1)];
        setText(textElement, text);

        const x = randomRange(0, window.innerWidth);
        const y = randomRange(0, window.innerHeight / 2);
        const z = randomRange(-100, 100);

        const offsetY = randomRange(-4, 4);
        const offsetX = offsetY;
        const duration = randomRange(2, 5);
        const delay = randomRange(0, 2);

        textElement.style.setProperty("--x", `${x}px`);
        textElement.style.setProperty("--y", `${y}px`);
        textElement.style.setProperty("--z", `${z}px`);
        textElement.style.setProperty("--offset-x", `${offsetX}px`);
        textElement.style.setProperty("--offset-y", `${offsetY}px`);
        textElement.style.setProperty("--duration", `${duration}s`);
        textElement.style.setProperty("--delay", `${delay}s`);

        textElement.attributes.removeNamedItem("id");
        textContainer.appendChild(textElement);
    }
    const event = new CustomEvent("textsCreated");
    document.dispatchEvent(event);
}

window.addEventListener("DOMContentLoaded", () => {
    initialize();
    createTexts();
});

document.addEventListener("textsCreated", async () => {
    const randomTime = randomRange(1000, 3000);
    await sleep(randomTime);
    const loading = document.querySelector(".loading");
    if (loading) loading.classList.add("hidden");
});

let isDragging = false;
let startX = 0;
let startY = 0;
let rotX = 0;
let rotY = 0;

const card = document.querySelector("#text-container");

function getEventClientPosition(e) {
    if (e.touches && e.touches.length > 0) {
        return { x: e.touches[0].clientX, y: e.touches[0].clientY };
    }
    return { x: e.clientX, y: e.clientY };
}

function mouseDown(e) {
    isDragging = true;
    const { x, y } = getEventClientPosition(e);
    startX = x;
    startY = y;
}

function mouseUp() {
    isDragging = false;
}

function mouseMove(e) {
    if (!isDragging) return;

    e.preventDefault();

    const { x, y } = getEventClientPosition(e);

    const dx = x - startX;
    const dy = y - startY;

    rotY += dx * 0.25;
    rotX -= dy * 0.25;

    startX = x;
    startY = y;

    card.style.transform = `rotateX(${rotX}deg) rotateY(${rotY}deg)`;
}

document.addEventListener("mousedown", mouseDown);
document.addEventListener("mouseup", mouseUp);
document.addEventListener("mousemove", mouseMove);

document.addEventListener("touchstart", mouseDown, { passive: false });
document.addEventListener("touchend", mouseUp);
document.addEventListener("touchmove", mouseMove, { passive: false });

// Detect DevTools
setInterval(() => {
    const start = Date.now();
    debugger;
    const end = Date.now();
    if (start - end > 100) {
        console.log("DevTools opened!");
    }
}, 1000);

// Disable right-click context menu
document.addEventListener("contextmenu", (event) => {
    event.preventDefault();
    console.log("Right-click disabled!");
});
