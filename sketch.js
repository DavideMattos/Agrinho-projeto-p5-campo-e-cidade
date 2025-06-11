let balance = 50;
let isCityView = false;
let particles = [];
let crops = [];
let buildings = [];
let bgColor;

function setup() {
    bgColor = color(240, 240, 245);
    let canvas = createCanvas(800, 500);
    canvas.parent('canvas-container');
    
    // Configura o controle deslizante
    const balanceSlider = select('#balance');
    balanceSlider.input(() => {
        balance = parseInt(balanceSlider.value());
        generateEnvironment();
    });
    
    // Configura o botão de alternar vista
    const toggleBtn = select('#toggle-view');
    toggleBtn.mousePressed(() => {
        isCityView = !isCityView;
        generateEnvironment();
    });
    
    generateEnvironment();
}

function generateEnvironment() {
    // Limpa arrays
    particles = [];
    crops = [];
    buildings = [];
    
    // Cria partículas baseadas no equilíbrio
    for (let i = 0; i < 100; i++) {
        particles.push(new Particle());
    }
    
    // Cria plantações ou prédios baseados no equilíbrio
    if (!isCityView || balance < 30) {
        // Modo campo ou equilíbrio para o campo
        for (let i = 0; i < 20; i++) {
            crops.push(new Crop());
        }
    }
    
    if (isCityView || balance > 70) {
        // Modo cidade ou equilíbrio para a cidade
        for (let i = 0; i < 15; i++) {
            buildings.push(new Building());
        }
    }
}

function draw() {
    background(bgColor);
    
    // Desenha o céu
    drawSky();
    
    // Desenha o horizonte
    drawHorizon();
    
    // Desenha elementos baseados no modo
    if (isCityView) {
        drawCityElements();
    } else {
        drawCountrysideElements();
    }
    
    // Desenha partículas
    for (let p of particles) {
        p.update();
        p.display();
    }
    
    // Desenha UI
    drawUI();
}

function drawSky() {
    // Gradiente do céu
    let c1 = color(135, 206, 235); // azul claro
    let c2 = color(25, 25, 112); // azul escuro
    
    for (let y = 0; y < height/2; y++) {
        let inter = map(y, 0, height/2, 0, 1);
        let c = lerpColor(c1, c2, inter);
        stroke(c);
        line(0, y, width, y);
    }
}

function drawHorizon() {
    // Linha do horizonte
    stroke(50);
    strokeWeight(2);
    line(0, height/2, width, height/2);
    
    // Efeito de transição campo-cidade
    noStroke();
    let transitionWidth = map(balance, 0, 100, 0, width);
    fill(34, 139, 34, 150); // verde campo
    rect(0, height/2, transitionWidth, height/2);
    fill(70, 70, 70, 150); // cinza cidade
    rect(transitionWidth, height/2, width - transitionWidth, height/2);
}

function drawCountrysideElements() {
    // Sol
    fill(255, 255, 0);
    noStroke();
    ellipse(width * 0.2, height * 0.25, 60, 60);
    
    // Nuvens
    drawCloud(width * 0.6, height * 0.2, 1.0);
    drawCloud(width * 0.3, height * 0.15, 0.8);
    drawCloud(width * 0.8, height * 0.25, 1.2);
    
    // Plantações
    for (let crop of crops) {
        crop.display();
    }
}

function drawCityElements() {
    // Lua
    fill(220, 220, 220);
    noStroke();
    ellipse(width * 0.8, height * 0.25, 50, 50);
    
    // Estrelas
    if (isCityView) {
        for (let i = 0; i < 50; i++) {
            let x = random(width);
            let y = random(height * 0.4);
            let size = random(1, 3);
            fill(255, 255, random(200, 255));
            ellipse(x, y, size, size);
        }
    }
    
    // Prédios
    for (let building of buildings) {
        building.display();
    }
}

