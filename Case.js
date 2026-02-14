export class Case {
    constructor(x, y, size, image, isReversed = false) {
        this.x = x;
        this.y = y;
        this.size = size;
        this.image = image;
        this.isReversed = isReversed;
    }

    draw(ctx) {
        if (!this.image || !this.image.complete) {
            console.warn('Image non-chargée')
            return;
        }

        ctx.save();

        if (this.isReversed) {
            // Triangle pointe vers le haut
            ctx.translate(this.x + this.size / 2, this.y + this.size / 2);
            ctx.rotate(Math.PI);
            ctx.drawImage(this.image, -this.size / 2, -this.size / 2, this.size, this.size);
        } else {
            // Triangle pointe vers le bas
            ctx.drawImage(this.image, this.x, this.y, this.size, this.size);
        }
    
        ctx.restore();
    }

    isPointInside(px, py) {
        if (px < this.x) return false;
        if (px > this.x + this.size) return false;
        if (py < this.y) return false;
        if (py > this.y + this.size) return false;
        return true;
    }
}