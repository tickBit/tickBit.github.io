const birdNames = ["Parrot", "Crow", "Magpie", "Eagle", "Hawk", "Duck", "Starling", "Waxwing", "Bullfinch", "Jay"];
var birdName = "";

window.onload = function() {
    
    var birdIndex = 0;

    let pos = 0;
    
    // Begin: print the first bird name
    birdName = getBirdName(0);
    document.getElementById("bird-name").textContent = birdName;

    // keydown event for the window
    window.addEventListener("keydown", (event) => {

        // check if the pressed key represents the character at pos, that is:
        // in the beginning or end of the bird string
        if (event.key.toString() == birdName.toLowerCase().charAt(pos).toString()) {

            birdName = removeChar(birdName.toLowerCase(), event.key.toLowerCase().toString());
            if (pos == 0) pos = birdName.length - 1; else pos = 0;

        }

        // if the bird string is empty, get next bird name or restart
        if (birdName.length == 0) {
            if (birdIndex < 9) birdIndex++; else birdIndex = 0;
            birdName = getBirdName(birdIndex);
            pos = 0;

        }

        // print the bird name to screen
        document.getElementById("bird-name").textContent = birdName;

    });

    // character(s) that represents the pressed key
    function removeChar(birdName, char) {

            char = birdName.charAt(pos);

            birdName = birdName.toLowerCase().replaceAll(char.toString().toLowerCase(), "");            
            
            return birdName;        
    }

    // get the bird name
    function getBirdName(birdIndex) {

        return birdNames[birdIndex];
    }

}