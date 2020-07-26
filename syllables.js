var current = ["be", "gin"];
var target = current;
var parts = [];
var t = 0;
var go = true;
var backCol = 0;
var beat = 80;



// function preload() {
//     words = loadStrings("syllables.txt");
// }

function setup() {
    canvas = createCanvas(windowWidth, windowHeight);
    canvas.parent('container');
    frameRate(30);
    textSize(96);
    fill(255, 255);
    noStroke();

    parts.push( new Part(' ', null, 'no') );
    parts[0].x = 50;
    parts[0].y = height/2;
    parts.push( new Part('be', parts[0], 'no') );
    parts.push( new Part('gin', parts[1], 'no') );


}

function draw() {
    if(go) {
        //heat = contrast( noise(1, t*0.001), 2 );


        if(t % int(beat) == 0) {
            let op = "non";
            ix = -1

            let tmp = []
            for(let i=0; i<parts.length; i++) {
                if(parts[i].op == "in") parts[i].op = 'no';
                if(parts[i].op != "out") tmp.push(parts[i]);
            }
            parts = [... tmp];

            if( compare(current, target) || int(random(30)) == 1 ) {
                let t1 = words[int(random(words.length))];
                let t2 = t1.split('\t');
                mood = parseInt(t2[1]);
                target = t2[0].split('.');
                if(target[target.length-1].length == 0) target.pop();
                //fill(255, (mood+5)*24 + 10)

                console.log("T--", t2.join('.'));
            }

            if(! compare(current, target)){
                // old = [...current];
                // actions = [];
                // let cr, w1 = 0; w2 = 0;
                if( int(random(10)) == 1 ) {
                    ix = int(random(current.length));

                    parts.splice(ix+1, 0, new Part(current[ix], parts[ix], 'in') );
                    if(parts.length > ix+2) parts[ix+2].a = parts[ix+1];
                    current.splice(ix, 0, current[ix]);
                    op = "dup";

                } else if(target.length > current.length) {
                    ix = int(random(target.length));
                    let ixx = max(ix, current.length-1);

                    parts.splice(ixx+1, 0, new Part(target[ix], parts[ixx], 'in') );
                    if(parts.length > ixx+2) parts[ixx+2].a = parts[ixx+1];
                    current.splice(ixx, 0, target[ix]);
                    op = "add";

                } else if(target.length < current.length) {
                    ix = int(random(current.length));

                    parts[ix+1].op = 'out';
                    if(parts.length > ix+2) parts[ix+2].a = parts[ix];
                    current.splice(ix, 1);
                    op = "sub";

                } else {
                    do{ ix = int(random(current.length)) } while (current[ix] == target[ix]);


                    // for(let i=0; i<current.length; i++){
                    //     if(i == inx) {
                    //         actions.push({tx:current[i], p1:w1, p2:w2, act:"out"});
                    //         actions.push({tx:target[i], p1:w1, p2:w2, act:"in"});
                    //         w1 += textSize(current[i]);
                    //         w2 += textSize(target[i]);
                    //     } else {
                    //         actions.push({tx:current[i], p1:w1, p2:w2, act:(w1 != w2 ? "mov" : "no")});
                    //         cr = textSize(current[i]);
                    //         w1 += cr;
                    //         w2 += cr;
                    //     }
                    // }
                    parts[ix+1].op = 'out';
                    parts.splice(ix+2, 0, new Part(target[ix], parts[ix], 'in') );
                    if(parts.length > ix+3) parts[ix+3].a = parts[ix+2];
                    current.splice(ix, 1, target[ix]);
                    //outx = inx;
                    op = "swp";

                }
            }

            console.log(op, current, parts);
            go = false;
            // for(let s of current) {
            //     console.log('-', s);
            // }
        }

        background(backCol);



        /*let mrg = 50;
        let x = (t % beat) / beat;
        for(let i=0; i<actions.length; i++){
            let a = actions[i];
            if(a.act == "no") {
                text(a.tx, mrg + a.p1, height/2);
            } else if(a.act == "mov") {
                text(a.tx, mrg + (a.p1 + ease("simple", x, 2) * (a.p2-a.p1)), height/2);
            } else if(a.act == "in") {
                fill(255, ease("simple", x, -4) * 255);
                text(a.tx, mrg + a.p1, height/2);
            } else if(a.act == "out") {
                fill(255, ease("simple", 1-x, -4) * 255);
                text(a.tx, mrg + a.p1, height/2);
            }
        }*/

        let x = (t % beat) / beat;
        for(let i=0; i<parts.length; i++){
            let p = parts[i];
            if(p.op == 'in') fill(255, ease("simple", x, -4) * 255);
            else if(p.op == 'out') fill(255, ease("simple", 1-x, -4) * 255);
            else fill(255, 255);

            p.update();
        }

        t++;
    }
}

function compare(a, b) {
    if(a.length != b.length) return false;
    for(let i=0; i<a.length; i++) {
        if(a[i] !== b[i]) return false;
    }
    return true;
}

function contrast(n, f) {
  return constrain(f*(n-0.5) + 0.5, 0, 1);
}

function ease(type, x, p) {
    if(type == "simple") {
        return p < 0 ? 1 - Math.pow(1-x, Math.abs(p)) : Math.pow(x, Math.abs(p));
    } else if (type == "IO") {
        //if(t < 0.5) return easeSimple(t*2, p) * 0.5;
        //else return (1 - easeSimple(1-(t-0.5)*2, p)) * 0.5 + 0.5;
        if(x < 0.5) return (p < 0 ? 1 - Math.pow(1-x*2, Math.abs(p)) : Math.pow(x*2, Math.abs(p))) * 0.5;
        else return (1 - (p < 0 ? 1 - Math.pow(1-(1-(x-0.5)*2), Math.abs(p)) : Math.pow(1-(x-0.5)*2, Math.abs(p)))) * 0.5 + 0.5;
    } else if (type == "hill") {
        x = x < 0.5 ? x * 2 : 1 - (x-0.5)*2;
        return p < 0 ? 1 - Math.pow(1-x, Math.abs(p)) : Math.pow(x, Math.abs(p));
    } else if (type == "sine") {
        return Math.sin(x*p*Math.PI*2) * 0.5 + 0.5;
    } else {
        return x;
    }

}

function pick(...opts) {
    return opts[floor(random(opts.length))];
}

class Part {
    constructor(tx, anchor, op) {
        this.tx = tx;
        this.w = textWidth(tx);
        this.a = anchor;
        this.x = anchor ? anchor.x + anchor.w : 0;
        this.y = anchor ? anchor.y : 0;
        this.op = op;
    }

    update() {
        if(this.a != null) {
            this.x += ((this.a.x+this.a.w) - this.x) / 10;
            this.y += (this.a.y - this.y) / 10;
        }

        text(this.tx, this.x, this.y);
    }
}

function keyTyped() {
    if (document.activeElement === document.getElementById('editor-area')) return;

    if (key === ' ') {
        go = !go;
        console.log("go", go);
    }
    // uncomment to prevent any default behavior
    return false;
}
