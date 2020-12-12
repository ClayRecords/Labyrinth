function signOf(x) {
    if (x == 0) {
        return 0;
    }
    return x / Math.abs(x);
}

function roundToDigits(x, digits) {
    var place = 10 ** digits;
    return Math.round(x * place) / place;
}