var kertoimet = [[]];
var potenssit = [[]];
var thevakio = [1];

var scale;
var ctx, ctxp;
var xlimit = 4.0;
var px;
var vakio;
var poly = 0;
var empty;

window.onload = function() {

    thevakio[0] = undefined;

    empty = document.getElementById("empty");

    let canvas = document.getElementById("canvas");
    ctx = canvas.getContext("2d");

    let canvas2 = document.getElementById("pcanvas");
    ctxp = canvas2.getContext("2d");

    let clr = document.getElementById("clr");
    clr.onclick = function() {
        thevakio = [1];
        thevakio[0] = undefined;
        kertoimet = [[]];
        potenssit = [[]];
        poly = 0;
        polyn.textContent = (poly + 1);
        ctx.clearRect(0,0,500,500);
        ctxp.clearRect(0,0,400,500);
        empty.style = "visibility: hidden";
        plotAxes();
    }

    let add = document.getElementById("add");
    add.addEventListener("click",lissaa);

    let add2 = document.getElementById("add2");
    add2.addEventListener("click",lissaa);

    let plottaa = document.getElementById("plot");
    plottaa.addEventListener("click",plot);

    let t = document.getElementById("term");

    let sel1 = document.createElement("select");
    sel1.setAttribute("id","denominator");

    for (let i = -10; i < 11; i++) {
        if (i != 0) {
            let coefficient = document.createElement("option");
            coefficient.textContent = i;
            sel1.appendChild(coefficient);
        }
    }

    let sel2 = document.createElement("select");
    sel2.setAttribute("id","numerator");

    for (let i = -10; i < 11; i++) {
        let coefficient = document.createElement("option");
        coefficient.textContent = i;
        sel2.appendChild(coefficient);
    }
    let br = document.createElement("br");
    t.appendChild(sel2);
    t.appendChild(br);
    t.appendChild(sel1);



    let termi = document.createElement("textNode");
    termi.setAttribute("id","termi");
    termi.textContent = "X";
    t.appendChild(termi);

    let sel3 = document.createElement("select");
    sel3.setAttribute("id","power");

    for (let i = 1; i < 11; i++) {
        let power = document.createElement("option");
        power.textContent = i;
        sel3.appendChild(power);
    }

    t.appendChild(sel3);

    vakio = document.createElement("textNode");
    vakio.setAttribute("id","const");
    vakio.textContent = "0";
    t.appendChild(vakio);

    let sel4 = document.createElement("select");
    sel4.onchange = function() {
        vakio.textContent = this.value;
    };


    sel4.setAttribute("id","power");

    for (let i = -10; i < 11; i++) {
        let constant = document.createElement("option");
        constant.textContent = i;
        sel4.appendChild(constant);
    }

    t.appendChild(sel4);

    let polyn = document.createElement("textNode");
    polyn.setAttribute("id","polyn");
    polyn.textContent = (poly + 1);
    t.appendChild(polyn);

    let slider = document.getElementById("slider");
    slider.addEventListener("mouseup", plot);
    let outputs = document.getElementById("scale");
    outputs.textContent = slider.value / 10.0;

    
    slider.oninput = function() {
        outputs.textContent = this.value / 10.0;
        scale = parseFloat(this.value / 10.0);
    }

    let slider2 = document.getElementById("slider2");
    slider2.addEventListener("mouseup", plot);
    let outputl = document.getElementById("limit");
    outputl.textContent = "["+ (-xlimit)+ "," + xlimit + "]";

    
    slider2.oninput = function() {
        outputl.textContent = "["+ (-this.value)+ "," + this.value + "]";
        xlimit = this.value;
    }

    let newp = document.getElementById("newp");
    newp.onclick = function() {
        if (potenssit[poly].length > 0 || thevakio[poly] != undefined) {
            poly++;
            potenssit.length += 1;
            kertoimet.length += 1;
            potenssit[poly] = [];
            kertoimet[poly] = [];
            thevakio.length += 1;
            thevakio[poly] = 0;
            polyn.textContent = (poly + 1);
            empty.style = "visibility: hidden";
        } else {
            empty.style = "visibility: visible";
        }
    }
    plotAxes();

    window.oninput = function() {
        empty.style = "visibility: hidden";
    }

}


