import {Case} from "./Case.js";

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

const triangleSize = 60; // taille d'un petit triangle
// Hauteur d'un triangle équilatéral = (√3 / 2) * côté
const triangleHeight = Math.sqrt(3) / 2 * triangleSize;
const numRows = 7; // base de 7 triangles

// Calculer les dimensions du canvas
const canvasWidth = numRows * triangleSize + 100;
const canvasHeight = numRows * triangleHeight + 100;
canvas.width = canvasWidth;
canvas.height = canvasHeight;
// Point de départ (centré)
const startX = (canvasWidth - numRows * triangleSize) / 2;
const startY = 50;

const triangles = []; // Tableau pour stocker toutes les instances de Case
const triangleImage = new Image();
triangleImage.src = './assets/images/triangle.png';

triangleImage.onerror = function() {
    console.error("Erreur de chargement de l'image du triangle.");
}

triangleImage.onload = function() {
    generateTriangles();
}

function generateTriangles () {
    // Générer un grand triangle inversé (base en haut, apex en bas)
    for (let row = 0; row < numRows; row++) {
        // Pour un triangle inversé, la première ligne (row=0) contient numRows triangles,
        // puis décroît jusqu'à 1.
        const trianglesInRow = numRows - row;

        // Base x pour la première colonne de cette ligne — on décale vers la droite
        // à chaque ligne pour centrer la ligne sous la précédente
        const baseX = startX + row * (triangleSize / 2);
        const y = startY + row * triangleHeight;

        for (let col = 0; col < trianglesInRow; col++) {
            // Position x pour le triangle principal de la colonne
            const x = baseX + col * triangleSize;

            // Ajouter un triangle qui pointe vers le bas
            const triangle = new Case(x, y, triangleSize, triangleImage);
            triangles.push(triangle);
            triangle.draw(ctx);

            // Ajouter un triangle pointe vers le haut entre deux triangles (sauf après le dernier)
            if (col < trianglesInRow - 1) {
                const reversedTriangle = new Case(x + triangleSize / 2, y, triangleSize, triangleImage, true);
                triangles.push(reversedTriangle);
                reversedTriangle.draw(ctx);
            }
        }
    }
}