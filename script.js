// Add this at the start of your file
function resizeCanvas() {
    const container = document.querySelector('.container');
    const canvas = document.getElementById('starsCanvas');
    canvas.width = container.offsetWidth;
    canvas.height = container.offsetHeight;
}

// Add event listener for window resize
window.addEventListener('resize', resizeCanvas);

// Call once on load
window.addEventListener('load', () => {
    resizeCanvas();
    // ...rest of your initialization code
    animateStars();
});

// Starry background with hidden eggs
const canvas = document.getElementById('starsCanvas');
const ctx = canvas.getContext('2d');
const stars = [];
const eggs = [];
const sparkles = [];
const treasures = [
    "✨ Patience",
    "🌟 Focus",
    "💫 Humor",
    "⭐ Sweetness",
    "🌠 Steadiness",
    "✨ Light",
    "💫 Wisdom",
    "⭐ Peace",
    "🌟 Resourceful",
    "✨ Kindness"
];

const foundTreasureIndices = [];

let eggsFound = 0;
const eggsToWin = 10;
let currentMessage = "Welcome to the Cosmic Egg Hunt! Find 10 eggs to unlock a special Cosmic Insight. Love, Vibe Coding Mama 💖";
let messageType = 'normal'; // 'normal' or 'win'
let gameOver = false; // Flag to indicate the hunt has ended
let messageTimer = null; // Timer to control message display duration

// Initialize stars
for (let i = 0; i < 100; i++) {
    stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 2,
        opacity: Math.random(),
        speed: Math.random() * 0.02 + 0.01,
        isEgg: false
    });
}

// Initialize the first few eggs immediately
for (let i = 0; i < 3; i++) {
    spawnNewEgg();
}

let eggsToSpawn = 7;
let eggSpawnInterval = setInterval(function() {
    if (eggsToSpawn > 0 && !gameOver) {
        spawnNewEgg();
        eggsToSpawn--;
        clearInterval(eggSpawnInterval);
        if (eggsToSpawn > 0) {
            eggSpawnInterval = setInterval(arguments.callee, Math.random() * 2000 + 1000); // Random interval between 1 and 3 seconds
        }
    } else {
        clearInterval(eggSpawnInterval);
    }
}, 3000); // Reduced to 3 seconds

// Function to spawn a new egg
function spawnNewEgg() {
    let attempts = 0;
    let foundValidStar = false;
    let eggIndex;
    
    // Try to find a star that isn't already an egg
    while (!foundValidStar && attempts < 100) {
        eggIndex = Math.floor(Math.random() * stars.length);
        if (!stars[eggIndex].isEgg) {
            foundValidStar = true;
        }
        attempts++;
    }
    
    if (foundValidStar) {
        stars[eggIndex].isEgg = true;
        stars[eggIndex].radius = 6;
        stars[eggIndex].color = "hsl(" + (Math.random() * 360) + ", 70%, 60%)";
        stars[eggIndex].found = false;
        eggs.push(stars[eggIndex]);
    } else {
        // If we couldn't find an unused star after 100 attempts, create a new one
        const newEgg = {
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            radius: 6,
            color: "hsl(" + (Math.random() * 360) + ", 70%, 60%)",
            isEgg: true,
            found: false
        };
        stars.push(newEgg);
        eggs.push(newEgg);
    }
}

// Function to respawn a single egg
function respawnEgg(egg) {
    if (gameOver) return; // Don’t respawn if the game is over
    egg.x = Math.random() * canvas.width;
    egg.y = Math.random() * canvas.height;
    egg.color = "hsl(" + (Math.random() * 360) + ", 70%, 60%)";
    egg.found = false;
}

// Sparkle effect for win
function createSparkles() {
    for (let i = 0; i < 20; i++) {
        sparkles.push({
            x: canvas.width / 2,
            y: canvas.height / 2,
            radius: Math.random() * 3 + 1,
            speedX: (Math.random() - 0.5) * 5,
            speedY: (Math.random() - 0.5) * 5,
            opacity: 1,
            life: 100
        });
    }
}

