let original_sudoku;
let solution;
let solution_number = 0;
function setSudoku(){
    const size= Number(document.querySelector(".size").value);
    document.querySelector(".container").innerHTML="";
    let text="<div>";
    if(size>=2){
      for(let i=0;i<size;i++){
        for(let j=0;j<size;j++){
          let id=[i,j];
          text+=`<input class="sudokuInput" onkeydown="check(${i},${j},${size},event.key);" id="${id}"
          title="[${id[0]+1},${id[1]+1}]" >\n`;}
          text+=`<br>`;
        }
        text+="</div>";
        //text+=`<div class="solving-buttons"><button class="js-solve" onclick="if(checkInput()) solve();">Solve</button>
        //<button class="js-reset" onclick="reset()">Reset</button></div>`;
        document.querySelector(".container").innerHTML+=text;
      }
      document.getElementById("0,0").focus();
    }
    function check(i,j,size,key){
      if(key==="Enter"){
        if(i===size-1&&j===size-1)
            solveSudoku()
        else
          movement(i,j,size,"ArrowRight")}
      else if(key==="ArrowUp"||key==="ArrowDown"||key==="ArrowLeft"||key==="ArrowRight")
        movement(i,j,size,key);
      else if(key==="Backspace"&&document.getElementById(`${i},${j}`).value===""){
        movement(i,j,size,"ArrowLeft");
        event.preventDefault();}
      else if(key!=="0"&&key!=="1"&&key!=="2"&&key!=="3"&&key!=="4"&&key!=="5"&&key!=="6"&&key!=="7"&&key!=="8"&&key!=="9"&&key!=="/"&&key!=="-"&&key!=="Backspace")
        event.preventDefault();
      document.getElementById(i+","+j).style.boxShadow="";
    }
    function movement(i,j,size,key){
      i=Number(i);
      j=Number(j);
      size=Number(size);
      if(key==="ArrowUp")
        if(i!==0)
          document.getElementById(`${i-1},${j}`).focus();
      if(key==="ArrowDown")
        if(i!==size-1)
        document.getElementById(`${i+1},${j}`).focus();
      if(key==="ArrowLeft"){
        if(document.getElementById(`${i},${j}`).selectionStart===0){
        if(j!==0)
          document.getElementById(`${i},${j-1}`).focus();
        else if(i!==0)
          document.getElementById(`${i-1},${size-1}`).focus();
          event.preventDefault();}}
      if(key==="ArrowRight"){
        if(document.getElementById(`${i},${j}`).selectionStart===document.getElementById(`${i},${j}`).value.length){
        if(j!==size-1)
        document.getElementById(`${i},${j+1}`).focus();
        else if(i!==size-1)
        document.getElementById(`${i+1},0`).focus();
        event.preventDefault();}}}
function solveSudoku(){
    original_sudoku = [];
    solution = null;
    solution_number = 0;
    const size= Number(document.querySelector(".size").value);
    let query = "[";
    let variables_counter = 1;
    for(let i = 0; i<size;i++){
        let row = "[";
        let row_list = []
        for(let j=0;j<size;j++){
            let cell = document.getElementById(`${i},${j}`).value
            if(cell.length == 0){
                row += ("X"+variables_counter);
                row_list.push(Number(cell));
                variables_counter++;
            }
            else{
                row += cell;
                row_list.push("_");
              }
            row += ",";
        }
        row = row.substring(0,row.length-1);
        row += "]";
        query += row + ",";
        original_sudoku.push(row_list);
    }
    console.log(original_sudoku);
    query = query.substring(0,query.length-1);
    query += "]";
    console.log(query);
    const data = { size: size,
                   input: query };
    fetch('/api/data', {
        method: 'POST',
        headers: {      
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(data => {
      solution=data;
      variables_counter = 1;
      for(let i = 0; i<size;i++)
        for(let j=0;j<size;j++){
            let cell = document.getElementById(`${i},${j}`).value
            if(cell.length == 0){
              document.getElementById(`${i},${j}`).value = data[solution_number]["X"+variables_counter];
              variables_counter++;
            }
      }
      solution_number++
    })
    .catch((error) => {
        console.error('Error:', error);
    });
}