function drawCloud(x, y, scale) {
    fill(255, 255, 255, 200);
    noStroke();
    ellipse(x, y, 50 * scale, 40 * scale);
    ellipse(x + 25 * scale, y - 5 * scale, 40 * scale, 30 * scale);
    ellipse(x + 45 * scale, y, 50 * scale, 30 * scale);
    ellipse(x - 20 * scale, y + 5 * scale, 40 * scale, 30 * scale);
}

function drawUI() {
    // Mostra o equilíbrio atual
    fill(0);
    noStroke();
    textSize(16);
    textAlign(LEFT);
    text(`Equilíbrio: ${balance}% campo - ${100-balance}% cidade`, 20, 30);
    
    // Mostra o modo atual
    textAlign(RIGHT);
    text(`Modo: ${isCityView ? 'Cidade' : 'Campo'}`, width - 20, 30);
}

// Classes dos elementos

class Particle {
    constructor() {
        this.x = random(width);
        this.y = random(height);
        this.size = random(2, 5);
        this.speed = random(1, 3);
        this.color = color(random(100, 255), random(100, 255), random(100, 255), 150);
        this.direction = random([-1, 1]);
    }
    
    update() {
        this.x += this.speed * this.direction;
        this.y += random(-0.5, 0.5);
        
        if (this.x > width + 10) this.x = -10;
        if (this.x < -10) this.x = width + 10;
        if (this.y > height) this.y = 0;
        if (this.y < 0) this.y = height;
    }
    
    display() {
        fill(this.color);
        noStroke();
        ellipse(this.x, this.y, this.size);
    }
}

class Crop {
    constructor() {
        this.x = random(width);
        this.y = random(height/2 + 20, height - 20);
        this.width = random(30, 80);
        this.height = random(20, 50);
        this.color = color(
            random(50, 150),
            random(150, 200),
            random(50, 100)
        );
        this.type = floor(random(3)); // 0: trigo, 1: milho, 2: girassol
    }
    
    display() {
        // Caule
        fill(34, 139, 34);
        rect(this.x - 2, this.y, 4, this.height);
        
        // Plantação
        fill(this.color);
        if (this.type === 0) { // Trigo
            for (let i = 0; i < 5; i++) {
                let yPos = this.y + i * (this.height / 5);
                ellipse(this.x, yPos, this.width * 0.8, 10);
            }
        } else if (this.type === 1) { // Milho
            ellipse(this.x, this.y, this.width, this.height * 0.7);
        } else { // Girassol
            ellipse(this.x, this.y, this.width, this.width);
            fill(255, 204, 0);
            ellipse(this.x, this.y, this.width * 0.6, this.width * 0.6);
        }
    }
}

class Building {
    constructor() {
        this.x = random(width);
        this.width = random(30, 80);
        this.height = random(50, 200);
        this.color = color(
            random(50, 100),
            random(50, 100),
            random(100, 150)
        );
        this.windows = [];
        
        // Cria janelas
        let windowRows = floor(this.height / 30);
        let windowCols = floor(this.width / 15);
        for (let i = 0; i < windowRows; i++) {
            for (let j = 0; j < windowCols; j++) {
                if (random() > 0.3) { // 70% de chance de ter janela
                    this.windows.push({
                        x: j * (this.width / windowCols) + (this.width / windowCols / 2),
                        y: i * (this.height / windowRows) + (this.height / windowRows / 2),
                        lit: random() > 0.5
                    });
                }
            }
        }
    }
    
    display() {
        // Base do prédio
        fill(this.color);
        rect(this.x - this.width/2, height/2 - this.height, this.width, this.height);
        
        // Janelas
        for (let win of this.windows) {
            fill(win.lit ? color(255, 255, 150) : color(50, 50, 70));
            rect(
                this.x - this.width/2 + win.x - 5,
                height/2 - this.height + win.y - 5,
                8, 8
            );
        }
    }
}