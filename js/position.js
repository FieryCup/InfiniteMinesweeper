let gap = 0;
let size = 30;
let round = 3;

let zoom = 1.8;

function getTileSize() {
    return (size + gap) * zoom;
}

class Position {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    convertCameraPosToChunkPos() {
        return new Position(
            -Math.ceil(
                this.x / (16 * getTileSize())
            ),
            -Math.ceil(
                this.y / (16 * getTileSize())
            )
        );
    }

    convertToLocalCellPosition() {
        let pos = new Position(
            this.x % 16, 
            this.y % 16
        ).floor();
        if (pos.x < 0) {
            pos.x = pos.x + 16;
        }
        if (pos.y < 0) {
            pos.y = pos.y + 16;
        }

        return pos;
    }

    convertToChunkPosition() {
        return new Position(this.x / 16, this.y / 16).floor();
    }

    convertToGlobalCellPosition() {
        return new Position(this.x / getTileSize(), this.y / getTileSize()).floor();
    }



    subtract(pos) {
        return new Position(this.x - pos.x, this.y - pos.y);
    }

    subtractNumber(number) {
        return new Position(this.x - number, this.y - number);
    }

    add(pos) {
        return new Position(this.x + pos.x, this.y + pos.y);
    }

    addNumber(number) {
        return new Position(this.x + number, this.y + number);
    }

    divide(number) {
        return new Position(this.x / number, this.y / number);
    }

    multiply(number) {
        return new Position(this.x * number, this.y * number);
    }

    floor() {
        return new Position(Math.floor(this.x), Math.floor(this.y));
    }

    ceil() {
        return new Position(Math.ceil(this.x), Math.ceil(this.y));
    }

    abs() {
        return new Position(Math.abs(this.x), Math.abs(this.y));
    }
}