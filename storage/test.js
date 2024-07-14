let size = 9;
function isInt(number) {
    return Number.isFinite(number) && Math.floor(number) === number;
}
console.log(isInt(Math.sqrt(size)));