function plotAxes() {
    ctx.clearRect(0,0,500,500);

    scale = parseFloat(document.getElementById("slider").value) / 10.0;   

    // y-askeli
    ctx.beginPath();
    ctx.moveTo(250,0);
    ctx.lineTo(250,500);
    ctx.lineWidth = 1;
    ctx.stroke();

    // x-akseli
    ctx.beginPath();
    ctx.moveTo(0,250);
    ctx.lineTo(500,250);
    ctx.stroke();

    let piste = -xlimit;

    for (let i = 0; i < xlimit * 2 + 1; i++) {
        ctx.beginPath();
        ctx.moveTo(piste * scale  + 250, 250-4);
        ctx.lineTo(piste * scale  + 250, 250+4);
        ctx.font = "Arial 12px";
        if (piste != 0) ctx.fillText(piste, piste * scale  + 250 - 4, 250-8);
        ctx.stroke();
        piste = piste + 1;
    }

    piste = -xlimit;

    for (let i = 0; i < xlimit * 2 + 1; i++) {
        ctx.beginPath();
        ctx.moveTo(250-4, piste * scale  + 250);
        ctx.lineTo(250+4, piste * scale  + 250);
        ctx.font = "Arial 12px";
        if (piste != 0) ctx.fillText(piste, 250-14, -piste * scale  + 250 + 4);
        ctx.stroke();
        piste = piste + xlimit / xlimit;
    }
}    
function plot() {

    ctx.clearRect(0,0,500,500);


    let xk = -xlimit;
    let x = 0.0;
    let y = 0.0, yy, y1;

    scale = parseFloat(document.getElementById("slider").value) / 10.0;   
    
    let potenssi = 0.0;

    let kerroin = 0.0;

    plotAxes();


   
    ctx.lineWidth = 2;

for (let p = 0; p < poly + 1; p++) {
    ctx.beginPath();
    xk = -xlimit;
    x = 0.0;
    y = 0.0;
    
    while (xk < xlimit) {
        x = ((xk * scale) );
        y = 0.0;
        for (let i = 0; i < potenssit[p].length; i++) {
                            
            kerroin = kertoimet[p][i];
            potenssi = potenssit[p][i];
            
            if (thevakio[p] != undefined) {
                y1 = -((Math.pow(xk,potenssi) * scale ) * kerroin) - thevakio[p] * scale;
            } else {
                y1 = -((Math.pow(xk,potenssi) * scale ) * kerroin)
            }
            y = y + y1;
        }
                    
        ctx.moveTo(x + 250, (y + 250));

        xk = xk + 0.1;
        x = xk * scale;
        
        y = 0.0;

        for (let i = 0; i < potenssit[p].length; i++) {
        
            kerroin = kertoimet[p][i];
            potenssi = potenssit[p][i];
            
            if (thevakio[p] != undefined) {
                y1 = -((Math.pow(xk,potenssi) * scale ) * kerroin) - thevakio[p] * scale;
            } else {
                y1 = -((Math.pow(xk,potenssi) * scale ) * kerroin)
            }
            y = y + y1;
        }

        ctx.lineTo(x + 250, y + 250); 
        ctx.stroke();
        
    }

        if (potenssit[p].length == 0) {

            xk = -xlimit;
            x = 0.0;
            y = 0.0;       
            
            while (xk < xlimit) {
                x = ((xk * scale) );
                y = 0.0;

                y1 = -thevakio[p] * scale;

                y = y + y1;

                ctx.moveTo(x + 250, (y + 250));

                xk = xk + 0.1;
                x = ((xk * scale) );
        
                y = 0.0;
            
                y1 = -thevakio[p] * scale;

                y = y + y1;
                
                ctx.lineTo(x + 250, y + 250);
                ctx.stroke(); 
        
        }
    }

}
}
function lissaa(e) {

    ctxp.clearRect(0,0,400,500);

    let power = document.getElementById("power").value;
    let os = document.getElementById("numerator").value;
    let nim = document.getElementById("denominator").value;

    let potenssi = parseInt(power);
    
    let numerator = parseFloat(os);
    let denominator = parseFloat(nim);

    let kerroin = parseFloat(os / nim);
        
    if (e.target.id == "add") {
        let oliSamaEksponentti = false;

        for (let i = 0; i < potenssit[poly].length; i++) {
            if (potenssit[poly][i] == potenssi) {
                let kerroin2 = kertoimet[poly][i];
                kerroin += kerroin2;
                kertoimet[poly][i] = kerroin;
                oliSamaEksponentti = true;
            }
        }

        if (oliSamaEksponentti == false) {
            kertoimet[poly].push(kerroin);
            potenssit[poly].push(potenssi);
        }
    

        // termien sorttaus ekpsonenttien mukaan
        for (let i = 0; i < potenssit[poly].length - 1; i++) {
            for (let j = 0; j < potenssit[poly].length; j++) {

                if (potenssit[poly][i+1] > potenssit[poly][i]) {
                    let temp = potenssit[poly][i];
                    potenssit[poly][i] = potenssit[poly][i+1];
                    potenssit[poly][i+1] = temp;
                    temp =  kertoimet[poly][i];
                    kertoimet[poly][i] = kertoimet[poly][i+1];
                    kertoimet[poly][i+1] = temp; 
                }
            }
        }
    } else {
        if (thevakio[poly] == undefined) {
            thevakio[poly] = 0;
        }
        thevakio[poly] = thevakio[poly] + parseFloat(vakio.textContent);
        
    }

for (let p = 0; p < poly + 1; p++) {  
    px = 0.0;

    ctxp.font = "30px Arial";
    ctxp.fillText("y"+ (p + 1) + " = ", px, 30 + (p + 1) * 30);
    px += ctxp.measureText("y" + (p + 1) + " = ").width;

    for (let i = 0; i < potenssit[p].length; i++) {
        ctxp.font = "30px Arial";


        if (kertoimet[p][i] != 1) {
            if (kertoimet[p][i] == -1) {
                ctxp.fillText("-", px, 30 + (p + 1) * 30);
                px += ctxp.measureText("-").width;
            } else {
                ctxp.fillText(kertoimet[p][i], px, 30 + (p + 1) * 30);           
                px += ctxp.measureText(kertoimet[p][i]).width;           
            }
        }
        ctxp.fillText("x", px, 30 + (p + 1) * 30);
        px += ctxp.measureText("x").width;

        if (potenssit[p][i] != 1) {
            ctxp.font = "20px Arial";
            ctxp.fillText(potenssit[p][i], px, 20 + (p + 1) * 30);
            px += ctxp.measureText(potenssit[p][i]).width;
        }
        
        if (i < potenssit[p].length - 1) {
            ctxp.font = "30px Arial";
            ctxp.fillText(" + ", px, 30 + (p + 1) * 30);
            px += ctxp.measureText(" + ").width;
        }
        
    }

    if (thevakio[p] != 0 && thevakio[p] != undefined) {
        ctxp.font = "30px Arial";
        ctxp.fillText(" + " + thevakio[p], px, 30 + (p + 1) * 30);           
    } else {
        if (thevakio[p] == 0 && potenssit[p].length == 0) {
            ctxp.font = "30px Arial";
            ctxp.fillText("0", px, 30 + (p + 1) * 30);
        }
    }
}
   
}