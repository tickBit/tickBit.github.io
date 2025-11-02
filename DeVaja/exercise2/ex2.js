// De Vaja exercise 2
// In 2025 version, no events of localStorage are listened anymore    

// wait until the page is loaded
window.onload = function() {
    
    var inputHTML = document.getElementById("checkboxhtml");
    var inputCSS = document.getElementById("checkboxcss");
    var inputJS = document.getElementById("checkboxjs");
    
    inputHTML.addEventListener("change", () => {
        document.getElementById("htmlCat").style.display = inputHTML.checked === true ? "block" : "none";
    });
    
    inputCSS.addEventListener("change", () => {
        document.getElementById("cssCat").style.display = inputCSS.checked === true ? "block" : "none";
    });
    
    inputJS.addEventListener("change", () => {
        document.getElementById("jsCat").style.display = inputJS.checked === true ? "block" : "none";
    });
    
    printLocalStorage();

    let formDiv = document.getElementById("the-form");
    let contentDiv = document.getElementById("content");
    let addButton = document.getElementById("add");
    addButton.addEventListener("click", () => {
        formDiv.style.display = "block";
        contentDiv.style = "filter: blur(1.1px);"
        addButton.setAttribute("disabled", true);
    });

    let cancelButton = document.getElementById("cancel");
    cancelButton.addEventListener("click", (e) => {
        e.preventDefault();
        
        addButton.removeAttribute("disabled");
        formDiv.style.display = "none";
        contentDiv.style = "filter: blur(0px);"
    });
    
    let questionForm = document.getElementById("form");
    questionForm.addEventListener("submit", (e) => {
        e.preventDefault();
        
        const question = document.getElementById("question");
        if (question.value.trim() === "") {
            blinkQuestion();
            return;
        }
        
        // get category, that is selected
        const category = document.querySelector('input[name="category"]:checked').id;
        
        localStorage.setItem(Date.now(), JSON.stringify({category: category, question: question.value}));
        form.reset();
        formDiv.style.display = "none";
        
        contentDiv.style = "filter: blur(0px);"
        
        addButton.removeAttribute("disabled");
        printLocalStorage();
    });
                             
    function printLocalStorage() {

        // get all items from localStorage
        items = {...localStorage};
        
        // put items in ascending order based on the key (timestamp)
        const sortedKeys = Object.keys(items).sort((a, b) => b.localeCompare(a));
        
        let HTMLquestions = document.getElementById("htmlCat");
        let CSSquestions = document.getElementById("cssCat");
        let JSquestions = document.getElementById("jsCat");
        
        // clear previous content
        while (HTMLquestions.firstChild) {
            HTMLquestions.removeChild(HTMLquestions.firstChild);
        }
        
        while (CSSquestions.firstChild) {
            CSSquestions.removeChild(CSSquestions.firstChild);
        }
        
        while (JSquestions.firstChild) {
            JSquestions.removeChild(JSquestions.firstChild);
        }
                
        for (const key of sortedKeys) {
            const item = items[key];
            
            if (item.category === "HTML" && inputHTML.checked) {
                HTMLquestions.appendChild(document.createTextNode(item.question));
                HTMLquestions.appendChild(document.createElement("br"));
            }
            
            if (item.category === "CSS" && inputCSS.checked) {
                CSSquestions.appendChild(document.createTextNode(item.question));
                CSSquestions.appendChild(document.createElement("br"));
            }
            
            if (item.category === "JS" && inputJS.checked) {
                JSquestions.appendChild(document.createTextNode(item.question));
                JSquestions.appendChild(document.createElement("br"));
            }
        }
        
        
    }
    
    function blinkQuestion() {
        document.getElementById("question").classList.add("animateDescriptor");
        document.getElementById("question").addEventListener("animationend",  function() {
            document.getElementById("question").classList.remove("animateDescriptor");
        }, false );
    }
    
}
