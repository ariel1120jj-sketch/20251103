let bank = [];
let quiz = [];
let current = 0;
let selected = -1;
let locked = false;
let score = 0;
let showResult = false;
let buttons = [];
let confetti = [];
let rain = [];
let w, h;

function setup(){
    w = windowWidth;
    h = windowHeight;
    createCanvas(w, h);
    textFont('Arial');
    frameRate(60);
    bank = [
        {id:1, q:"台灣的首都是哪裡？", a:"台北", b:"台中", c:"高雄", d:"台南", ans:0},
        {id:2, q:"光合作用主要發生在植物的哪個部分？", a:"葉子", b:"根", c:"莖", d:"花", ans:0},
        {id:3, q:"水的沸點（海平面）為何？", a:"90°C", b:"100°C", c:"80°C", d:"120°C", ans:1},
        {id:4, q:"程式語言中常用來迴圈重複執行的是？", a:"if", b:"switch", c:"for", d:"return", ans:2},
        {id:5, q:"地球上最多的氣體是？", a:"氧氣", b:"氮氣", c:"二氧化碳", d:"氫氣", ans:1},
        {id:6, q:"英文 'apple' 的中文是？", a:"香蕉", b:"蘋果", c:"葡萄", d:"梨子", ans:1},
        {id:7, q:"太陽系中最靠近太陽的行星是？", a:"地球", b:"金星", c:"水星", d:"火星", ans:2},
        {id:8, q:"三角形內角和為多少度？", a:"180°", b:"360°", c:"90°", d:"270°", ans:0},
        {id:9, q:"人的血液中運送氧氣的成分是？", a:"血小板", b:"白血球", c:"血紅素", d:"血漿", ans:2},
        {id:10,q:"電腦的中央處理器英文簡稱為？", a:"CPU", b:"GPU", c:"RAM", d:"SSD", ans:0}
    ];
    buttons = [
        {label:"匯出題庫 CSV", x:20, y:20, w:140, h:36, action:exportCSV},
        {label:"開始新測驗", x:180, y:20, w:120, h:36, action:startQuiz},
        {label:"重做此份卷", x:320, y:20, w:120, h:36, action:retryQuiz}
    ];
    startQuiz();
}

function startQuiz(){
    let idx = shuffle(Array.from({length:bank.length}, (v,i)=>i));
    quiz = idx.slice(0,4).map(i => JSON.parse(JSON.stringify(bank[i])));
    current = 0; selected = -1; locked = false; score = 0; showResult = false;
    confetti = []; rain = [];
}

function retryQuiz(){
    current = 0; selected = -1; locked = false; score = 0; showResult = false;
    confetti = []; rain = [];
}

