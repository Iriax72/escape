export class Case {
    constructor(x, y, size, isReversed = false) {
        this.x = x;
        this.y = y;
        this.size = size;
        this.isReversed = isReversed;
    }

    draw(ctx) {
        ctx.beginPath();

        // Calculer la hauteur réelle d'un triangle équilatéral de côté `size`
        const h = Math.sqrt(3) / 2 * this.size;

        if (this.isReversed) {
            // Triangle pointe vers le haut
            ctx.moveTo(this.x, this.y + h); // Coin bas gauche
            ctx.lineTo(this.x + this.size, this.y + h); // Coin bas droit
            ctx.lineTo(this.x + this.size / 2, this.y); // Pointe du haut
        } else {
            // Triangle pointe vers le bas
            ctx.moveTo(this.x, this.y); // Coin haut gauche
            ctx.lineTo(this.x + this.size, this.y); // Coin haut droit
            ctx.lineTo(this.x + this.size / 2, this.y + h); // Pointe du bas
        }
    
        ctx.closePath();
        ctx.strokeStyle = '#000';
        ctx.stroke();
        ctx.fillStyle = '#fff';
        ctx.fill();
    }
}