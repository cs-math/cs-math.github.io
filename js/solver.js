function draw_labels(highest_degree) {
    let solution_box = document.getElementsByClassName('solution-box')[0];
    let user_input = document.getElementsByClassName('user-input')[0];

    solution_box.innerHTML = null;
    user_input.innerHTML = null;
    for (let i = 0; i < highest_degree; ++i) {
        solution_box.innerHTML += `
            <div class="root">\
            <label>x<sub>${i + 1}</sub> = </label>\
            <label class="solution-label" id="root${i + 1}"></label>\
            </div>
        `;
        let power_index = highest_degree - i;
        let x_index = power_index == 1 ? '' : power_index;
        user_input.innerHTML += `
            <input type="number" class="number-box" id="box-a${power_index}"></input>x<sup>${x_index}</sup> + `;
    }
    user_input.innerHTML += `<input type="number" class="number-box" id="box-a0"></input> = 0`;
}

function handle_change(dropdown_object) {
    let function_map = { quad: 2, cubic: 3, quart: 4 };
    draw_labels(function_map[dropdown_object.value]);
}

function calculate_linear(b, c) {
    let root1 = document.getElementById('root1');
    root1.innerHTML = String((-c / b).toFixed(DECIMAL_PLACES));
    return [root1.innerHTML];
}

function calculate_quad(a, b, c) {
    // Calculates the roots of the quadratic equation and returns an array of strings representing the roots
    let root1 = document.getElementById('root1');
    let root2 = document.getElementById('root2');

    if (a === 0) {
        return calculate_linear(b, c);
    }

    if (Math.pow(b, 2) - 4 * a * c < 0) {
        let real_term = String((-b / (2 * a)).toFixed(DECIMAL_PLACES));
        let complex_term = String(
            (Math.sqrt(-(Math.pow(b, 2) - 4 * a * c)) / (2 * a)).toFixed(DECIMAL_PLACES)
        );
        complex_term = Math.abs(complex_term);
        root1.innerHTML = real_term + ' + i' + complex_term;

        root2.innerHTML = real_term + ' - i' + complex_term;
        return [root1.innerHTML, root2.innerHTML];
    }

    root1.innerHTML = String(
        ((-b + Math.sqrt(Math.pow(b, 2) - 4 * a * c)) / (2 * a)).toFixed(DECIMAL_PLACES)
    );
    root2.innerHTML = String(
        ((-b - Math.sqrt(Math.pow(b, 2) - 4 * a * c)) / (2 * a)).toFixed(DECIMAL_PLACES)
    );
    return [root1.innerHTML, root2.innerHTML];
}

function calculate_cubic(a3, a2, a1, a0) {
    console.log('===================');
    let first_root, second_root, third_root;
    if (a0 === 0) {
        first_root = '0'
        let second_third_root = calculate_quad(a3, a2, a1);
        second_root = second_third_root[0];
        third_root = second_third_root[1];
        document.getElementById('root1').innerHTML = first_root;
        document.getElementById('root2').innerHTML = second_root;
        document.getElementById('root3').innerHTML = third_root;
        return [first_root, second_root, third_root]
    }
    let p = a2 / a3;
    let q = a1 / a3;
    let r = a0 / a3;
    console.log(p, q, r);

    let a = q - Math.pow(p, 2) / 3;
    let b = r + (2 / 27) * Math.pow(p, 3) - (1 / 3) * p * q;
    console.log(a, b);

    let A = Math.cbrt(-b / 2 + Math.sqrt(Math.pow(b, 2) / 4 + Math.pow(a, 3) / 27));
    let B = Math.cbrt(-b / 2 - Math.sqrt(Math.pow(b, 2) / 4 + Math.pow(a, 3) / 27));
    console.log(A, B);

    first_root = (A + B - p / 3).toFixed(DECIMAL_PLACES);
    second_root = String(((-1 / 2) * (A + B) - p / 3).toFixed(DECIMAL_PLACES))
        + ' + i' + String(((Math.sqrt(3) / 2) * (A - B)).toFixed(DECIMAL_PLACES));
    third_root = String(((-1 / 2) * (A + B) - p / 3).toFixed(DECIMAL_PLACES))
        + ' - i' + String(((Math.sqrt(3) / 2) * (A - B)).toFixed(DECIMAL_PLACES));

    document.getElementById('root1').innerHTML = first_root;
    document.getElementById('root2').innerHTML = second_root;
    document.getElementById('root3').innerHTML = third_root;
    return [first_root, second_root, third_root];
}

function calculate_quart(a4, a3, a2, a1, a0) {}

function check_and_calculate() {
    clear_elements(['solution-label']);

    let valid_coefficients = false;
    for (let i = 0; i <= 4; ++i) {
        let text_box = document.getElementById(`box-a${i}`);
        if (text_box && text_box.value.length === 0) {
            text_box.value = '0';
            continue;
        }
        if (i > 0) {
            valid_coefficients = true;
        }
    }
    if (!valid_coefficients) {
        return;
    }

    let equations = [calculate_linear, calculate_quad, calculate_cubic, calculate_quart];
    let equation_arguments = [
        parseFloat(document.getElementById('box-a1').value),
        parseFloat(document.getElementById('box-a0').value)
    ];
    let maximum_degree = 1;

    for (let i = 1; i <= 4; ++i) {
        let box = document.getElementById(`box-a${i}`);
        if (!box) {
            break;
        }
        if (box.value === '0') {
            continue;
        }
        maximum_degree = i;
    }

    for (let i = 2; i <= maximum_degree; ++i) {
        equation_arguments.unshift(parseFloat(document.getElementById(`box-a${i}`).value));
    }

    equations[maximum_degree - 1](...equation_arguments);
}
