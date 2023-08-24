class Cell {
    constructor(context) {
        this.context = context;
        this.number = 0;
        this.isMine = Math.round(Math.random()*3) === 0;
        this.isOpened = false;
        this.isFlagged = false;
    }

    draw(position) {
        this.context.textAlign = "center";
        this.context.textBaseline = "middle";

        function drawTile(cell, context, tileColor, text, textColor) {
            context.fillStyle = tileColor;
            context.strokeStyle = tileColor;

            let roundZoom = round * zoom;

            context.beginPath();
            if (cell.isFlagged || cell.isMine) {
                context.font = `bold ${(size * zoom) / 1.4}px Rubik`;
                context.roundRect(
                    position.x + roundZoom,
                    position.y + roundZoom,
                    size * zoom - roundZoom * 2,
                    size * zoom - roundZoom * 2,
                    roundZoom
                );
            } else {
                context.font = `bold ${(size * zoom) / 1.1}px Rubik`;
                context.roundRect(
                    position.x - roundZoom,
                    position.y - roundZoom,
                    size * zoom + roundZoom * 2,
                    size * zoom + roundZoom * 2,
                    roundZoom
                );
            }
            context.stroke();
            context.fill();

            let textYOffset = 1.4;

            context.strokeStyle = getCSSVariable("--background-secondary-color");
            if (!(cell.isFlagged || cell.isMine)) {
                let x = position.x;
                let y = position.y;
                let tileSize = size * zoom;
                let gridGap = tileSize/4;

                context.beginPath();
                context.moveTo(x + gridGap, y);
                context.lineTo(x + tileSize - gridGap, y);
                context.stroke();

                context.beginPath();
                context.moveTo(x, y + gridGap);
                context.lineTo(x, y + tileSize - gridGap);
                context.stroke();

                context.beginPath();
                context.moveTo(x + gridGap, y + tileSize - gap);
                context.lineTo(x + tileSize - gridGap, y + tileSize - gap);
                context.stroke();

                context.beginPath();
                context.moveTo(x + tileSize, y + gridGap);
                context.lineTo(x + tileSize, y + tileSize - gridGap);
                context.stroke();

                textYOffset = 1.8;
            }
    
            context.fillStyle = textColor;
            context.fillText(
                text,
                position.x + getTileSize() / 2,
                position.y + getTileSize() / 2 + textYOffset * zoom
            );
        }
        
        
        if (this.isFlagged) {
            drawTile(this, this.context, getCSSVariable("--flag-primary-color"), "F", getCSSVariable("--flag-secondary-color"));
            return;
        }

        if (this.isMine && this.isOpened) {
            drawTile(this, this.context, getCSSVariable("--mine-primary-color"), "X", getCSSVariable("--mine-secondary-color"));
            return;
        }

        if (this.isOpened) {
            let text = this.number;
            if (this.number === 0) {
                text = "";
            }
            
            drawTile(this, this.context, getCSSVariable("--background-primary-color"), text, getCSSVariable("--text-secondary-color"));
            return;
        }
    }
}