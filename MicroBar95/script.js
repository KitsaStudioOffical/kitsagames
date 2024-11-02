const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

let progress = 0;
const fallingItems = [];
const gravity = 2;
let progressBarX = 10;
let progressBarY = 50;
const progressBarWidth = 480;
const progressBarHeight = 15;
const segmentCount = 25;
const segmentWidth = progressBarWidth / segmentCount;
let isDragging = false;
const segmentColors = ['blue', 'yellow', 'pink', 'red'];
const caughtSegments = [];
let gameStarted = false;

function createFallingItem() {
    const color = segmentColors[Math.floor(Math.random() * segmentColors.length)];
    const x = Math.random() * (canvas.width - 20);
    fallingItems.push({ x: x, y: -20, width: 20, height: 20, color: color });
}

function update() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = 'black';
    ctx.strokeRect(progressBarX, progressBarY, progressBarWidth, progressBarHeight);
    ctx.fillStyle = 'black';
    ctx.font = '16px Comic Sans MS';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(progress + '%', progressBarX + progressBarWidth / 2, progressBarY + progressBarHeight / 2);

    for (let i = 0; i < caughtSegments.length; i++) {
        ctx.fillStyle = caughtSegments[i].color;
        ctx.fillRect(progressBarX + i * segmentWidth, progressBarY, segmentWidth, progressBarHeight);
    }

    progress = Math.min(caughtSegments.length * 5, 100);

    for (let i = 0; i < fallingItems.length; i++) {
        const item = fallingItems[i];
        item.y += gravity;

        if (item.y + item.height > progressBarY && item.y < progressBarY + progressBarHeight &&
            item.x < progressBarX + progressBarWidth && item.x + item.width > progressBarX) {
            
            const segmentIndex = Math.floor((item.x + item.width / 2 - progressBarX) / segmentWidth);
            
            if (segmentIndex < caughtSegments.length) {
                fallingItems.splice(i, 1);
                i--;
            } else {
                if (item.color === 'red') {
                    alert('Game Over! You caught the red segment.');
                    document.getElementById('redSegmentSound').play();
                    caughtSegments.length = 0;
                    fallingItems.length = 0;
                    continue;
                }

                if (item.color === 'pink') {
                    if (caughtSegments.length > 0) {
                        caughtSegments.pop();
                        document.getElementById('pinkSegmentSound').play();
                    }
                } else {
                    caughtSegments.push({ color: item.color });
                    if (item.color === 'blue') {
                        document.getElementById('blueSegmentSound').play();
                    } else if (item.color === 'yellow') {
                        document.getElementById('yellowSegmentSound').play();
                    }
                }
                fallingItems.splice(i, 1);
                i--;
                continue;
            }
        }

        if (item.y > canvas.height) {
            fallingItems.splice(i, 1);
            i--;
        } else {
            ctx.fillStyle = item.color;
            ctx.fillRect(item.x, item.y, item.width, item.height);
        }
    }

    requestAnimationFrame(update);
}

function startGame() {
    gameStarted = true;
    const overlay = document.getElementById('overlay');
    overlay.remove();
    setInterval(createFallingItem, 2000);
    update();
}

document.getElementById('playButton').addEventListener('click', startGame);

canvas.addEventListener('mousedown', (event) => {
    const mouseX = event.clientX - canvas.getBoundingClientRect().left;
    const mouseY = event.clientY - canvas.getBoundingClientRect().top;

    if (mouseX > progressBarX && mouseX < progressBarX + progressBarWidth &&
        mouseY > progressBarY && mouseY < progressBarY + progressBarHeight) {
        isDragging = true;
    }
});

canvas.addEventListener('mouseup', () => {
    isDragging = false;
});

canvas.addEventListener('mousemove', (event) => {
    if (isDragging) {
        const mouseX = event.clientX - canvas.getBoundingClientRect().left;
        const mouseY = event.clientY - canvas.getBoundingClientRect().top;
        progressBarX = mouseX - progressBarWidth / 2;
        progressBarY = mouseY - progressBarHeight / 2;
    }
});
