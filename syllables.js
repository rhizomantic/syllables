var current = ["be", "gin"];
var target = current;
var old = current;
var actions = [];
var t = 0;
var go = true;
var backCol = 0;
var heat = 0.5;
var mood = 0;
var beat = 80;
var inx , outx;


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
}

function draw() {
    if(go) {
        heat = contrast( noise(1, t*0.001), 2 );


        if(t % int(beat) == 0) {
            let op = "non";
            inx = -1
            outx = -1;
            if( compare(current, target) || int(random(heat*40+15)) == 1 ) {
                let t1 = words[int(random(words.length))];
                let t2 = t1.split('\t');
                mood = parseInt(t2[1]);
                target = t2[0].split('.');
                if(target[target.length-1].length == 0) target.pop();
                //fill(255, (mood+5)*24 + 10)

                console.log("T--", t2.join('.'));
            }
            if(! compare(current, target)){
                old = [...current];
                actions = [];
                let cr, w1 = 0; w2 = 0;
                if( int(random(20)) == 1 ) {
                    inx = int(random(current.length));

                    for(let i=0; i<current.length; i++){
                        actions.push({tx:current[i], p1:w1, p2:w2, act:(w1 != w2 ? "mov" : "no")});
                        cr = textSize(current[i]);
                        w1 += cr;
                        w2 += cr;
                        if(i == inx) {
                            actions.push({tx:current[i], p1:w1, p2:w2, act:"in"});
                            w2 += cr;
                        }
                    }
                    current.splice(inx, 0, current[inx]);
                    op = "dup";

                } else if(target.length > current.length) {
                    inx = int(random(target.length));

                    for(let i=0; i<current.length; i++){
                        actions.push({tx:current[i], p1:w1, p2:w2, act:(w1 != w2 ? "mov" : "no")});
                        cr = textSize(current[i]);
                        w1 += cr;
                        w2 += cr;
                        if(i == inx) {
                            actions.push({tx:target[i], p1:w1, p2:w2, act:"in"});
                            w2 += textSize(target[i]);
                        }
                    }
                    current.splice(inx, 0, target[inx]);
                    op = "add";

                } else if(target.length < current.length) {
                    outx = int(random(current.length));

                    for(let i=0; i<current.length; i++){
                        if(i == inx) {
                            actions.push({tx:current[i], p1:w1, p2:w2, act:"out"});
                            w1 += textSize(current[i]);
                        } else {
                            actions.push({tx:current[i], p1:w1, p2:w2, act:(w1 != w2 ? "mov" : "no")});
                            cr = textSize(current[i]);
                            w1 += cr;
                            w2 += cr;
                        }
                    }
                    current.splice(outx, 1);
                    op = "sub";

                } else {
                    do{ inx = int(random(current.length)) } while (current[inx] == target[inx]);


                    for(let i=0; i<current.length; i++){
                        if(i == inx) {
                            actions.push({tx:current[i], p1:w1, p2:w2, act:"out"});
                            actions.push({tx:target[i], p1:w1, p2:w2, act:"in"});
                            w1 += textSize(current[i]);
                            w2 += textSize(target[i]);
                        } else {
                            actions.push({tx:current[i], p1:w1, p2:w2, act:(w1 != w2 ? "mov" : "no")});
                            cr = textSize(current[i]);
                            w1 += cr;
                            w2 += cr;
                        }
                    }
                    current.splice(inx, 1, target[inx]);
                    outx = inx;
                    op = "swp";

                }
            }

            console.log(current.join(''), op, actions);
            go = false;
            // for(let s of current) {
            //     console.log('-', s);
            // }
        }

        background(backCol);

        /*let pos1 = pos2 = 50;
        let x = (t % beat) / beat;
        let a, w1, w2;
        if(x < 0.5) {
            a = ease("simple", 1-x*2, -4) * 255;
            for(let i = 0; i < old.length; i++) {
                fill(255, i == outx ? a : 255);
                w1 = textWidth(old[i]);
                text(old[i], pos1, height/2);
                pos1 += w1;
            }
        } else {
            a = ease("simple", (x-0.5)*2, -4) * 255;
            for(let i = 0; i < current.length; i++) {
                fill(255, i == inx ? a : 255);
                w1 = i < old.length ? textWidth(old[i]) : 0;
                w2 = textWidth(current[i]);
                let posNow = pos2 != pos1 ? pos2 + ease("simple", x, -2) * (pos1-pos2) : pos2;
                text(current[i], posNow, height/2);
                pos1 += w1;
                pos2 += w2;
            }
        }*/

        let mrg = 50;
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

function keyTyped() {
    if (document.activeElement === document.getElementById('editor-area')) return;

    if (key === ' ') {
        go = !go;
        console.log("go", go);
    }
    // uncomment to prevent any default behavior
    return false;
}
