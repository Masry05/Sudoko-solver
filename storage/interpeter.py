from pyswip import Prolog, Variable

# Initialize Prolog instance
prolog = Prolog()

# Consult the Prolog file
prolog.consult('sudoku.pl')

# Define the query
query = "sudoku(4, [[1, 2, 3, 4], [3, X1, 1, 2], [2, X3, 4, 3], [X2, 3, X4, 1]])"

# Run the query
result = list(prolog.query(query))

# Extract the values of the variables
if result:
    
    for solution in result:
        counter = 1
        size = len(solution)
        while(counter <= size):
            coffetient = str(counter)
            print("X"+coffetient+" = ", solution['X'+coffetient])
            counter += 1
        

else:
    print("No solution found.")
