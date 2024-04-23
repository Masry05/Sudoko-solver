:- use_module(library(apply_macros)).

sudoku(Size,Solution):- 
    findall(N, (between(1, Size, N)), List),
    permutateRows(Size,List,Solution),
    transpose1(Solution,Columns),
    check_column(Columns),
    \+checkRoot(Size,_).
sudoku(Size,Solution):- 
    findall(N, (between(1, Size, N)), List),
    permutateRows(Size,List,Solution),
    transpose1(Solution,Columns),
    check_column(Columns),
    checkRoot(Size,Root),
    checkBoxes(Root,Size,Solution).

permutateRows(0,_,[]).
permutateRows(Size,List,[H|T]):-
    Size>0,
    permutation(List,H),
    Size1 is Size-1,
    permutateRows(Size1,List,T).

notRepeated([]).
notRepeated([H|T]):-
    \+member(H,T),
    notRepeated(T).

transpose1([], []).
transpose1([L|Ls], Ts) :-
    foldl(transpose, L, Ts, [L|Ls], _).

transpose(_, Fs, Lists0, Lists) :-
    maplist(list_first_rest, Lists0, Fs, Lists).

list_first_rest([X|Xs], X, Xs).

check_column([]).
check_column([H|T]):-
    notRepeated(H),
    check_column(T).

checkRoot(Size,Apporximated):-
    Root is Size**(1/2),
    Apporximated is floor(Root),
    Root - Apporximated =:= 0.

checkBoxes(Root,Size, Solution) :-
    fillEmpty(Root,Acc),
    checkBoxes(Root,Size,Solution,Root,Acc).

checkBoxes(_,0,_,0,Acc):-
    notRepeatedRec(Acc).
checkBoxes(Root,Size,List,0,Acc):-
    Size > 0,
    notRepeatedRec(Acc),
    fillEmpty(Root,Acc1),
    checkBoxes(Root,Size,List,Root,Acc1).
checkBoxes(Root,Size,[H|T],Counter,Acc):-
    Counter > 0,
    divideList(H,Root,Acc1),
    appendRec(Acc,Acc1,Acc2),
    Counter1 is Counter - 1,
    Size1 is Size - 1,
    checkBoxes(Root,Size1,T,Counter1,Acc2).

divideList([], _ , []).
divideList(List, Root, [H|T]) :-
    length(H, Root),
    append(H, Rem, List),
    divideList(Rem, Root, T).

appendRec([], [], []).
appendRec([H1|T1], [H2|T2], [H3|T3]) :-
    append(H1, H2, H3),
    appendRec(T1, T2, T3).

fillEmpty(0, []).
fillEmpty(Root, [[]|Result]) :-
    Root > 0,
    Root1 is Root - 1,
    fillEmpty(Root1, Result).

notRepeatedRec([]).
notRepeatedRec([H|T]):-
    notRepeated(H),
    notRepeatedRec(T).