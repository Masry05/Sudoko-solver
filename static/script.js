let original_sudoku;
let solution;
let solution_number;
let perfect_square_flag;
let perfect_square_value;
let dye_flag = false;
let time_flag= false;
let timeout;
function setSudoku() {
    document.querySelector(".checker").innerHTML ="Solve";
    const size = Number(document.querySelector(".size").value);
    if (size >= 2) {
        document.querySelector(".container").style.display = "";
        document.querySelector(".container").innerHTML = "";
        document.querySelector(".reset").style.display = ""
        original_sudoku = [];
        let text = "<div>";
        perfect_square_value = Math.sqrt(size);
        perfect_square_flag = isInt(perfect_square_value);

        for (let i = 0; i < size; i++) {
            let row = [];
            for (let j = 0; j < size; j++) {
                row.push("_");
                let id = [i, j];
                text += `<input class="sudokuInput" onkeydown="check(${i},${j},${size},event.key);" id="${id}"
                title="[${id[0]+1},${id[1]+1}]" >\n`;
            }
            original_sudoku.push(row);
            text += `<br>`;
        }
        text += "</div>";
        document.querySelector(".container").innerHTML += text;
        addBorders(size);
        document.getElementById("0,0").focus();
    } else {
        document.querySelector(".size").value = "";
    }
}

function check(i, j, size, key) {
    if(dye_flag){
        changeColors(0);
    }
    if (key === "Enter") {
        if (i === size - 1 && j === size - 1) {
            solveSudoku()
        } else {
            movement(i, j, size, "ArrowRight")
        }
    } else if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(key)) {
        movement(i, j, size, key);
    } else if (key === "Backspace" && document.getElementById(`${i},${j}`).value === "") {
        movement(i, j, size, "ArrowLeft");
        event.preventDefault();
    } else if (!"0123456789/-".includes(key) && key !== "Backspace") {
        event.preventDefault();
    }
    document.getElementById(`${i},${j}`).style.boxShadow = "";
}

function movement(i, j, size, key) {
    i = Number(i);
    j = Number(j);
    size = Number(size);

    if (key === "ArrowUp" && i !== 0) {
        document.getElementById(`${i-1},${j}`).focus();
    }
    if (key === "ArrowDown" && i !== size - 1) {
        document.getElementById(`${i+1},${j}`).focus();
    }
    if (key === "ArrowLeft") {
        if (document.getElementById(`${i},${j}`).selectionStart === 0) {
            if (j !== 0) {
                document.getElementById(`${i},${j-1}`).focus();
            } else if (i !== 0) {
                document.getElementById(`${i-1},${size-1}`).focus();
            }
            event.preventDefault();
        }
    }
    if (key === "ArrowRight") {
        if (document.getElementById(`${i},${j}`).selectionStart === document.getElementById(`${i},${j}`).value.length) {
            if (j !== size - 1) {
                document.getElementById(`${i},${j+1}`).focus();
            } else if (i !== size - 1) {
                document.getElementById(`${i+1},0`).focus();
            }
            event.preventDefault();
        }
    }
}


