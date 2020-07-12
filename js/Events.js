let clickcount = 0;
let entercount = 0;
let rotatecount = 0;
let shiftcount = 0;

function keyPressed() {

    if(timerflag == false){
        timerflag =  true;
        timerlaunch = true;
        console.log("timerlaunch");
    }

    if (keyCode === ENTER) {
        // deactivate all branches
        for (var i = 0; i < brc.length; i++)  brc[i].setSleep();
        if (active_brc_index == brc.length - 1) active_brc_index = 0; // go back to the first index of branches
        else active_brc_index += 1; // add the index
        brc[active_brc_index].setMoveActive(); // select the branch by activating it
        entercount++;
    }

    var angle = brc[active_brc_index].rot;

    if (keyCode === LEFT_ARROW) {
        if (keyIsDown(SHIFT)){
            angle -= 0.02 * PI;
            shiftcount++;
            rotatecount++;
        }else{
            angle -= 0.1 * PI;
            rotatecount++;
        }
    } else if (keyCode === RIGHT_ARROW) {
        if (keyIsDown(SHIFT)){
            angle += 0.02 * PI;
            shiftcount++;
            rotatecount++;
        }else{
            angle += 0.1 * PI;
            rotatecount++;
        }
    }

    brc[active_brc_index].setAngle(angle); // in radians
    score.updateScore();
}

// selection of branches
function mousePressed(event) {
    brc[active_brc_index].setSleep();
    //console.log(event.layerX + ' , ' + event.layerY); 
    //console.log(mouseX + ' , ' + mouseY);
    var branch = checkCloseBranch(20)[0];
    if(branch === true) {
        for (var i = 0; i < brc.length; i++)  brc[i].setSleep();
        var activeindex = checkCloseBranch(20)[1]
        brc[activeindex].setMoveActive();
        active_brc_index = activeindex;
        clickcount++;
    }
    if(timerflag == false){
        timerflag =  true;
        timerlaunch = true;
        console.log("timerlaunch");
    }
}

// move and rotate 
function mouseDragged(event) {
    brc[active_brc_index].setPosition(mouseX, mouseY);
}

// deactivate the selected branch
function mouseReleased() {
    /*
    you might need to deselect the selected branch 
    */
    score.updateScore();
}

function checkCloseBranch(minDist) {
    var closeBranch = false;
    var closeIndex = null;
    var mouseVec = new createVector(mouseX, mouseY);
    for (var i = 0; i < brc.length; i++) {
        var vertices = brc[i].transformed_contour;
        for (var j = 0; j < vertices.length; j++) {
            var distance = mouseVec.dist(vertices[j]);
            if (distance < minDist) {
                closeBranch = true;
                minDist = distance;
                closeIndex = i;
            }
        }
    }
    return [closeBranch, closeIndex];
}