// define an array for 24 * 21 sprite
var board = new Array(504);
var canvas1 = undefined;
var ctx1 = undefined;
var canvas2 = undefined;
var ctx2 = undefined;
var single = true;

window.onload = function() {

    canvas1 = document.getElementById("editCanvas");
    ctx1 = canvas1.getContext("2d");

    canvas2 = document.getElementById("spriteCanvas");
    ctx2 = canvas2.getContext("2d");

    const colorBoxes = document.querySelectorAll('.color-box');

        colorBoxes.forEach(colorBox => {
            colorBox.addEventListener('click', function(event) {
                const color = this.style.backgroundColor;
                //console.log('Color value:', color);
                
                // get color
                if (document.getElementById("color01").checked && document.getElementById("second").style.color != color && document.getElementById("third").style.color != color) document.getElementById("first").style.color = color;
                if (document.getElementById("color10").checked && document.getElementById("first").style.color != color && document.getElementById("third").style.color != color) document.getElementById("second").style.color = color;
                if (document.getElementById("color11").checked && document.getElementById("first").style.color != color && document.getElementById("second").style.color != color) document.getElementById("third").style.color = color;

                drawBoardMulti();
                drawSpriteMulti();
            });
        });

    clearBoard(false);

    let singleRadio = document.getElementById("single");
    singleRadio.checked = true;
    singleRadio.addEventListener("click", function() {
        single = true;
        clearBoard(false);
        drawBoard();
        let colorSelection = document.getElementById("colorSelection");
        colorSelection.style.display = "none";
    });



    // save sprite as basic statements
    let save = document.getElementById("sb");
    save.addEventListener("click", function() {
        if (single) saveSprite1(); else saveMultiColorSprite1();
    });

    // save sprite as C code
    let saveC = document.getElementById("sc");
    saveC.addEventListener("click", function() {
        if (single) saveSprite2(); else saveMultiColorSprite2();
    });

    // save sprite as assembly code
    let saveASM = document.getElementById("sa");
    saveASM.addEventListener("click", function() {
        if (single) saveSprite3(); else saveMultiColorSprite3();
    });

    let multi = document.getElementById("multi");
    multi.addEventListener("click", function() {
        single = false;
        clearBoardMulti(false);
        drawBoardMulti();
        let colorSelection = document.getElementById("colorSelection");
        colorSelection.style.display = "block";
    });

    canvas1.addEventListener("mousedown", function (event) {
    
        let x = event.offsetX;
        let y = event.offsetY;

        if (single) {
            x = parseInt(x / 32);
            y = parseInt(y / 32);


            if (board[x+y*24] == 0) {
                ctx1.fillStyle = "blue";
                ctx1.fillRect(x * 32, y * 32, 32, 32);
                board[x+y*24] = 1;
            } else {
                board[x+y*24] = 0;
                drawBoard();
            }

            drawSprite();
        } else {

            // get color
            const color01 = document.getElementById("color01");
            const color10 = document.getElementById("color10");
            const color11 = document.getElementById("color11");
            
            const col01 = document.getElementById("first").style.color;
            const col10 = document.getElementById("second").style.color;
            const col11 = document.getElementById("third").style.color;

            x = parseInt(x / 64);
            y = parseInt(y / 32);

            if (color01.checked && board[x+y*12] == 1) {
                board[x+y*12] = 0;
                ctx1.fillStyle = "lightgrey";
            } else if (color01.checked) {
                ctx1.fillStyle = col01;
                board[x+y*12] = 1;  // "01"
            }
            if (color11.checked && board[x+y*12] == 3) {
                board[x+y*12] = 0;
                ctx1.fillStyle = "lightgrey";
            } else if (color11.checked) {
                ctx1.fillStyle = col11;
                board[x+y*12] = 3;
            }

            if (color10.checked && board[x+y*12] == 2) {
                board[x+y*12] = 0;
                ctx1.fillStyle = "lightgrey";
            } else if (color10.checked) {
                ctx1.fillStyle = col10;
                board[x+y*12] = 2;
            }
            
        
            
            ctx1.fillRect(x * 64, y * 32, 64, 32);
                
            drawBoardMulti();
            
            drawSpriteMulti();
        }
    });


    if (single) drawBoard(); else drawBoardMulti();
    
}

function drawBoard() {
    let counter = 0;

    for (let y = 0; y < canvas1.height; y+=32) {
        counter +=1;
        for (let x = 0; x < canvas1.width; x+=32) {
            if (counter % 2 == 0) ctx1.fillStyle = "#888888"; else ctx1.fillStyle = "#cccccc"; 
            if (board[parseInt(x/32)+parseInt(y/32)*24] == 0) {
                ctx1.fillRect(x, y, 32, 32);
            } else {
                ctx1.fillStyle = "blue";
                ctx1.fillRect(x,y,32,32);
            }
            counter +=1;
        }
    }
}

