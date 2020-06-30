var current = ["be", "gin"];
var target = current;
var old = current;
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

                console.log("T--", t2);
            }
            if(! compare(current, target)){
                old = [...current];
                if( int(random(20)) == 1 ) {
                    inx = int(random(current.length));
                    current.splice(inx, 0, current[inx]);
                    op = "dup";
                } else if(target.length > current.length) {
                    inx = int(random(target.length));
                    current.splice(inx, 0, target[inx]);
                    op = "add";
                } else if(target.length < current.length) {
                    outx = int(random(current.length));
                    current.splice(outx, 1);
                    op = "sub";
                } else {
                    do{ inx = int(random(current.length)) } while (current[inx] == target[inx]);
                    current.splice(inx, 1, target[inx]);
                    outx = inx;
                    op = "rep";
                }
            }

            /*background(backCol);
            let wrd = current.join('');


            let off = [0, 0];//[ (noise(2, t*0.001)-0.5) * (heat*80), (noise(8, t*0.001)-0.5) * (heat*80) ];
            let sz = 50 + (mood+5) * 20;//contrast(noise(5.5, t*0.001), 2)  * 200 + 60;
            textSize(sz);
            let wrdW = textWidth(wrd);

            text(wrd, width/2 - wrdW/2 + off[0], height/2 + off[1]);*/

            console.log(current.join(''), op, inx, outx);
            go = false;
            // for(let s of current) {
            //     console.log('-', s);
            // }
        }

        background(backCol);
        // let wrd = current.join('');
        // let wrdW = textWidth(wrd);
        //
        // text(wrd, 50, height/2);
        let pos1 = pos2 = 50;
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
        }
        //fill(255, a);
        //console.log(inx, outx);


        // for(let i = 0, mx = max(target.length, current.length); i < current.length; i++) {
        //     fill(255, (i == outx && x < 0.5) || (i == inx && x > 0.5) ? a : 255);
        //     let w = textWidth(current[i]);
        //     text(current[i], pos, height/2);
        //     pos += w;
        // }

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
