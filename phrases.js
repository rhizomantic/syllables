var curr = ["be", "gin"];
var tgt = curr;
var adj, noun;

var column = [];
var t = 0;
var go = true;
var backCol = 0;
var mood = 0;
var beat = 40;
var beatMin = 5, beatMax = 50;
var fontSz = 96;
var gap = 10;
var base;
var mood;



// function preload() {
//     words = loadStrings("syllables.txt");
// }

function setup() {
    canvas = createCanvas(windowWidth, windowHeight);
    canvas.parent('container');
    frameRate(30);

    base = [50, height*0.8];
    adj = { curr:["be", "gin"], tgt:["be", "gin"], word:'', old:'' };
    noun = { curr:["be", "gin"], tgt:["be", "gin"], word:'', old:'' };
    change(adj);
    change(noun);
    //curr = getWord("adj");
    //console.log("ini", curr, tgt);

    textFont('Courier New');
    textSize(fontSz);
    fill(255, 255);
    noStroke();
}

function draw() {
    if(go) {

        mood = contrast( noise(t*0.03), 2 );

        if(beat == 0) {
            column.push(adj.word +' '+ noun.word);
            //console.log(column);
            if(mood < 0.5) change(adj);
            else change(noun);

            beat = Math.floor( beatMin + (1 - Math.abs(mood-0.5)*2) * (beatMax-beatMin) );
            console.log(mood, beat, adj.word, noun.word);
        }

        background(backCol);

        /*let x = (t % beat) / beat;
        fill(255, ease("simple", x, -2) * 255);
        text(adj.word +' '+ noun.word, base[0], base[1]);

        fill(255, 255);
        let n = 0, pos;
        for(let i = column.length-1; i>=0; i--) {
            pos = base[1] - (fontSz*1.2 * n + fontSz*1.2 * ease("simple", x, -2));
            text( column[i], base[0], pos );
            n ++;

            if(i == 0 && pos < -fontSz) column.shift();
        }*/

        //let x = (t % beat) / beat;
        // fill(255, ease("simple", 1-x, 2) * 255);
        // text(adj.old, width/2 - (textWidth(adj.old)+gap), height/2);
        // text(noun.old, width/2 +gap, height/2);
        // fill(255, ease("simple", x, 2) * 255);
        text(adj.word, width/2 - (textWidth(adj.word)+gap), height/2);
        text(noun.word, width/2 +gap, height/2);

        t++;
        beat --;
    }
}

function change(word) {
    let op = "non";
    ix = -1
    if( compare(word.curr, word.tgt) || int(random(20)) == 1 ) {
        word.tgt = getWord(word);
    }

    if(! compare(word.curr, word.tgt)){

        let cr, w1 = 0; w2 = 0;
        if( int(random(20)) == 1 ) {
            ix = int(random(word.curr.length));
            word.curr.splice(ix, 0, word.curr[ix]);
            op = "dup";

        } else if(word.tgt.length > word.curr.length) {
            ix = int(random(word.tgt.length));
            word.curr.splice(ix, 0, word.tgt[ix]);
            op = "add";

        } else if(word.tgt.length < word.curr.length) {
            ix = int(random(word.curr.length));
            word.curr.splice(ix, 1);
            op = "sub";

        } else {
            do{ ix = int(random(word.curr.length)) } while (word.curr[ix] == word.tgt[ix]);
            word.curr.splice(ix, 1, word.tgt[ix]);
            ix = ix;
            op = "swp";

        }
    }

    word.old = word.word;
    word.word = word.curr.join('');

    console.log(word.word, op);
}

function getWord(word) {
    let t1 = word == noun ? nouns[int(random(nouns.length))] : adjectives[int(random(adjectives.length))];
    out = t1.split('.');
    if(out[out.length-1].length == 0) out.pop();

    console.log("T--", out.join('.'));
    return out;
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