function drawBoardMulti() {
    let counter = 0;

    const col01 = document.getElementById("first").style.color;
    const col10 = document.getElementById("second").style.color;
    const col11 = document.getElementById("third").style.color;

    for (let y = 0; y < canvas1.height; y+=32) {
        counter +=1;
        for (let x = 0; x < canvas1.width; x+=64) {
            if (counter % 2 == 0) ctx1.fillStyle = "#888888"; else ctx1.fillStyle = "#cccccc"; 
            
                if (board[parseInt(x/64)+parseInt(y/32)*12] == 1) {
                    ctx1.fillStyle = col01;
                } else if (board[parseInt(x/64)+parseInt(y/32)*12] == 2) {
                    ctx1.fillStyle = col10;
                } else if (board[parseInt(x/64)+parseInt(y/32)*12] == 3) {
                    ctx1.fillStyle = col11;
                }
                ctx1.fillRect(x,y,64,32);
                counter +=1;
        }
        
    }
}



function drawSpriteMulti() {

    const col01 = document.getElementById("first").style.color;
    const col10 = document.getElementById("second").style.color;
    const col11 = document.getElementById("third").style.color;

    ctx2.fillStyle = "lightgray";
    ctx2.fillRect(0, 0, 96, 84);

    for (let y = 0; y < 21; y++) {
        for (let x = 0; x < 12; x++) {
            if (board[x+y*12] == 1) {
                ctx2.fillStyle = col01;
            } else if (board[x+y*12] == 2) {
                    ctx2.fillStyle = col10;
                }
            else if (board[x+y*12] == 3) {
                    ctx2.fillStyle = col11;
            }
            else if (board[x+y*12] == 0) {
                ctx2.fillStyle = "lightgray";
            }
            ctx2.fillRect(x * 8, y * 4, 8, 4);
        }
    }
}

function drawSprite() {
    for (let y = 0; y < 21; y++) {
        for (let x = 0; x < 24; x++) {
            if (board[x+y*24] == 1) {
                ctx2.fillStyle = "#cc1199";
                ctx2.fillRect(x * 4, y * 4, 4, 4);
            } else {
                ctx2.fillStyle = "#FFFFFF";
                ctx2.fillRect(x * 4, y * 4, 4, 4);
            }
        }
    }
}
function clearBoard(justLoaded) {

    let saveSprite = document.getElementById("savesprite");
        
    while (saveSprite.firstChild) {
        saveSprite.removeChild(saveSprite.firstChild);
    }
    
    if (justLoaded==false) document.getElementById("ls").value="";

    for (let i = 0; i < board.length; i++) {
        board[i] = 0;
    }
    if (single) drawBoard(); else drawBoardMulti();
    if (single) drawSprite(); else drawSpriteMulti();

    document.getElementById("first").style.color = "rgb(136, 0, 0)";
    document.getElementById("second").style.color = "rgb(0, 136, 255)";
    document.getElementById("third").style.color = "rgb(255, 119, 119)";
}

function clearBoardMulti(justLoaded) {

    if (justLoaded==false) document.getElementById("ls").value="";

    for (let i = 0; i < 504; i++) {
        board[i] = 0;
    }

    document.getElementById("first").style.color = "rgb(136, 0, 0)";
    document.getElementById("second").style.color = "rgb(0, 136, 255)";
    document.getElementById("third").style.color = "rgb(255, 119, 119)";

    drawBoardMulti();
    drawSpriteMulti();
}

function saveSprite1() {

    let datas = [];
    let data = "10000 data ";
    let byte = 0;
    let counter = 0;
    let char = 0;
    let lineNumber = 10001;

    for (let b = 0; b < 504; b++) {
        if (board[b] == 1) { 
            byte = byte | (Math.pow(2, 7-counter));
        }
        counter += 1;
        if (counter % 8 == 0) {
            if (char != 2) {
                data += byte.toString() + ", ";
            } else {
                data += byte.toString();
                datas.push(data);
                data = lineNumber.toString() + " data ";
                char = -1;
                lineNumber+=1;
            }
            byte = 0;
            counter = 0;
            char+=1;
        }
    }

    let saveSprite = document.getElementById("savesprite");
    
    while (saveSprite.firstChild) {
        saveSprite.removeChild(saveSprite.firstChild);
    }

    let link = document.createElement("a");
    link.addEventListener("click", function() {
        saveSprite.removeChild(link);
    });

    

    link.setAttribute("href", "data:text/plain;charset=utf-8," + encodeURIComponent(datas.join("\n")));
    link.setAttribute("download", "sprite.txt");
    let text = document.createTextNode("Download");
    link.appendChild(text);
    saveSprite.appendChild(link);

}

