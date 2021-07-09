function calculate()
{
    let a, b, c;
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
        document.getElementById("root1").innerHTML = "X1 = " + String(-c / b);
        document.getElementById("root2").innerHTML = "X2 = N/A";
        console.log(c / b);
        return;
    }

    if (((Math.pow(b , 2)) - 4 * a * c) < 0)
    {
        document.getElementById("root1").innerHTML
            = "X1 = " + String(-b / (2 * a)) + " + "
            + String(Math.sqrt(-(Math.pow(b , 2) - 4 * a * c)) / (2 * a)) + "i";

        document.getElementById("root2").innerHTML
            = "X2 = " + String(-b / (2 * a)) + " - "
            + String((Math.sqrt(-(Math.pow( b , 2 ) - 4 * a * c)) / (2 * a))) + "i";
        return;
    }

    document.getElementById("root1").innerHTML
        = "X1 = " + String((-b + Math.sqrt(Math.pow(b, 2) - 4 * a * c)) / (2 * a));
    document.getElementById("root2").innerHTML
        = "X2 = " + String((-b - Math.sqrt(Math.pow( b , 2 ) - 4 * a * c)) / (2 * a));

}

function check_and_calculate()
{
    if (document.getElementById("box-a").value.length === 0
        && document.getElementById("box-b").value.length === 0
        && document.getElementById("box-c").value.length === 0) {
        return;
    }
    calculate();
}