function exportCSV(){
    let lines = [];
    lines.push("id,question,optionA,optionB,optionC,optionD,answerIndex");
    for(let q of bank){
        let line = [
            q.id,
            '"' + q.q.replace(/"/g,'""') + '"',
            '"' + q.a.replace(/"/g,'""') + '"',
            '"' + q.b.replace(/"/g,'""') + '"',
            '"' + q.c.replace(/"/g,'""') + '"',
            '"' + q.d.replace(/"/g,'""') + '"',
            q.ans
        ].join(",");
        lines.push(line);
    }
    saveStrings(lines, 'question_bank.csv');
}

function draw(){
    background(30,34,48);
    drawHeader();
    if(!showResult){
        drawQuestion();
        drawOptions();
    } else {
        drawResult();
    }
    drawParticles();
    drawButtons();
}

function drawHeader(){
    noStroke();
    fill(255);
    textSize(18);
    textAlign(LEFT, CENTER);
    text("互動測驗範例 — 每次隨機抽 4 題", 20, 70);
    textSize(12);
    fill(200);
    text("第 " + (current+1) + " / " + (quiz.length) + " 題", 20, 92);
}

function drawQuestion(){
    let q = quiz[current];
    push();
    fill(255);
    textSize(20);
    textAlign(LEFT, TOP);
    text(q.q, 40, 120, width-80);
    pop();
}

function drawOptions(){
    let q = quiz[current];
    let opts = [q.a, q.b, q.c, q.d];
    let ox = width / 2 - 200, oy = height / 2 - 120, oh = 60, gap = 12;
    for(let i=0;i<4;i++){
        let x = ox, y = oy + i*(oh+gap), wi = 400;
        let hovering = mouseX > x && mouseX < x+wi && mouseY > y && mouseY < y+oh;
        stroke(100);
        if(locked){
            if(i === q.ans) fill(100,200,120);
            else if(i === selected) fill(240,120,120);
            else fill(50);
        } else {
            fill(hovering? color(70,130,220) : 60);
        }
        rect(x,y,wi,oh,8);
        fill(255);
        noStroke();
        textSize(16);
        textAlign(LEFT, CENTER);
        text(String.fromCharCode(65+i)+". "+opts[i], x+12, y+oh/2);
    }
}

function mousePressed(){
    for(let b of buttons){
        if(mouseX > b.x && mouseX < b.x+b.w && mouseY > b.y && mouseY < b.y+b.h){
            b.action();
            return;
        }
    }
    if(showResult) return;
    let ox = width / 2 - 200, oy = height / 2 - 120, oh = 60, gap = 12, wi = 400;
    for(let i=0;i<4;i++){
        let x = ox, y = oy + i*(oh+gap);
        if(mouseX > x && mouseX < x+wi && mouseY > y && mouseY < y+oh){
            if(!locked){
                selected = i;
                locked = true;
                if(i === quiz[current].ans){
                    score++;
                }
                setTimeout(()=>{ 
                    current++;
                    selected = -1;
                    locked = false;
                    if(current >= quiz.length){
                        finishQuiz();
                    }
                }, 900);
            }
        }
    }
}

function finishQuiz(){
    showResult = true;
    let pct = score / quiz.length;
    if(pct >= 0.75){
        for(let i=0;i<200;i++){
            confetti.push(new Confetti(random(width), random(-200,0), random(-2,2), random(2,6), color(random(50,255),random(50,255),random(50,255))));
        }
    } else {
        for(let i=0;i<250;i++){
            rain.push(new Drop(random(width), random(-400,0), random(4,10)));
        }
    }
}

function drawResult(){
    push();
    fill(255);
    textSize(28);
    textAlign(CENTER, TOP);
    text("測驗結果", width/2, 120);
    textSize(22);
    text(score + " / " + quiz.length, width/2, 170);
    let pct = score / quiz.length;
    let msg = "";
    if(pct === 1) msg = "完美！非常棒！";
    else if(pct >= 0.75) msg = "很好，繼續保持！";
    else if(pct >= 0.5) msg = "還行，但有進步空間。";
    else msg = "建議再多練習，試著重做一次。";
    textSize(18);
    fill(200);
    text(msg, width/2, 210);
    noStroke();
    fill(60);
    rect(width/2 - 200, 260, 400, 28, 8);
    fill(80,200,120);
    let wbar = map(score, 0, quiz.length, 0, 400);
    rect(width/2 -200, 260, wbar, 28, 8);
    pop();
}

function drawButtons(){
    for(let b of buttons){
        stroke(200);
        strokeWeight(1);
        fill(40);
        rect(b.x, b.y, b.w, b.h, 6);
        noStroke();
        fill(255);
        textAlign(CENTER, CENTER);
        textSize(14);
        text(b.label, b.x + b.w/2, b.y + b.h/2);
    }
}

function drawParticles(){
    for(let i = confetti.length-1; i>=0; i--){
        confetti[i].update();
        confetti[i].draw();
        if(confetti[i].y > height + 50) confetti.splice(i,1);
    }
    for(let i = rain.length-1; i>=0; i--){
        rain[i].update();
        rain[i].draw();
        if(rain[i].y > height + 50) rain.splice(i,1);
    }
}

class Confetti{
    constructor(x,y, vx, vy, col){
        this.x=x; this.y=y; this.vx=vx; this.vy=vy; this.col=col;
        this.r=random(4,8); this.rot=random(TWO_PI); this.vr=random(-0.1,0.1);
    }
    update(){
        this.x += this.vx;
        this.y += this.vy;
        this.vy += 0.08;
        this.rot += this.vr;
    }
    draw(){
        push();
        translate(this.x, this.y);
        rotate(this.rot);
        noStroke();
        fill(this.col);
        rect(-this.r/2, -this.r/2, this.r, this.r*0.6);
        pop();
    }
}

class Drop{
    constructor(x,y, len){
        this.x=x; this.y=y; this.len=len; this.vy=random(4,10);
    }
    update(){
        this.y += this.vy;
        this.vy += 0.2;
    }
    draw(){
        stroke(120,160,255);
        strokeWeight(2);
        line(this.x, this.y, this.x, this.y + this.len);
    }
}