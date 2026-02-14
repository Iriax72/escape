import {Case} from "./Case.js";
import {Player} from "./Player.js";

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

let player = null; // variable pour le joueur
const playerImage = new Image();
playerImage.src = './assets/images/player.png';

let imagesLoaded = 0;
const totalImages = 2; // triangle, player

function checkAllImagesLoaded () {
    imagesLoaded++;
    if (imagesLoaded === totalImages) {
        generateTriangles();
        initPlayer();
        setUpEventListeners();
        animate();
    }
}

triangleImage.onerror = function() {
    console.error("Erreur de chargement de l'image du triangle.");
}
playerImage.onerror = function() {
    console.error("Erreur de chargement de l'image du joueur.");
}

triangleImage.onload = checkAllImagesLoaded;
playerImage.onload = checkAllImagesLoaded;

function generateTriangles () {
    // Générer un grand triangle inversé (base en haut, apex en bas)
    for (let row = 0; row < numRows - 1; row++) {
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

function drawBorder() {
    ctx.beginPath();

    // coin haut gauche
    const topLeftX = startX;
    const topLeftY = startY;

    // coin haut droit
    const topRightX = startX + numRows * triangleSize;
    const topRightY = startY;

    // coin bas
    const bottomX = startX + numRows * triangleSize / 2;
    const bottomY = startY + numRows * triangleHeight;

    // Dessiner les lignes entre les coins
    ctx.moveTo(topLeftX, topLeftY);
    ctx.lineTo(topRightX, topRightY);
    ctx.lineTo(bottomX, bottomY);
    ctx.closePath();
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 8;
    ctx.stroke();
}

function initPlayer() {
    const initialCase = triangles[6];
    player = new Player(initialCase, playerImage, canvas);
    console.log("Joueur initialisé sur la case " + String(initialCase) + ".")
}

function render() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Dessiner les triangles
    triangles.forEach(triangle => triangle.draw(ctx));

    // Dessiner la bordure
    drawBorder();

    // Dessiner les indicateurs de mouvement
    if (player) {
        const adjacentCases = player.getAdjacentCases(triangles);
        player.drawMoveIndicators(ctx, adjacentCases);
    }

    // Dessiner le joueur
    if (player) {
        player.draw(ctx);
    }
}

function setUpEventListeners () {
    let isDragging = false;

    // Obtenir la position de la souris relaige au canvas
    function getMousePos(e) {
        const rect = canvas.getBoundingClientRect();
        return {
            x: e.clientX - rect.left,
            y: e.clientY - rect.top
        }
    }

    // Mouse down
    canvas.addEventListener('mousedown', (e) => {
        const pos = getMousePos(e);

        if (player && player.isPointInside(pos.x, pos.y)) {
            isDragging = true;
            player.startDrag(pos.x, pos.y);
            canvas.style.cursor = 'grabbing';
        }
    });

    // Mouse move
    canvas.addEventListener('mousemove', (e) => {
        const pos = getMousePos(e);

        if (isDragging && player) {
            player.updateDrag(pos.x, pos.y);
        } else {
            // Changer le curseur si on survole le joueur
            if (player && player.isPointInside(pos.x, pos.y)) {
                canvas.style.cursor = 'grab';
            } else {
                canvas.style.cursor = 'default';
            }
        }
    });

    // Mouse up
    canvas.addEventListener('mouseup', (e) => {
        if (isDragging && player) {
            const pos = getMousePos(e);
            player.endDrag(pos.x, pos.y, triangles);
            isDragging = false;
            canvas.style.cursor = 'default';
            render();
        }
    });

    // click pour toggle les indicateurs de mouvement ou se deplacer
    canvas.addEventListener('click', (e) => {
        if (isDragging) return;

        const pos = getMousePos(e);

        // Si on clique sur le joueur, toggle les indicateurs de mouvement
        if (player && player.isPointInside(pos.x, pos.y)) {
            player.toggleMoveIndicators();
            render();
            return;
        }

        // Si les indicateurs sont visibles, vérifier si le click est sur une case adjacente
        let clickedCase = null;
        if (player && player.showMoveIndicators) {
            const adjacentCases = player.getAdjacentCases(triangles);
            clickedCase = adjacentCases.find(c => c.isPointInside(pos.x, pos.y));
        }

        if (clickedCase) {
            player.moveToCase(clickedCase);
            player.hideMoveIndicators(); // cacher les indicateurs de mouvement
            render();
        } else {
            player.hideMoveIndicators();
            render();
        }
    });

    // prevenir le drag par défaut du canvas
    canvas.addEventListener('dragstart', (e) => {
        e.preventDefault();
    });
}

// Boucle d'animation pour render en permanance
function animate() {
    render();
    requestAnimationFrame(animate);
}
