var words = [
    "a.ban.doned	-2",
    "ab.duc.ted	-2",
    "ab.horr.ed	-3",
    "ab.horr.ent	-3",
    "ab.sol.ved	2",
    "ab.sol.ving	2",
    "ab.sor.bed	1",
    "a.bu.sed	-3",
    "a.bused	-3",
    "a.bu.sive	-3",
    "ac.cep.ted	1",
    "ac.cep.ting	1",
    "ac.ci.den.tal	-2",
    "a.ccused	-2",
    "a.ccu.sing	-2",
    "a.cri.mo.nious	-3",
    "ad.mi.red	3",
    "ad.mi.ring	3",
    "ad.mi.tted	-1",
    "ad.mo.nished	-2",
    "a.do.rable	3",
    "a.do.red	3",
    "ad.vanced	1",
    "ad.ven.tu.rous	2",
    "a.ffec.ted	-1",
    "a.ffec.tion	3",
    "a.ffec.tio.nate	3",
    "a.fflic.ted	-1",
    "a.ffron.ted	-1",
    "a.fraid	-2",
    "a.ggra.va.ting	-2",
    "a.ggre.ssive	-2",
    "a.ghast	-2",
    "a.go.nize	-3",
    "a.go.nized	-3",
    "a.gree.able	2",
    "a.gree.ment	1",
    "a.larmed	-2",
    "a.lar.mist	-2",
    "a.lie.na.tion	-2",
    "a.live	1",
    "a.ller.gic	-2",
    "a.lone	-2",
    "a.mazed	2",
    "a.ma.zing	4",
    "am.bi.tious	2",
    "am.bi.va.lent	-1",
    "a.mused	3",
    "an.gry	-3",
    "an.guish	-3",
    "an.gui.shed	-3",
    "a.ni.mo.sity	-2",
    "a.nnoy	-2",
    "a.nnoyed	-2",
    "a.nno.ying	-2",
    "an.ta.go.nis.tic	-2",
    "an.ti.ci.pa.tion	1",
    "an.xi.ety	-2",
    "an.xious	-2",
    "a.pa.the.tic	-3",
    "a.po.ca.lyp.tic	-2",
    "a.po.lo.gize	-1",
    "a.ppa.lled	-2",
    "a.ppa.lling	-2",
    "a.ppeas.ed	2",
    "a.pplau.ded	2",
    "a.pplau.ding	2",
    "a.ppre.cia.ted	2",
    "a.ppre.cia.ting	2",
    "a.ppre.cia.tion	2",
    "a.ppro.val	2",
    "a.ppro.ved	2",
    "ar.dent	1",
    "a.rres.ted	-3",
    "a.rro.gant	-2",
    "a.shamed	-2",
    "ass.	-4",
    "a.ssa.ssi.na.tion	-3",
    "a.sset	2",
    "ass.fu.cking	-4",
    "ass.hole	-4",
    "as.to.nished	2",
    "as.toun.ded	3",
    "a.ttack.ed	-1",
    "a.ttrac.ted	1",
    "a.ttrac.tion	2",
    "au.da.cious	3",
    "au.tho.ri.ty	1",
    "a.ver.ted	-1",
    "a.voi.ded	-1",
    "a.wai.ted	-1",
    "awe.some	4",
    "aw.ful	-3",
    "aw.kward	-2"
]

var current = ["be", "gin"];
var target = current;
var t = 0;
var go = true;
var backCol = 0;
var heat = 0.5;

// function preload() {
//     words = loadStrings("syllables.txt");
// }

function setup() {
    canvas = createCanvas(windowWidth, windowHeight);
    canvas.parent('container');

    textSize(96);
    fill(255, 60);
    noStroke();
}

function draw() {
    if(go) {
        heat = contrast( noise(1, t*0.001), 2 );

        if(t % int(heat*50+10) == 1) {
            if( compare(current, target) || int(random(heat*50+10)) == 1 ) {
                let t1 = words[int(random(words.length))];
                let t2 = t1.split('\t');
                target = t2[0].split('.');
                console.log("T--", t2);
            }
            if(! compare(current, target)){
                let n;
                if(target.length > current.length) {
                    n = int(random(target.length));
                    current.splice(n, 0, target[n]);
                } else if(target.length < current.length) {
                    n = int(random(current.length));
                    current.splice(n, 1);
                } else {
                    do{ n = int(random(current.length)) } while (current[n] == target[n]);
                    current.splice(n, 1, target[n]);
                }
            }

            console.log(current.join(''), heat);
        }

        background(backCol);
        let wrd = current.join('');
        let wrdW = textWidth(wrd);
        for(let i=0; i<5; i++) {
            let off = [ (noise(i+2, t*0.001)-0.5) * (heat*80), (noise(i+8, t*0.001)-0.5) * (heat*80) ];
            text(wrd, width/2 - wrdW/2 + off[0], height/2 + off[1]);
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

function keyTyped() {
    if (document.activeElement === document.getElementById('editor-area')) return;

    if (key === ' ') {
        go = !go;
        console.log("go", go);
    }
    // uncomment to prevent any default behavior
    return false;
}
