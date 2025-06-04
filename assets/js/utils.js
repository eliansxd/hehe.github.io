function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

function randomRange(min = 0, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

export { sleep, randomRange };