function animateSparkles() {
    sparkles.forEach(function(sparkle, index) {
        sparkle.x += sparkle.speedX;
        sparkle.y += sparkle.speedY;
        sparkle.opacity -= 0.02;
        sparkle.life--;

        if (sparkle.life <= 0) {
            sparkles.splice(index, 1);
            return;
        }

        ctx.beginPath();
        ctx.arc(sparkle.x, sparkle.y, sparkle.radius, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(255, 215, 0, " + sparkle.opacity + ")";
        ctx.fill();
    });
}

function animateStars() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    stars.forEach(function(star) {
        if (!star.isEgg || (star.isEgg && !star.found)) {
            star.opacity += star.speed;
            if (star.opacity > 1 || star.opacity < 0) {
                star.speed = -star.speed;
            }

            ctx.beginPath();
            ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
            if (star.isEgg) {
                ctx.shadowBlur = 10;
                ctx.shadowColor = star.color;
                ctx.fillStyle = star.color;
                ctx.fill();
                ctx.beginPath();
                ctx.arc(star.x, star.y, star.radius / 3, 0, Math.PI * 2);
                ctx.fillStyle = "rgba(255, 255, 0.5)";
                ctx.fill();
            } else {
                ctx.fillStyle = "rgba(255, 255, 255, " + star.opacity + ")";
                ctx.fill();
            }
            ctx.shadowBlur = 0;
        }
    });

    animateSparkles();

    if (!gameOver) {
        ctx.font = "16px Arial";
        ctx.fillStyle = "#fff";
        ctx.textAlign = "left";
        ctx.fillText("Eggs Found: " + eggsFound + " / " + eggsToWin, 10, 30);
    }

    ctx.font = messageType === "win" ? "24px Arial" : "18px Arial";
    ctx.fillStyle = messageType === "win" ? "#ffd700" : "#fff";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    const lines = wrapText(currentMessage, 700);
    lines.forEach(function(line, index) {
        ctx.fillText(line, canvas.width / 2, canvas.height - 70 + (index * 20));
    });

    requestAnimationFrame(animateStars);
}

function wrapText(text, maxWidth) {
    const words = text.split(" ");
    const lines = [];
    let currentLine = words[0];

    for (let i = 1; i < words.length; i++) {
        const testLine = currentLine + " " + words[i];
        const metrics = ctx.measureText(testLine);
        if (metrics.width > maxWidth) {
            lines.push(currentLine);
            currentLine = words[i];
        } else {
            currentLine = testLine;
        }
    }
    lines.push(currentLine);
    return lines;
}

// Click detection for eggs
canvas.addEventListener("click", function(e) {
    if (gameOver) return; // Disable clicks after the game ends

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const mouseX = (e.clientX - rect.left + window.scrollX) * scaleX;
    const mouseY = (e.clientY - rect.top + window.scrollY) * scaleY;

    eggs.forEach(function(egg) {
        if (egg.found) return;
        const dist = Math.sqrt((mouseX - egg.x) * (mouseX - egg.x) + (mouseY - egg.y) * (mouseY - egg.y));
        if (dist < egg.radius + 10) {
            egg.found = true;
            eggsFound++;
            const orb = document.getElementById("insightOrb");

            if (eggsFound >= eggsToWin) {
                currentMessage = "Congratulations! You've found 10 cosmic eggs! Click the Cosmic Insight orb for a special message! 🌟";
                messageType = "win";
                orb.classList.add("show");
                createSparkles();
                gameOver = true; 
                eggs.forEach(function(egg) {
                    egg.found = true;
                });
            } else {
                // Find an unused treasure
                let randomIndex;
                do {
                    randomIndex = Math.floor(Math.random() * treasures.length);
                } while (foundTreasureIndices.includes(randomIndex) && foundTreasureIndices.length < treasures.length);
                
                foundTreasureIndices.push(randomIndex);
                const randomTreasure = treasures[randomIndex];
                
                // Display the treasure message
                currentMessage = "You found a cosmic egg! Treasure: " + randomTreasure;
                messageType = "normal";
                if (messageTimer) clearTimeout(messageTimer);
                messageTimer = setTimeout(function() {
                    currentMessage = "Welcome to the Cosmic Egg Hunt! Find " + (eggsToWin - eggsFound) + " more eggs!";
                    messageType = "normal";
                }, 2000);
                
                // No respawn for the last egg
            }
        }
    });
});

// Orb functionality
document.addEventListener("DOMContentLoaded", function() {
    const orb = document.getElementById("insightOrb");

    orb.addEventListener("click", function() {
        if (messageTimer) clearTimeout(messageTimer);
        currentMessage = "Sweet Souls, you are brighter than any star! These virtues are the universe reflecting back who you truly are! 💫";
        messageType = "win";
        orb.classList.remove("show");
        
        messageTimer = setTimeout(function() {
            currentMessage = "Game Complete! With love, Vibe Coding Mama 💖";
            messageType = "normal";
        }, 4000); // Show final message for 4 seconds
    });
});