var current = ["be", "gin"];
var target = current;
var column = [];
var t = 0;
var go = true;
var backCol = 0;
//var heat = 0.5;
//var mood = 0;
var beat = 30;
var fontSz = 48;
var base;


 function preload() {
     words = loadStrings("data/adjectives.txt");
 }

function setup() {
    canvas = createCanvas(windowWidth, windowHeight);
    canvas.parent('container');
    frameRate(30);

    base = [100, 100+fontSz];

    textSize(fontSz);
    fill(255, 255);
    noStroke();
}

function draw() {
    if(go) {
        //heat = contrast( noise(1, t*0.001), 2 );

        if(t % int(beat) == 0) {
            let w = current.join('');
            column.push(w);

            let op = "non";
            ix = -1
            if( compare(current, target) || int(random(30)) == 1 ) {
                let t1 = words[int(random(words.length))];
                let t2 = t1.split('\t');
                target = t2[0].split('.');
                if(target[target.length-1].length == 0) target.pop();

                //console.log("T--", target.join('.'));
            }
            if(! compare(current, target)){
                old = [...current];

                if( int(random(5)) == 1 && w.length < 36 ) {
                    ix = int(random(target.length));
                    current.splice(int(random(current.length)), 0, target[ix]);
                    op = "rnd"+ix;

                } else if( int(random(20)) == 1 && w.length < 36 ) {
                    ix = int(random(current.length));
                    current.splice(ix, 0, current[ix]);
                    op = "dup";

                } else if(target.length > current.length) {
                    ix = int(random(target.length));
                    current.splice(ix, 0, target[ix]);
                    op = "add";

                } else if(target.length < current.length) {
                    ix = int(random(current.length));
                    current.splice(ix, 1);
                    op = "sub";

                } else {
                    do{ ix = int(random(current.length)) } while (current[ix] == target[ix]);
                    current.splice(ix, 1, target[ix]);
                    op = "swp";

                }
            }

            //console.log(w, op, column.length);
        }

        background(backCol);
        //rotate(-0.2);
        let x = (t % beat) / beat;
        fill(255, ease("simple", x, -2) * 255);
        text(current.join(''), base[0], base[1]);

        fill(255, 255);

        let n = 0, pos;
        for(let i = column.length-1; i>=0; i--) {
            //pos = base[1] - (fontSz*1.2 * n + fontSz*1.2 * ease("simple", x, 1));
            //pos = base[1] + (fontSz*1.2 * (n + x));
            //rotate(heat * -0.05);
            pos = base[1] + (fontSz*1.2 * (n + ease("simple", x, -6)));
            //fill(255, 255 * (1-pos/height));//i/column.length);
            text( column[i], base[0], pos );
            n ++;

            if(i == 0 && pos > height*1.1) column.shift();
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
    if (key === ' ') {
        go = !go;
        //console.log("go", go);
    }
    // uncomment to prevent any default behavior
    return false;
}
