class Field {
    constructor(id) {
        this.element = document.getElementById(id);
        this.context = this.element.getContext("2d");

        this.element.width = window.innerWidth;
        this.element.height = window.innerHeight;

        this.chunks = new Map();

        this.element.addEventListener("contextmenu", function(event) {
            event.preventDefault();
            event.stopPropagation();
        });
    }

    draw() {
        this.context.textBaseline = "top";
        
        this.context.fillStyle = getCSSVariable("--background-secondary-color");
        this.context.fillRect(0, 0, this.element.width, this.element.height);

        let viewStartPos = cameraPosition.convertCameraPosToChunkPos();
        let viewEndPos = cameraPosition.subtract(new Position(this.element.width, this.element.height)).convertCameraPosToChunkPos();

        for (let i = viewStartPos.y; i <= viewEndPos.y; i++) {
            for (let j = viewStartPos.x; j <= viewEndPos.x; j++) {
                let chunkStringPos = `${j} ${i}`;

                if (this.chunks.has(chunkStringPos)) {
                    this.chunks.get(chunkStringPos).draw();
                }
            }
        }

        if (debug) {
            this.context.fillStyle = "gray";
            this.context.textBaseline = "top";
            this.context.textAlign = "left";
            this.context.font = "bold 30pt Rubik";
            this.context.fillText(`${cameraPosition.x}, ${cameraPosition.y}`, 1, this.element.height - 160);
            this.context.fillText(`${zoom}`, 1, this.element.height - 120);
            this.context.fillText(`${viewStartPos.x}, ${viewStartPos.y} <=> ${viewEndPos.x}, ${viewEndPos.y}`, 1, this.element.height - 80);
        }
    }

    getCell(pos) {
        let chunkPos = pos.convertToChunkPosition();
        let cellPos = pos.convertToLocalCellPosition();

        let chunkStringPos = `${chunkPos.x} ${chunkPos.y}`;

        if (!this.chunks.has(chunkStringPos)) {
            this.chunks.set(chunkStringPos, new Chunk(new Position(chunkPos.x, chunkPos.y), this.context));
        }

        let chunk = this.chunks.get(chunkStringPos);
        return chunk.cells[cellPos.y][cellPos.x];
    }

    getNeighbours(pos) {
        let neighbours = new Array();

        for (let i = -1; i <= 1; i++) {
            for (let j = -1; j <= 1; j++) {
                if ((i === 0) && (j === 0)) {
                    continue;
                }

                let neighbourCell = this.getCell(new Position(pos.x + j, pos.y + i));
                neighbours.push(neighbourCell);
            }
        }

        return neighbours;
    }

    countCellNumber(pos) {
        let cell = this.getCell(pos);
        cell.number = 0;

        let neighbours = this.getNeighbours(pos);

        neighbours.forEach(neighbour => {
            if (neighbour.isMine) {
                cell.number++;
            }
        });
    }

    openCell(pos) {
        let cell = this.getCell(pos);
        if (cell.isFlagged) {
            return;
        }
        cell.isOpened = true;
        cell.isFlagged = false;
        this.countCellNumber(pos);

        if (cell.number !== 0 || cell.isMine) {
            return;
        }
        
        for (let i = -1; i <= 1; i++) {
            for (let j = -1; j <= 1; j++) {
                if (i === j === 0) {
                    continue;
                }
                
                let neighbourCellPos = new Position(pos.x + j, pos.y + i);
                if (!field.getCell(neighbourCellPos).isOpened) {
                    this.openCell(neighbourCellPos);
                }
            }
        }
    }

    openCellWithFlags(pos) {
        let cell = this.getCell(pos);

        if (cell.isOpened && !cell.isMine) {
            let neighbours = this.getNeighbours(pos);
            let flagAmount = 0;

            neighbours.forEach(neighbour => {
                if (neighbour.isFlagged || (neighbour.isMine && neighbour.isOpened)) {
                    flagAmount++;
                }
            });

            if (flagAmount === cell.number) {
                for (let i = -1; i <= 1; i++) {
                    for (let j = -1; j <= 1; j++) {
                        if (i === j === 0) {
                            continue;
                        }
                        
                        let neighbourPos = pos.add(new Position(j, i));
                        let neighbourCell = this.getCell(neighbourPos)

                        if (!neighbourCell.isFlagged && !neighbourCell.isOpened) {
                            this.openCell(neighbourPos);
                        }
                    }
                }
            }
        } else {
            this.openCell(pos);
        }
    }

    setFlag(pos) {
        let cell = this.getCell(pos);
        if (!cell.isOpened) {
            cell.isFlagged = !cell.isFlagged;
        }
    }
}