function saveSprite2() {

    let data = "unsigned char spriteData[63] ={";
    let byte = 0;
    let counter = 0;
    let char = 0;

    for (let b = 0; b < 504; b++) {
        if (board[b] == 1) { 
            byte = byte | (Math.pow(2, 7-counter));
        }
        counter += 1;
        if (counter % 8 == 0) {
            if (char != 62) {
                data += byte.toString() + ", ";
            } else {
                data += byte.toString() + "};";
                char = -1;
            }
            byte = 0;
            counter = 0;
            char+=1;
        }
    }

    let saveSprite = document.getElementById("savesprite");
 
    while (saveSprite.firstChild) {
        saveSprite.removeChild(saveSprite.firstChild);
    }

    let link = document.createElement("a");
    link.addEventListener("click", function() {
        saveSprite.removeChild(link);
    });

    

    link.setAttribute("href", "data:text/plain;charset=utf-8," + encodeURIComponent(data));
    link.setAttribute("download", "sprite.txt");
    let text = document.createTextNode("Download");
    link.appendChild(text);
    saveSprite.appendChild(link);
    

}

function saveSprite3() {

    let datas = [];
    let data = ".byte   ";
    let byte = 0;
    let counter = 0;

    for (let b = 0; b < 504; b++) {
        if (board[b] == 1) { 
            byte = byte | (Math.pow(2, 7-counter));
        }
        counter += 1;
        if (counter % 8 == 0) {
            // byte as hexadecimal
            data += "$"+("0"+byte.toString(16)).slice(-2);
            datas.push(data);
            
            data = ".byte   ";
            byte = 0;
            counter = 0;
        }
    }

    let saveSprite = document.getElementById("savesprite");
 
    while (saveSprite.firstChild) {
        saveSprite.removeChild(saveSprite.firstChild);
    }

    let link = document.createElement("a");
    link.addEventListener("click", function() {
        saveSprite.removeChild(link);
    });

    

    link.setAttribute("href", "data:text/plain;charset=utf-8," + encodeURIComponent(datas.join("\n")));
    link.setAttribute("download", "sprite.txt");
    let text = document.createTextNode("Download");
    link.appendChild(text);
    saveSprite.appendChild(link);
    
}

