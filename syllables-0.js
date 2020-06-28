var current = ["be", "gin"];
var target = current;
var t = 0;
var go = true;
var backCol = 0;
var heat = 0.5;
var mood = 0;


// function preload() {
//     words = loadStrings("syllables.txt");
// }

function setup() {
    canvas = createCanvas(windowWidth, windowHeight);
    canvas.parent('container');

    textSize(96);
    fill(255, 255);
    noStroke();
}

function draw() {
    if(go) {
        heat = contrast( noise(1, t*0.001), 2 );

        if(t % int(heat*30+30) == 1) {
            let n, op = -1;
            if( compare(current, target) || int(random(heat*40+15)) == 1 ) {
                let t1 = words[int(random(words.length))];
                let t2 = t1.split('\t');
                mood = parseInt(t2[1]);
                target = t2[0].split('.');
                //fill(255, (mood+5)*24 + 10)

                console.log("T--", t2);
            }
            if(! compare(current, target)){

                if( int(random(10)) == 1 ) {
                    n = int(random(current.length));
                    current.splice(n, 0, current[n]);
                    op = 0;
                } else if(target.length > current.length) {
                    n = int(random(target.length));
                    current.splice(n, 0, target[n]);
                    op = 1;
                } else if(target.length < current.length) {
                    n = int(random(current.length));
                    current.splice(n, 1);
                    op = 2;
                } else {
                    do{ n = int(random(current.length)) } while (current[n] == target[n]);
                    current.splice(n, 1, target[n]);
                    op = 3;
                }
            }

            background(backCol);
            let wrd = current.join('');


            let off = [0, 0];//[ (noise(2, t*0.001)-0.5) * (heat*80), (noise(8, t*0.001)-0.5) * (heat*80) ];
            let sz = 50 + (mood+5) * 20;//contrast(noise(5.5, t*0.001), 2)  * 200 + 60;
            textSize(sz);
            let wrdW = textWidth(wrd);

            text(wrd, width/2 - wrdW/2 + off[0], height/2 + off[1]);

            console.log(wrd, op, mood, heat);
        }

        /*background(backCol);
        let wrd = current.join('');
        let wrdW = textWidth(wrd);

        let off = [ (noise(2, t*0.001)-0.5) * (heat*80), (noise(8, t*0.001)-0.5) * (heat*80) ];
        let sz = contrast(noise(5.5, t*0.001), 2)  * 200 + 60;

        textSize(sz);
        fill(255, 255);
        text(wrd, width/2 - wrdW/2, height/2);
        fill(255, 60);
        text(wrd, width/2 - wrdW/2 + off[0], height/2 + off[1]);*/

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

function keyTyped() {
    if (document.activeElement === document.getElementById('editor-area')) return;

    if (key === ' ') {
        go = !go;
        console.log("go", go);
    }
    // uncomment to prevent any default behavior
    return false;
}
