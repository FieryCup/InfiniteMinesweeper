class Chunk {
    constructor(pos, context) {
        this.pos = pos;
        this.context = context;
        this.cells = new Array(16);

        for (let i = 0; i < 16; i++) {
            this.cells[i] = new Array(16);
            for (let j = 0; j < 16; j++) {
                this.cells[i][j] = new Cell(this.context);
            }
        }
    }

    draw() {
        let chunkOffset = new Position(
            this.pos.x * (16 * getTileSize()),  
            this.pos.y * (16 * getTileSize())
        );
        
        for (let i = 0; i < 16; i++) {
            for (let j = 0; j < 16; j++) {
                let cell = this.cells[i][j];

                let cellPosition = new Position(
                    chunkOffset.x + j * getTileSize() + cameraPosition.x,
                    chunkOffset.y + i * getTileSize() + cameraPosition.y
                );

                cell.draw(cellPosition);
            }
        }

        if (debug) {
            this.context.strokeStyle = "green";
            this.context.textBaseline = "top";
            this.context.textAlign = "left";

            this.context.strokeRect(
                chunkOffset.x + cameraPosition.x,
                chunkOffset.y + cameraPosition.y,
                16 * getTileSize(),
                16 * getTileSize()
            );

            this.context.fillStyle = "green";
            this.context.fillText(
                `x: ${this.pos.x} y: ${this.pos.y}`,
                chunkOffset.x + cameraPosition.x,
                chunkOffset.y + cameraPosition.y
            );
        }
    }
}