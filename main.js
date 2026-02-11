import {Case} from "./Case.js";

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

const triangleSize = 60; // taille d'un petit triangle
// Hauteur d'un triangle équilatéral = (√3 / 2) * côté
const triangleHeight = Math.sqrt(3) / 2 * triangleSize;
const numRows = 7; // Configuration pour 7 lignes (1+2+3+4+5+6+7 = 28 triangles pointant vers le bas + 21 vers le haut = 49 total)

// Calculer les dimensions du canvas
const canvasWidth = numRows * triangleSize + 100;
const canvasHeight = numRows * triangleHeight + 100;
canvas.width = canvasWidth;
canvas.height = canvasHeight;
// Point de départ (centré)
const startX = (canvasWidth - numRows * triangleSize) / 2;
const startY = 50;

const triangles = []; // Tableau pour stocker toutes les instances de Case

// Générer les triangles ligne par ligne
for (let row = 0; row < numRows; row++) {
    const trianglesInRow = row;

    // Base x pour la première colonne de cette ligne
    const baseX = startX + (numRows - row - 1) * (triangleSize / 2);
    const y = startY + row * triangleHeight;

    // Ajouter un triangle inversé au début de la ligne
    const startReversed = new Case(baseX - triangleSize / 2, y, triangleSize, true);
    triangles.push(startReversed);
    startReversed.draw(ctx);

    for (let col = 0; col < trianglesInRow; col++) {
        // Position x pour le triangle pointant vers le bas
        const x = baseX + col * triangleSize;

        // Ajouter un triangle qui pointe vers le bas
        const triangle = new Case(x, y, triangleSize, false);
        triangles.push(triangle);
        triangle.draw(ctx);

        // Ajouter un triangle pointe vers le haut entre deux triangles (sauf après le dernier)
        if (col < trianglesInRow - 1) {
            const reversedTriangle = new Case(x + triangleSize / 2, y, triangleSize, true);
            triangles.push(reversedTriangle);
            reversedTriangle.draw(ctx);
        }
    }

    // Ajouter un triangle inversé à la fin de la ligne
    const endReversedX = baseX + (trianglesInRow - 1) * triangleSize + triangleSize / 2;
    const endReversed = new Case(endReversedX, y, triangleSize, true);
    triangles.push(endReversed);
    endReversed.draw(ctx);
}