function startTimer() {
    // flase = nothing is running
    // true = something is running and throw and alert
    if(!time_flag){
        time_flag=true;
        timeout = setTimeout(() => {
            alert("Sudoku took too long to be processed, please try another one!");
        }, 30100);
        solveSudoku();
    }
    else{
        alert("Your last sudoku is still being processed, please wait!");
    }
}
function solveSudoku() {
    solution = null;
    solution_number = -1;
    const size = Number(document.querySelector(".size").value);
    let query = "[";
    let variables_counter = 1;

    for (let i = 0; i < size; i++) {
        let row = "[";
        for (let j = 0; j < size; j++) {
            let cell = document.getElementById(`${i},${j}`).value
            if (cell.length == 0) {
                row += ("X" + variables_counter);
                original_sudoku[i][j] = "_";
                variables_counter++;
            } else {
                row += cell;
                original_sudoku[i][j] = Number(cell);
            }
            row += ",";
        }
        row = row.substring(0, row.length - 1);
        row += "]";
        query += row + ",";
    }
    query = query.substring(0, query.length - 1);
    query += "]";
    console.log(query);

    const data = { size: size, input: query };
    fetch('/api/data', {
        method: 'POST',
        headers: {      
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(data => {
        console.log(data);
        clearTimeout(timeout);
        time_flag=false;
        if (data == "This is a correct solution!!!" )
            changeColors(1);
        else if(data == "Impossible to find a solution / wrong input")
            changeColors(2);
        else if(data == "Sudoku took too long to process"){
            resetSudoku();
            document.querySelector(".container").style.display="none";
            document.querySelector(".size").value="";
            document.querySelector(".reset").style.display="none";
            document.querySelector(".checker").innerHTML="Set";
        }
        else {
            solution = data;
            if (solution.length > 1) {
                document.querySelector(".navigate").innerHTML =
                `<button onclick="manageSolutions(false)"> &larr; back</button>
                <button onclick="manageSolutions(true)">next &rarr;</button>`;
            } else {
                document.querySelector(".navigate").innerHTML =
                `<button onclick="manageSolutions(false)"> &larr; back</button>`;
            }
            document.querySelector(".input_area").style.display = "none";
            manageSolutions(true);
        }
    })
    .catch((error) => {
        console.error('Error:', error);
    });
}

function manageSolutions(direction) {
    // false = back
    // true = next
    const size = Number(document.querySelector(".size").value);

    if (!direction) {
        if (solution_number == 0) {
            document.querySelector(".input_area").style.display = "";
            for (let i = 0; i < size; i++) {
                for (let j = 0; j < size; j++) {
                    let cell = document.getElementById(`${i},${j}`);
                    cell.style.color = "black";
                    cell.readOnly = false;
                    if (original_sudoku[i][j] != "_") {
                        cell.value = original_sudoku[i][j];
                    } else {
                        cell.value = "";
                    }
                }
            }
            document.querySelector(".navigate").innerHTML = "";
        } else {
            document.querySelector(".navigate").innerHTML =
            `<button onclick="manageSolutions(false)"> &larr; back</button>
            <button onclick="manageSolutions(true)">next &rarr;</button>`;  
        }  
        solution_number--;
    } else {
        if (solution_number == solution.length - 2) {
            document.querySelector(".navigate").innerHTML =
            `<button onclick="manageSolutions(false)"> &larr; back</button>`;
        }
        solution_number++;  
    }
    
    if (solution_number >= 0) {
        let variables_counter = 1;
        for (let i = 0; i < size; i++) {
            for (let j = 0; j < size; j++) {
                let cell = document.getElementById(`${i},${j}`);
                cell.readOnly = true;
                if (original_sudoku[i][j] == "_") {
                    cell.value = solution[solution_number]["X" + variables_counter];
                    cell.style.color = 'blue';
                    cell.style.borderBlockColor = 'black';
                    variables_counter++;
                }
            }
        }
    }
}

function isInt(number) {
    return Number.isFinite(number) && Math.floor(number) === number;
}

function addBorders(size) {
    if (!perfect_square_flag) {
        for (let i = 0; i < size; i++) {
            for (let j = 0; j < size; j++) {
                document.getElementById(`${i},${j}`).style.border = "2px solid #000";
            }
        }
    } else {
        for (let i = 0; i < size; i++) {
            for (let j = 0; j < size; j++) {
                let cell = document.getElementById(`${i},${j}`);
                if ((j + 1) % perfect_square_value == 0) {
                    cell.style.borderRight = "2px solid #000";
                    if (j + 1 < size) {
                        document.getElementById(`${i},${j + 1}`).style.borderLeft = "2px solid #000";
                    }
                }
                if ((i + 1) % perfect_square_value == 0) {
                    cell.style.borderBottom = "2px solid";
                    if (i + 1 < size) {
                        document.getElementById(`${i + 1},${j}`).style.borderTop = "2px solid #000";
                    }
                }
                if (i == 0) cell.style.borderTop = "none";
                if (j == 0) cell.style.borderLeft = "none";
                if (i == size - 1) cell.style.borderBottom = "none";
                if (j == size - 1) cell.style.borderRight = "none";
            }
        }
    }
}

function resetSudoku() {
    const size = Number(document.querySelector(".size").value);
    for (let i = 0; i < size; i++) {
        for (let j = 0; j < size; j++) {
            original_sudoku[i][j] = "_";
        }
    }
    solution_number = 0;
    manageSolutions(false);
    changeColors(0);
}

function changeColors(code){
    // 0 = reset all
    // 1 = green
    // 2 = red
    if(code == 0)
        dye_flag = false;
    else
        dye_flag = true;

    const size = Number(document.querySelector(".size").value); 
    for(let i = 0; i<size; i++)
        for(let j = 0;j<size; j++){
            let cell = document.getElementById(`${i},${j}`);
            switch(code){
                case 0 : 
                    cell.style.boxShadow = "";break;
                case 1:
                    cell.style.boxShadow = 'inset 0 0 15px green';break;
                case 2:
                    if(cell.value.length>0)
                        cell.style.boxShadow = 'inset 0 0 15px red';break;
            }
        }
}
