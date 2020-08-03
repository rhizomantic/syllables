var atoms = {}, starts = [];
var words;

function preload() {
    words = loadStrings('data/syllables.txt');
}

function setup() {
    canvas = createCanvas(windowWidth, windowHeight);
    canvas.parent('container');
    background("#FFFFFF");

    for(let w of words) {
        let w2 = w.split('	');
        let ps = w2[0].split('.')
        for(let i=0; i<ps.length; i++) {
            if(ps[i].length < 1) continue;
            if(i == 0 && starts.indexOf(ps[i]) < 0) starts.push(ps[i]);

            if(! atoms.hasOwnProperty(ps[i])){
                atoms[ps[i]] = []
            }
            if(i > 0) {
                if(atoms[ps[i-1]].indexOf(ps[i]) == -1) {
                    atoms[ps[i-1]].push(ps[i]);
                }
            }
        }
    }

    //let temp = {};
    for(let [k,v] of Object.entries(atoms)) if(v.length == 0) delete atoms[k];

    //console.log(atoms);
    saveJSON({"starts":starts,"atoms":atoms}, "atoms.json", true);
}

function draw() {

}
