from flask import Flask, request, jsonify, render_template
from pyswip import Prolog, Variable

def sudoku(data):

    # Initialize Prolog instance
    prolog = Prolog()

    # Consult the Prolog file
    prolog.consult('sudoku.pl')

    # Define the query
    query = "sudoku("+str(data['size'])+","+str(data['input'])+")"

    # Run the query
    result = list(prolog.query(query))

    # Extract the values of the variables
    if result:
        try:
            result[0]["X1"]
        except KeyError:
            result = jsonify("This is a correct solution!!!")
        return result
    else:
        return  jsonify("Impossible to find a solution / wrong input")
        
app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/api/data', methods=['POST'])
def get_data():
    data = request.json
    return sudoku(data)

if __name__ == '__main__':
    app.run()