/*
 KMeans clustering in JavaScript

*/

epsilon = 10**-7;

kvalue = undefined;
canvas = undefined;
ctx = undefined;
pointsvalue = undefined;
iter = undefined;

window.onload = function() {

    canvas = document.getElementById("canvas");
    ctx = canvas.getContext("2d");

    canvas.setAttribute("width",document.documentElement.clientWidth * 0.75);
    canvas.setAttribute("height",document.documentElement.clientHeight * 0.80);

    kvalue = document.getElementById("kvalue");
    kvalue.setAttribute("value",7);

    pointsvalue = document.getElementById("points");
    pointsvalue.setAttribute("value",400);

    iter = document.getElementById("iter");

    btn = document.getElementById("btncl");
    btn.addEventListener("click", clustering);
}

function clustering() {

ctx.clearRect(0,0,canvas.width,canvas.height);

let k = kvalue.value;
let points = pointsvalue.value;

data = [];
distance = [];

for (let i = 0; i < points; i++) {
    data.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height
    });
    distance.push({
        cluster: -1,
        distance: 0,
        index: i
    });
    
}



// random initial centroids
centroids = [];
prev_centroids = [];

for (let i = 0; i < k; i++) {
    centroids.push({
        x: data[Math.floor(Math.random() * data.length)].x,
        y: data[Math.floor(Math.random() * data.length)].y
    });

    prev_centroids.push({
        x: -1,
        y: -1
    });
}




iterations = 0;

// Main loop
while (true) {

    iterations += 1;
    
    // for each data point
    for (let i = 0; i < data.length; i++) {
        // find the closest centroid
        let min_dist = Infinity;
        let min_index = -1;
        for (let j = 0; j < k; j++) {
            let dist = Math.sqrt(Math.pow(data[i].x - centroids[j].x, 2) + Math.pow(data[i].y - centroids[j].y, 2));
            if (dist < min_dist) {
                min_dist = dist;
                min_index = j;
            }
        }
        // assign the data point to the closest centroid
        distance[i].cluster = min_index;
    }
    
    // now the previous centroids are the current centroids
    for (let a = 0; a < k; a++) {
        prev_centroids[a].x = centroids[a].x;
        prev_centroids[a].y = centroids[a].y;
    }

    // recalculate the centroids
    for (let j = 0; j < k; j++) {
        let x = 0;
        let y = 0;
        let count = 0;
        for (let i = 0; i < data.length; i++) {
            if (distance[i].cluster == j) {
                x += data[i].x;
                y += data[i].y;
                count += 1;
            }
        }
        centroids[j].x = x / count;
        centroids[j].y = y / count;
    }

    // check if the centroids have converged
    let converged = true;
    for (let i = 0; i < k; i++) {
        if (Math.sqrt(Math.pow(centroids[i].x - prev_centroids[i].x, 2) + Math.pow(centroids[i].y - prev_centroids[i].y, 2)) > epsilon) {
            converged = false;
        }
    }
    if (converged) {
        break;
    }

    console.log(iterations);
} 

iter.textContent = "Iterations: "+iterations;

// draw each cluster in different colour
for (let i = 0; i < data.length; i++) {
    ctx.beginPath();
    ctx.arc(data[i].x, data[i].y, 5, 0, 2 * Math.PI);
    // if cluster is 0, draw in red
    if (distance[i].cluster == 0) {
        ctx.fillStyle = "red";
    }
    // if cluster is 1, draw in blue
    else if (distance[i].cluster == 1) {
        ctx.fillStyle = "blue";
    }
    // if cluster is 2, draw in green
    else if (distance[i].cluster == 2) {
        ctx.fillStyle = "green";
    }
    // if cluster is 3, draw in yellow
    else if (distance[i].cluster == 3) {
        ctx.fillStyle = "yellow";
    }
    // if cluster is 4, draw in purple
    else if (distance[i].cluster == 4) {
        ctx.fillStyle = "purple";
    }
    // if cluster is 5, draw in orange
    else if (distance[i].cluster == 5) {
        ctx.fillStyle = "orange";
    }
    // if cluster is 6, draw in brown
    else if (distance[i].cluster == 6) {
        ctx.fillStyle = "brown";
    }
    // if cluster is 7, draw in black
    else if (distance[i].cluster == 7) {
        ctx.fillStyle = "black";
    }
    ctx.fill();
}



    
// draw the centroids
for (let a = 0; a < k; a++) {

    ctx.fillStyle = "black";
    ctx.fillRect(centroids[a].x-5, centroids[a].y-5, 10, 10);

}

}
