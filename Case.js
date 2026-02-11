export class Case {
    constructor(x, y, size, isReversed = false) {
        this.x = x;
        this.y = y;
        this.size = size;
        this.isReversed = isReversed;
    }

    draw(ctx) {
        ctx.beginPath();
    
        if (this.isReversed) {
            // Triangle pointe vers le haut
            ctx.moveTo(this.x, this.y + this.size); // Coin bas gauche
            ctx.lineTo(this.x + this.size, this.y + this.size); // Coin bas droit
            ctx.lineTo(this.x + this.size / 2, this.y); // Pointe du haut
        } else {
            // Triangle pointe vers le bas
            ctx.moveTo(this.x, this.y); // Coin haut gauche
            ctx.lineTo(this.x + this.size, this.y); // Coin haut droit
            ctx.lineTo(this.x + this.size / 2, this.y + this.size); // Pointe du bas
        }
    
        ctx.closePath();
        ctx.strokeStyle = '#000';
        ctx.stroke();
        ctx.fillStyle = '#fff';
        ctx.fill();
    }
}