// https://stackoverflow.com/questions/14446447/how-to-read-a-local-text-file-in-the-browser
function openFile (event) { 

        let saveSprite = document.getElementById("savesprite");
        
        while (saveSprite.firstChild) {
            saveSprite.removeChild(saveSprite.firstChild);
        }
        
        let input = event.target;        
        let reader = new FileReader();
        let content = "";
        reader.onload = function() {
            content = reader.result;
            clearBoard(true);

            if (single) {
                // read sprite data from basic data statements
                if (content.includes("data")) {
                    let lines = content.split("\n");
                    let line = ""
                    let datas = [];
                    let data = 0;
                    let char = 0;
                    for (let i = 0; i < lines.length; i++) {
                        line = lines[i];
                        datas = line.split(" ");
                
                        for (let j = 0; j < datas.slice(-3).length; j++) {
                            data = parseInt(datas.slice(-3)[j]);
                            for (let k = 0; k < 8; k++) {
                                if (data & (Math.pow(2, 7-k))) {
                                    board[char] = 1;
                                }
                                char++;
                            }
                        }
                    
                    }
                
                    drawBoardMulti();
                    drawSpriteMulti();
                }
 
                // Read sprite data from C code
                if (content.includes("unsigned char")) {
                    let datas = content.split(" ");
                    datas = datas.splice(-63);
                    let data = 0;
                    let char = 0;
                    for (let i = 0; i < datas.length; i++) {
                        data = datas[i];
                        data = data.replace("{","");
                        data = data.replace("}","");
                        data = data.replace(",","");
                        data = data.replace("=","");
                        data = data.replace(";","");
                        data = parseInt(data);
                    
                        for (let j = 0; j < 8; j++) {
                            if (data & (Math.pow(2, 7-j))) {
                                board[char] = 1;
                            }
                            char++;
                        }
                    }
                    drawBoard();
                    drawSprite();
                }

                // Read sprite data from assembly code
                if (content.includes(".byte")) {
                    let lines = content.split("\n");
                    let line = ""
                    let datas = [];
                    let data = 0;
                    let char = 0;
                    for (let i = 0; i < lines.length; i++) {
                        line = lines[i];
                        datas = line.split("$");
                    
                        for (let j = 0; j < datas.slice(-1).length; j++) {
                            data = parseInt(datas.slice(-1), 16);
                            for (let k = 0; k < 8; k++) {
                                if (data & (Math.pow(2, 7-k))) {
                                    board[char] = 1;
                                }
                                char++;
                            }
                        }
                    
                    }
                    drawBoard();
                    drawSprite();
                }
            } else {
                // read multi color sprite data from basic data statements
                if (content.includes("data")) {
                    console.log("Multi color sprite data found")
                    let lines = content.split("\n");
                    let line = ""
                    let datas = [];
                    let k = 0;

                    for (let y = 0; y < lines.length; y++) {
                        line = lines[y];
                        datas = line.split(" ");


                        for (let x = 0; x < datas.length; x+=3) {
                            threeNumbers = datas.slice(-3)[2].split(",");
                            let data1 = parseInt(threeNumbers[0]);
                            let data2 = parseInt(threeNumbers[1]);
                            let data3 = parseInt(threeNumbers[2]);

                            // divide data1 into 4 decimal values with 2 bits eac
                            let val1_1 = (data1 >> 6);
                            let val1_2 = (data1 >> 4);
                            let val1_3 = (data1 >> 2);
                            let val1_4 = data1;

                            // divide data2 into 4 decimal values with 2 bits each
                            let val2_1 = (data2 >> 6);
                            let val2_2 = (data2 >> 4);
                            let val2_3 = (data2 >> 2);
                            let val2_4 = data2;

                            // divide data3 into 4 decimal values with 2 bits each
                            let val3_1 = (data3 >> 6);
                            let val3_2 = (data3 >> 4);
                            let val3_3 = (data3 >> 2);
                            let val3_4 = data3;                           

                            // put the board each 4 bits into the board 12 pixels wide as 2 bits each
                            board[y*12 + x*4] = val1_1 & 3;
                            board[y*12 + x*4 + 1] = val1_2 & 3;
                            board[y*12 + x*4 + 2] = val1_3 & 3;
                            board[y*12 + x*4 + 3] = val1_4 & 3;

                            board[y*12 + x*4 + 4] = val2_1 & 3;
                            board[y*12 + x*4 + 5] = val2_2 & 3;
                            board[y*12 + x*4 + 6] = val2_3 & 3;
                            board[y*12 + x*4 + 7] = val2_4 & 3;

                            board[y*12 + x*4 + 8] = val3_1 & 3;
                            board[y*12 + x*4 + 9] = val3_2 & 3;
                            board[y*12 + x*4 + 10] = val3_3 & 3;
                            board[y*12 + x*4 + 11] = val3_4 & 3;

                        }
                          
                    }
                    drawBoardMulti();
                    drawSpriteMulti();  

                } else if (content.includes("unsigned char")) {
                        // read multi color sprite from C-code
                    
                        let datas = content.split(" ");
                        datas = datas.splice(-63);
                        let data = 0;
                        let char = 0;
                        for (let i = 0; i < datas.length; i++) {
                            data = datas[i];
                            data = data.replace("{","");
                            data = data.replace("}","");
                            data = data.replace(",","");
                            data = data.replace("=","");
                            data = data.replace(";","");
                            data = parseInt(data);

                            // split data into 4 decimal values with 2 bits each
                            let val1 = (data >> 6);
                            let val2 = (data >> 4);
                            let val3 = (data >> 2);
                            let val4 = data;

                            // put the board each 4 bits into the board 12 pixels wide as 2 bits each
                            board[char] = val1 & 3;
                            board[char+1] = val2 & 3;
                            board[char+2] = val3 & 3;
                            board[char+3] = val4 & 3;
                            char += 4;
                        }

                        drawBoardMulti();
                        drawSpriteMulti();
                    } else if (content.includes(".byte")) {
                        let lines = content.split("\n");
                        let line = ""
                        let datas = [];
                        let data = 0;
                        let char = 0;
                        for (let i = 0; i < lines.length; i++) {
                            line = lines[i];
                            datas = line.split("$");
                    
                            for (let j = 0; j < datas.slice(-1).length; j++) {
                                try {    
                                    data = parseInt(datas.slice(-1), 16);

                                    // split data into 4 decimal values with 2 bits each
                                    let val1 = (data >> 6);
                                    let val2 = (data >> 4);
                                    let val3 = (data >> 2);
                                    let val4 = data;

                                    // put the board each 4 bits into the board 12 pixels wide as 2 bits each
                                    board[char] = val1 & 3;
                                    board[char+1] = val2 & 3;
                                    board[char+2] = val3 & 3;
                                    board[char+3] = val4 & 3;
                                    char += 4;
                                    
                                } catch (error) {
                                    
                                }
                            }
                    
                        }
                        drawBoardMulti();
                        drawSpriteMulti();
                    }
                    
                
            } 

            
        };
        reader.readAsText(input.files[0]);
        
    }

