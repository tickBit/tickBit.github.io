// De Vaja exercise 2

var category = "";

// wait until the page is loaded
window.onload = function() {
    
    // at the beginning of the program the current contents of local storage are read
    // a bit clumsy code... but it works :-)
    printTheCurrentLocalStorage();

    window.addEventListener('storage', updateFromStorage, false);
  
    // handle save button
    document.getElementById('save').addEventListener('click', function(e) {
        e.preventDefault();

        let question = document.getElementById('question').value;
        category = document.querySelector('input[name="category"]:checked').id;

        let date = Date.now();

        // saving format: key == timestamp, value == category@question
        window.localStorage.setItem(date, category + "@" + question);

        window.dispatchEvent(new Event("storage"));
    });


    // update question category from local storage
    function updateFromStorage() {

        let lista;

        switch (category) {
            case "HTML":
               lista = document.getElementById("htmlCat");
               break;
            case "CSS":
               lista = document.getElementById("cssCat");
               break;
            case "JS":
                lista = document.getElementById("jsCat");
                break;
            }

        // remove old items from current category
        while (lista.firstChild) {
            lista.removeChild(lista.firstChild);
        }

        // get the timestamps, that is: the key, for a category
        let times = Object.keys(window.localStorage);

        // sort the keys, latest entries first
        times.sort((a, b) => {
            return b - a;
        });

        // insert items...
        for (let key of times) {
            let item = localStorage.getItem(key);
            let el = this.document.createElement("textNode");
            el.textContent = item.split("@")[1];
            
            if (item.split("@")[0] == category) {
                lista.appendChild(el);
                lista.appendChild(document.createElement("br"));
            }
        }
    }

    //
    // handle UI buttons
    //
    
    document.getElementById("add").addEventListener("click", function(e) {
        e.preventDefault();
        document.getElementById("questions").style.display = "block";
    });

    document.getElementById("cancel").addEventListener("click", function (e) {
        e.preventDefault();
        document.getElementById("questions").style.display = "none";
    });

    let checkbox1 = document.getElementById("checkboxhtml");
    checkbox1.addEventListener('change', function() {
        if (this.checked) {
            
            document.getElementById("htmlCat").style.display = "block";
        }
        else {
            document.getElementById("htmlCat").style.display = "none";
        }

    });

    let checkbox2 = document.getElementById("checkboxcss");
    checkbox2.addEventListener('change', function() {
        if (this.checked) {
            
            document.getElementById("cssCat").style.display = "block";
        }
        else {
            document.getElementById("cssCat").style.display = "none";
        }

    });
   
    let checkbox3 = document.getElementById("checkboxjs");
    checkbox3.addEventListener('change', function() {
        if (this.checked) {
            
            document.getElementById("jsCat").style.display = "block";
        }
        else {
            document.getElementById("jsCat").style.display = "none";
        }

    });

    // category is global variable, below code is a bit clumsy way to update categories at the begining of program
    function printTheCurrentLocalStorage() {

        category = "HTML";
        updateFromStorage()
        category = "CSS";
        updateFromStorage()
        category = "JS";
        updateFromStorage()

    }
}

