var maxA = 100;
var freq = 60;
var damp = 0.95;
var fontSz = 60;

var nodes = [], open = [];
var dat, starts, atoms, keys;
var t;
var reset = true, go = true;

function preload() {
    dat = loadJSON("data/net_atoms.json");

}

function setup() {
    canvas = createCanvas(windowWidth, windowHeight);
    canvas.parent('container');
    frameRate(30);

    starts = dat.starts;
    atoms = dat.atoms;
    //keys = Object.keys(atoms);
    t = 0;

    textSize(fontSz);
    fill(255, 128);
    stroke(255, 255);
    strokeWeight(3);
}

function draw() {
    if(! go) return;

    if(reset) {
        nodes = [];
        //num = 0;

        reset = false;
    }

    background(0);

    let a, b, d, dif = createVector();
    let temp = [];
    for (let i=0; i<nodes.length; i++) {
        a = nodes[i];
        stroke(60, 255);
        for (let j=i+1; j<nodes.length; j++) {
            b = nodes[j];
            dif.set( b.pos.x - a.pos.x, b.pos.y - a.pos.y );
            d = dif.mag();

            if ( a.kids.indexOf(b) != -1 || b.kids.indexOf(a) != -1 ) {
                line(a.pos.x, a.pos.y, b.pos.x, b.pos.y);
                //dif.setMag( (d-(a.sz*a.life+b.sz*b.life)*0.8) * 0.01 );
                //dif.setMag( (d-(a.sz+b.sz)*0.8) * 0.01 );
                dif.setMag( (d-((a.sz*0.5 + a.sz*0.5*a.life) + (b.sz*0.5 + b.sz*0.5*b.life))*0.8) * 0.01 );
            } else {
                dif.setMag( -500 / max(d*d, 0.001) );
            }

            a.vel.add( dif );
            b.vel.sub( dif );
        }
        noStroke();
        a.step();
        if(a.life > 0.01) temp.push(a);
        else if(open.indexOf(a) >= 0) open.splice(open.indexOf(a), 1)
    }
    nodes = [...temp];

    t++;
    if(t % freq == 0 && nodes.length < maxA) addNode();

}

class Node {
    constructor(tx) {
        this.tx = tx;
        this.sz = textWidth(tx)
        this.h = textAscent(tx)*0.8;
        this.pos = createVector(random(width),random(height));
        this.prev = this.pos.copy();
        this.vel = createVector();
        this.dad = null;
        this.kids = [];
        this.life = 1;
    }

    step() {
        this.vel.add( (width/2-this.pos.x)/2000, (height/2-this.pos.y)/2000 );
        this.pos.add( this.vel );
        this.vel.mult( damp );

        //ellipse(this.pos.x, this.pos.y, 16, 16);
        fill(255, 255*this.life);
        textSize(fontSz*0.5 + fontSz*0.5*this.life);
        text(this.tx, this.pos.x-this.sz/2, this.pos.y+this.h/2);

        this.prev.set( this.pos );
        this.life -= 1/2000;


    }
}

function addNode() {
    let tx, old, neu;
    if(open.length == 0) {
        /*do{
            tx = pick(keys)
        } while ( atoms[tx].length == 0 );*/
        neu = new Node(pick(starts));
    } else {
        old = pick(open);
        let tx = '';
        do{
            tx = pick(atoms[old.tx])
        } while ( old.kids.findIndex(o => o.tx == tx) >= 0 );
        neu = new Node(tx);
        old.kids.push(neu);
        neu.dad = old;
        if(old.dad != null) {
            neu.pos.x = old.pos.x + (old.pos.x - old.dad.pos.x) * 2;
            neu.pos.y = old.pos.y + (old.pos.y - old.dad.pos.y) * 2;
        } else {
            neu.pos.x = old.pos.x + random(-100, 100);
            neu.pos.y = old.pos.y + random(-100, 100);
        }

        if(old.kids.length == atoms[old.tx].length) open.splice(open.indexOf(old), 1);
    }

    if(open.length < 10 && atoms.hasOwnProperty(neu.tx) && atoms[neu.tx].length) {
        open.push(neu);
    }

    console.log('ADD++', neu.tx);
    console.log(open);
    /*if(nodes.length > 0) {
        b = nodes[int(random(nodes.length))];
        a.links.push(b);
        b.links.push(a);
    }*/

    nodes.push(neu);
    //num ++;
}

function pick(arr) {
    return arr[arr.length * Math.random() << 0]
}

function keyTyped() {

    if (key === ' ') {
        go = !go;
        console.log("go", go);
    } else if (key === 'a') {
        addNode();
    }
    // uncomment to prevent any default behavior
    return false;
}