function saveMultiColorSprite1() {

        let datas = [];
        let data = "10000 data ";
        let byte = 0;
        let counter = 0;
        let char = 1;
        let lineNumber = 10001;
    
        for (let y = 0; y < 21; y++) {
            for (let x = 0; x < 12; x+=4) {

            b = x + y * 12;
            // save multicolor sprite color
            value1 = board[b];
            value2 = board[b+1];
            value3 = board[b+2];
            value4 = board[b+3];

            value1 = value1 << 6;
            value2 = value2 << 4;
            value3 = value3 << 2;


            byte = value1 | value2 | value3 | value4;

            data += byte.toString();
            if (char < 3) data += ",";

            byte = 0;
            
            if (char == 3) {
                datas.push(data);
                data = lineNumber.toString() + " data ";
                lineNumber+=1;
                char = 0;
            }
            char += 1;
            counter += 1;
        }

        console.log(datas);

        let saveSprite = document.getElementById("savesprite");
        
        while (saveSprite.firstChild) {
            saveSprite.removeChild(saveSprite.firstChild);
        }
    
        let link = document.createElement("a");
        link.addEventListener("click", function() {
            saveSprite.removeChild(link);
        });
      
        link.setAttribute("href", "data:text/plain;charset=utf-8," + encodeURIComponent(datas.join("\n")));
        link.setAttribute("download", "sprite.txt");
        let text = document.createTextNode("Download");
        link.appendChild(text);
        saveSprite.appendChild(link);
    
    }
}

function saveMultiColorSprite2() {

    let data = "unsigned char spriteData[63] ={";
    let byte = 0;
    let counter = 0;
    let char = 0;
    
    for (let y = 0; y < 21; y++) {
        for (let x = 0; x < 12; x+=4) {
            b = x + y * 12;
            byte = 0;
            // save multicolor sprite color
            value1 = board[b];
            value2 = board[b+1];
            value3 = board[b+2];
            value4 = board[b+3];
    
            value1 = value1 << 6;
            value2 = value2 << 4;
            value3 = value3 << 2;

            byte = value1 | value2 | value3 | value4;

            data += byte.toString();
            counter += 1;
            if (char < 62) {
                data += ", ";
            } else {
                data += "};";
                char = -1;
            }
                
            char+=1;
            
        }
    }

    let saveSprite = document.getElementById("savesprite");

    while (saveSprite.firstChild) {
        saveSprite.removeChild(saveSprite.firstChild);
    }

    let link = document.createElement("a");
    link.addEventListener("click", function() {
        saveSprite.removeChild(link);
    });

    link.setAttribute("href", "data:text/plain;charset=utf-8," + encodeURIComponent(data));
    link.setAttribute("download", "sprite.txt");
    let text = document.createTextNode("Download");
    link.appendChild(text);
    saveSprite.appendChild(link);

}

function saveMultiColorSprite3() {

    let byte = ".byte   ";
    let datas = [];
    
    for (let y = 0; y < 21; y++) {
        for (let x = 0; x < 12; x+=4) {
            b = x + y * 12;
            value = 0;
            // save multicolor sprite color
            value1 = board[b];
            value2 = board[b+1];
            value3 = board[b+2];
            value4 = board[b+3];
    
            value1 = value1 << 6;
            value2 = value2 << 4;
            value3 = value3 << 2;

            value = value1 | value2 | value3 | value4;

            // byte as hexadecimal
            byte += "$"+("0"+value.toString(16)).slice(-2);
            datas.push(byte+"\n");
                
            byte = ".byte   ";
            
        }
    }

    let saveSprite = document.getElementById("savesprite");

    while (saveSprite.firstChild) {
        saveSprite.removeChild(saveSprite.firstChild);
    }

    let link = document.createElement("a");
    link.addEventListener("click", function() {
        saveSprite.removeChild(link);
    });

    link.setAttribute("href", "data:text/plain;charset=utf-8," + encodeURIComponent(datas.join("")));
    link.setAttribute("download", "sprite.txt");
    let text = document.createTextNode("Download");
    link.appendChild(text);
    saveSprite.appendChild(link);
}
