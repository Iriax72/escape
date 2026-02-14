export class Player {
  constructor(initialCase, imageElement, canvas) {
    this.currentCase = initialCase;
    this.image = imageElement;
    this.canvas = canvas;
    this.isDragging = false;
    this.dragOffsetX = 0;
    this.dragOffsetY = 0;
    this.showMoveIndicators = false;
    this.size = initialCase.size * 0.6; // Le joueur fait 60% de la taille d'un triangle
    
    // Position temporaire pendant le drag
    this.tempX = null;
    this.tempY = null;
  }

  // Obtenir la position centrale du joueur sur sa case actuelle
  getPosition() {
    return {
      x: this.currentCase.x + this.currentCase.size / 2,
      y: this.currentCase.y + this.currentCase.size / 2
    };
  }

  // Dessiner le joueur
  draw(ctx) {
    if (!this.image || !this.image.complete) {
      return;
    }

    const pos = this.isDragging && this.tempX !== null 
      ? { x: this.tempX, y: this.tempY }
      : this.getPosition();

    ctx.save();
    ctx.drawImage(
      this.image,
      pos.x - this.size / 2,
      pos.y - this.size / 2,
      this.size,
      this.size
    );
    ctx.restore();
  }

  // Dessiner les indicateurs de mouvement (points gris)
  drawMoveIndicators(ctx, adjacentCases) {
    if (!this.showMoveIndicators) return;

    adjacentCases.forEach(caseObj => {
      const pos = {
        x: caseObj.x + caseObj.size / 2,
        y: caseObj.y + caseObj.size / 2
      };

      ctx.beginPath();
      ctx.arc(pos.x, pos.y, 8, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(128, 128, 128, 0.7)';
      ctx.fill();
      ctx.strokeStyle = 'rgba(80, 80, 80, 0.9)';
      ctx.lineWidth = 2;
      ctx.stroke();
    });
  }

  // Vérifier si un point est à l'intérieur du joueur
  isPointInside(x, y) {
    const pos = this.getPosition();
    const dx = x - pos.x;
    const dy = y - pos.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    return distance <= this.size / 2;
  }

  // Commencer le drag
  startDrag(mouseX, mouseY) {
    const pos = this.getPosition();
    this.isDragging = true;
    this.dragOffsetX = mouseX - pos.x;
    this.dragOffsetY = mouseY - pos.y;
    this.tempX = pos.x;
    this.tempY = pos.y;
    this.showMoveIndicators = false; // Masquer les indicateurs pendant le drag
  }

  // Mettre à jour la position pendant le drag
  updateDrag(mouseX, mouseY) {
    if (this.isDragging) {
      this.tempX = mouseX - this.dragOffsetX;
      this.tempY = mouseY - this.dragOffsetY;
    }
  }

  // Terminer le drag et vérifier si on peut se déplacer
  endDrag(mouseX, mouseY, allCases) {
    if (!this.isDragging) return false;

    this.isDragging = false;
    
    // Trouver les cases adjacentes
    const adjacentCases = this.getAdjacentCases(allCases);
    
    // Vérifier si la souris est sur une case adjacente
    const targetCase = adjacentCases.find(caseObj => 
      this.isPointInCase(mouseX, mouseY, caseObj)
    );

    if (targetCase) {
      // Déplacement valide
      this.currentCase = targetCase;
      this.tempX = null;
      this.tempY = null;
      return true;
    } else {
      // Retour à la position initiale
      this.tempX = null;
      this.tempY = null;
      return false;
    }
  }

  // Vérifier si un point est dans une case
  isPointInCase(x, y, caseObj) {
    const centerX = caseObj.x + caseObj.size / 2;
    const centerY = caseObj.y + caseObj.size / 2;
    const dx = x - centerX;
    const dy = y - centerY;
    const distance = Math.sqrt(dx * dx + dy * dy);
    return distance <= caseObj.size / 2;
  }

  // Obtenir les cases adjacentes
  getAdjacentCases(allCases) {
    const currentX = this.currentCase.x;
    const currentY = this.currentCase.y;
    const size = this.currentCase.size;
    const isReversed = this.currentCase.isReversed;

    const adjacent = [];
    const tolerance = 5; // Tolérance pour les comparaisons de position

    allCases.forEach(caseObj => {
      if (caseObj === this.currentCase) return;

      const dx = Math.abs(caseObj.x - currentX);
      const dy = Math.abs(caseObj.y - currentY);

      // Cases adjacentes selon l'orientation
      if (isReversed) {
        // Triangle pointe vers le haut - adjacents: en bas à gauche, en bas à droite, et au-dessus
        if ((dx < tolerance && dy > size * 0.8 && dy < size * 1.2) || // Dessus/dessous
            (dx > size * 0.4 && dx < size * 0.6 && dy < tolerance)) { // À gauche/droite
          adjacent.push(caseObj);
        }
      } else {
        // Triangle pointe vers le bas - adjacents: en haut à gauche, en haut à droite, et en-dessous
        if ((dx < tolerance && dy > size * 0.8 && dy < size * 1.2) || // Dessus/dessous
            (dx > size * 0.4 && dx < size * 0.6 && dy < tolerance)) { // À gauche/droite
          adjacent.push(caseObj);
        }
      }
    });

    return adjacent;
  }

  // Toggle l'affichage des indicateurs de mouvement
  toggleMoveIndicators() {
    this.showMoveIndicators = !this.showMoveIndicators;
  }

  showMoveIndocators() {
    this.showMoveIndicators = true;
  }

  // Cacher les indicateurs
  hideMoveIndicators() {
    this.showMoveIndicators = false;
  }

  // Déplacer le joueur vers une case spécifique (pour le clic sur un indicateur)
  moveToCase(targetCase) {
    this.currentCase = targetCase;
    this.showMoveIndicators = false;
  }
}