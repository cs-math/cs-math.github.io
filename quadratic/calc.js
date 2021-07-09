function calculate() {
    const DECIMAL_PLACES = 4;
    let a, b, c;
    document.getElementById("root1").innerHTML = "x<sub>1</sub> = ";
    document.getElementById("root2").innerHTML = "x<sub>2</sub> = ";
    if(document.getElementById("box-b").value.length === 0) {
        b = 0;
    }

    if(document.getElementById("box-c").value.length === 0) {
        c = 0;
    }
    a = parseInt(document.getElementById("box-a").value);
    b = parseInt(document.getElementById("box-b").value);
    c = parseInt(document.getElementById("box-c").value);

    if (document.getElementById("box-a").value.length === 0 || a === 0) {
        document.getElementById("root1").innerHTML += String(-c / b);
        document.getElementById("root2").innerHTML += "N/A";
        console.log(c / b);
        return;
    }

    if (((Math.pow(b , 2)) - 4 * a * c) < 0)
    {
        document.getElementById("root1").innerHTML
            += String(((-b / (2 * a)).toFixed(DECIMAL_PLACES))) + " + "
            + String((Math.sqrt(-(Math.pow(b , 2) - 4 * a * c)) / (2 * a)).toFixed(DECIMAL_PLACES)) + "i";

        document.getElementById("root2").innerHTML
            += String((-b / (2 * a)).toFixed(DECIMAL_PLACES)) + " - "
            + String(
                ((Math.sqrt(-(Math.pow(b, 2) - 4 * a * c))
                / (2 * a))
            ).toFixed(DECIMAL_PLACES)) + "i";
        return;
    }

    document.getElementById("root1").innerHTML
        += String(((-b + Math.sqrt(Math.pow(b, 2) - 4 * a * c)) / (2 * a)).toFixed(DECIMAL_PLACES));
    document.getElementById("root2").innerHTML
        += String(((-b - Math.sqrt(Math.pow( b , 2 ) - 4 * a * c)) / (2 * a)).toFixed(DECIMAL_PLACES));

}

function check_and_calculate() {
    if (document.getElementById("box-a").value.length === 0
        && document.getElementById("box-b").value.length === 0
        && document.getElementById("box-c").value.length === 0) {
        return;
    }
    calculate();
}
