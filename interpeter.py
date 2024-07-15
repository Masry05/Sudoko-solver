from pyswip import Prolog

prolog = Prolog()

query = "member(X, [1,2,3])"
try:
    result = list(prolog.query(query))
    print(result)
except Exception as e:
    print(f"Error: {e}")
