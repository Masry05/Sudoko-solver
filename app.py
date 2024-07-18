from flask import Flask, jsonify, request, render_template
from pyswip import Prolog
import multiprocessing

app = Flask(__name__)
prolog = Prolog()

# Consult the Prolog file
prolog.consult('sudoku.pl')

def query_prolog(result_dict, query):
    result = list(prolog.query(query))
    if result:
        result_dict['result'] = result
    else:
        result_dict['result'] = None

def sudoku(data):
    manager = multiprocessing.Manager()
    result_dict = manager.dict()

    # Create a new process to run the Prolog query
    query = "sudoku("+str(data['size'])+","+str(data['input'])+")"
    query_process = multiprocessing.Process(target=query_prolog, args=(result_dict, query))
    query_process.start()

    # Wait for the process to finish or timeout after 30 seconds
    query_process.join(timeout=30)

    if query_process.is_alive():
        # If the process is still alive after 30 seconds, it means the query took too long
        query_process.terminate()
        query_process.join()
        return jsonify("Sudoku took too long to process"), 408
    elif result_dict.get('result') is not None:
        result = result_dict['result']
        print(result)
        try:
            result[0]["X1"]
        except KeyError:
            result = jsonify("This is a correct solution!!!")
        return result
    else:
        return  jsonify("Impossible to find a solution / wrong input")

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/api/data', methods=['POST'])
def api_data():
    data = request.json
    return sudoku(data)

if __name__ == '__main__':
    app.run()
