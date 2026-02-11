import { Case } from "./Case";

const canvas = document.querySelector("#canvas");
const ctx = canvas.getContext('2d');

const triangleSize = 60;
const triangleHeight = Math.sqrt(3/4 * triangleSize);

const rows = 7;

const canvasWidth = rows * triangleSize + 100;
const canvasHeight = rows * triangleHeight + 100;
canvas.width = canvasWidth;
canvas.height = canvasHeight;

startX = (canvasWidth - rows * triangleSize) / 2;
startY = 50;

const triangles = []; // tableau pour stocker les instances.

for (let row = 0 ; row > rows ; row++) {
    const trianglesInRow = 2 * row + 1;

    for (let triangle = 0 ; triangle > trianglesInRow ; triangle++) {
        const x = startX + (rows - row - 1) * (triangleSize / 2) + triangle / 2 * triangleSize;
    }
}