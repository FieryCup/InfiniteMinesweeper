// TODO: Исправить зум

let debug = false;

let cameraPosition = new Position(0, 0);
let offsetPosition = new Position(0, 0);

// let isDragging = false;
let dragPrevPos = new Position(0, 0);

function getCSSVariable(name) {
    return getComputedStyle(document.documentElement).getPropertyValue(name);
}

function returnToHome() {
    cameraPosition = new Position(field.element.width / 2, field.element.height / 2).floor();
    field.draw();
}

// function exportField() {
//     let canvasUrl = field.element.toDataURL("image/png");
//     document.getElementById("export-image").src = canvasUrl;
// }

let field = new Field("field");
field.draw();

function themeSwitch() {
    let theme = document.documentElement.getAttribute("theme");

    if (!theme || theme === "dark") {
        document.documentElement.setAttribute("theme", "light");
        localStorage.setItem("theme", "light");
    } else {
        document.documentElement.setAttribute("theme", "dark");
        localStorage.setItem("theme", "dark");
    }
    field.draw();
}

function switchDebugMode() {
    debug = !debug;
    field.draw();
}

window.addEventListener("load", function() {
    let theme = this.localStorage.getItem("theme");
    if (theme === "light") {
        document.documentElement.setAttribute("theme", "light");
        document.getElementById("theme-switch").checked = true;
    } else {
        document.documentElement.setAttribute("theme", "dark");
        document.getElementById("theme-switch").checked = false;
    }
    field.draw();
});

// Открытие пустой клетки
for (let i = -1; i <= 1; i++) {
    for (let j = -1; j <= 1; j++) {
        let cell = field.getCell(new Position(j, i));

        cell.isMine = false;
    }
}

field.openCell(new Position(0, 0));

// Перемещение камеры к нулевому чанку
cameraPosition = new Position(field.element.width / 2, field.element.height / 2).floor();

// Обработка событий
window.addEventListener("resize", function () {
    field.element.width = window.outerWidth;
    field.element.height = window.outerHeight;
    field.draw();
});

let lastTouchPos = new Position(0, 0);

field.element.addEventListener("wheel", function (event) {
    zoom = Math.min(Math.max(zoom - event.deltaY / 500, 0.6), 3);
    zoom = zoom.toFixed(1);
    field.draw();
}, {passive: true})



let mouseStartPos = new Position(0, 0);
let isMouseDragged = false;
let isMouseClicked = false;
let touchStartTime;

function mousemove(event) {
    if (event.touches) {
        lastTouchPos = new Position(event.touches[0].clientX, event.touches[0].clientY);
    }

    isMouseDragged = true;
    if (!isMouseClicked) {
        return;
    }

    function getPos(n) {
        return Math.floor(n / (size + gap) / zoom) * getTileSize();
    }

    if (isMouseDragged) {
        let dragCurrentPos;
        if (event.touches) {
            dragCurrentPos = lastTouchPos;
        } else {
            dragCurrentPos = new Position(event.clientX, event.clientY);
        }

        cameraPosition = cameraPosition.subtract(
            dragPrevPos.subtract(dragCurrentPos)
        );

        dragPrevPos = dragCurrentPos;
        isMouseFirstDragged = false;
    }

    let clientPos;
    if (event.touches) {
        clientPos = lastTouchPos.ceil();
    } else {
        clientPos = new Position(event.clientX, event.clientY);
    }

    let cursorPos = new Position(getPos(clientPos.x - cameraPosition.x), getPos(clientPos.y - cameraPosition.y));;
    
    let globalCellPos = cursorPos.convertToGlobalCellPosition();
    let chunkPos = globalCellPos.convertToChunkPosition();
    let cellPos = globalCellPos.convertToLocalCellPosition();

    field.draw();


    if (debug) {
        field.context.fillStyle = "red";
        field.context.strokeStyle = "red";
        field.context.strokeRect(cursorPos.x + cameraPosition.x, cursorPos.y + cameraPosition.y, size * zoom, size * zoom);

        field.context.fillText(`x: ${globalCellPos.x} y: ${globalCellPos.y}`, cursorPos.x + cameraPosition.x, cursorPos.y + cameraPosition.y+(40*zoom));
        field.context.fillText(`x: ${chunkPos.x} y: ${chunkPos.y}`, cursorPos.x + cameraPosition.x, cursorPos.y + cameraPosition.y+40+(40*zoom));
        field.context.fillText(`x: ${cellPos.x} y: ${cellPos.y}`, cursorPos.x + cameraPosition.x, cursorPos.y + cameraPosition.y+80+(40*zoom));
    }
};

function mouseup(event) {
    isMouseClicked = false;
    let mousePos = new Position(event.clientX, event.clientY);

    if (mousePos.x !== mouseStartPos.x || mousePos.y !== mouseStartPos.y || isMouseDragged) {
        return;
    }

    function getPos(n) {
        return Math.floor(n / (size + gap) / zoom) * getTileSize();
    }

    let clientPos;
    if (event.touches) {
        clientPos = lastTouchPos;
    } else {
        clientPos = new Position(event.clientX, event.clientY);
    }
    let cursorPos = new Position(getPos(clientPos.x - cameraPosition.x), getPos(clientPos.y - cameraPosition.y));
    let globalCellPos = cursorPos.convertToGlobalCellPosition();
    
    field.countCellNumber(globalCellPos);

    let touchEndTime = new Date().getTime();
    let touchTime = touchEndTime - touchStartTime;

    let isLongTouch = touchTime > 300;
    // console.log(touchStartTime, touchEndTime);
    // console.log(touchTime, isLongTouch);

    if (event.button === 2 || event.ctrlKey || isLongTouch) {
        field.setFlag(globalCellPos);
    } else {
        field.openCellWithFlags(globalCellPos);
    }

    field.draw();
};

function mousedown(event) {
    if (event.touches) {
        lastTouchPos = new Position(event.touches[0].clientX, event.touches[0].clientY);
        touchStartTime = new Date().getTime();
    }

    isMouseDragged = false;
    isMouseClicked = true;

    if (event.touches) {
        dragPrevPos = new Position(event.touches[0].clientX, event.touches[0].clientY);
    } else {
        dragPrevPos = new Position(event.clientX, event.clientY)
    }

    mouseStartPos = dragPrevPos;
}

// Mouse
this.field.addEventListener("mousedown", mousedown);

this.field.addEventListener("mousemove", mousemove);

this.field.addEventListener("mouseup", mouseup);
this.field.addEventListener("mouseleave", mouseup);
this.field.addEventListener("mouseout", mouseup);

// Touch
this.field.addEventListener("touchstart", mousedown);

this.field.addEventListener("touchmove", mousemove);

this.field.addEventListener("touchend", mouseup);
this.field.addEventListener("touchcancel", mouseup);
