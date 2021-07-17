function calculate() {
    const DECIMAL_PLACES = 4;
    let a, b, c;
    let root1 = document.getElementById("root1");
    let root2 = document.getElementById("root2");

    a = parseFloat(document.getElementById("box-a").value);
    b = parseFloat(document.getElementById("box-b").value);
    c = parseFloat(document.getElementById("box-c").value);

    if (a === 0) {
        root1.innerHTML = String((-c / b).toFixed(DECIMAL_PLACES));
        root2.innerHTML = "N/A";
        return;
    }

    if (((Math.pow(b , 2)) - 4 * a * c) < 0)
    {
        let real_term = String((-b / (2 * a)).toFixed(DECIMAL_PLACES));
        let complex_term = String((Math.sqrt(-(Math.pow(b, 2) - 4 * a * c)) / (2 * a)).toFixed(DECIMAL_PLACES));
        complex_term = Math.abs(complex_term);
        root1.innerHTML = real_term + " + i" + complex_term;

        root2.innerHTML = real_term + " - i" + complex_term;
        return;
    }

    root1.innerHTML
        = String(((-b + Math.sqrt(Math.pow(b, 2) - 4 * a * c)) / (2 * a)).toFixed(DECIMAL_PLACES));
    root2.innerHTML
        = String(((-b - Math.sqrt(Math.pow( b , 2 ) - 4 * a * c)) / (2 * a)).toFixed(DECIMAL_PLACES));

}

function check_and_calculate() {
    for (let text_box of [document.getElementById("box-a"),
        document.getElementById("box-b"),
        document.getElementById("box-c")]) {
        if (text_box.value.length === 0) {
            text_box.value = "0";
        }
    }
    if ((document.getElementById("box-a").value === "0"
        && document.getElementById("box-b").value === "0")) {
        return;
    }
    calculate();
}