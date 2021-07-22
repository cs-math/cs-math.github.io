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
    if (a3 === 0) {
        return calculate_quad(a2, a1, a0);
    }

    let first_root, second_root, third_root;
    let p = a2 / a3;
    let q = a1 / a3;
    let r = a0 / a3;

    let a = q - Math.pow(p, 2) / 3;
    let b = r + (2 / 27) * Math.pow(p, 3) - (1 / 3) * p * q;

    // Cardano's Algorithm
    if (parseFloat(((b * b) / 4 + (a * a * a) / 27).toFixed(12)) > 0) {
        let A = Math.cbrt(-b / 2 + Math.sqrt(Math.pow(b, 2) / 4 + Math.pow(a, 3) / 27));
        let B = Math.cbrt(-b / 2 - Math.sqrt(Math.pow(b, 2) / 4 + Math.pow(a, 3) / 27));

        first_root = (A + B - p / 3).toFixed(DECIMAL_PLACES);
        second_root =
            String(((-1 / 2) * (A + B) - p / 3).toFixed(DECIMAL_PLACES)) +
            ' + i' +
            String(((Math.sqrt(3) / 2) * (A - B)).toFixed(DECIMAL_PLACES));
        third_root =
            String(((-1 / 2) * (A + B) - p / 3).toFixed(DECIMAL_PLACES)) +
            ' - i' +
            String(((Math.sqrt(3) / 2) * (A - B)).toFixed(DECIMAL_PLACES));

        set_labels({
            root1: first_root,
            root2: second_root,
            root3: third_root,
            'algorithm-label': "Cardano's Algorithm"
        });
        return [first_root, second_root, third_root];
    }

    // Viete's Algorithm
    let theta = a / 3 === 0 ? 0 : Math.acos(-b / 2 / Math.pow(-a / 3, 3 / 2));
    let phi1 = theta / 3;
    let phi2 = phi1 - (2 * Math.PI) / 3;
    let phi3 = phi1 + (2 * Math.PI) / 3;
    first_root = (2 * Math.sqrt(-a / 3) * Math.cos(phi1) - p / 3).toFixed(DECIMAL_PLACES);
    second_root = (2 * Math.sqrt(-a / 3) * Math.cos(phi2) - p / 3).toFixed(DECIMAL_PLACES);
    third_root = (2 * Math.sqrt(-a / 3) * Math.cos(phi3) - p / 3).toFixed(DECIMAL_PLACES);
    set_labels({
        root1: first_root,
        root2: second_root,
        root3: third_root,
        'algorithm-label': "Vie&#768te's Algorithm"
    });
    return [first_root, second_root, third_root];
}

function calculate_quart(a4, a3, a2, a1, a0) {
    // Put the equation in the standard form
    a3 /= a4;
    a2 /= a4;
    a1 /= a4;
    a0 /= a4;

    let c = a3 / 4;
    let b2 = a2 - 6 * c * c;
    let b1 = a1 - 2 * a2 * c + 8 * Math.pow(c, 3);
    let b0 = a0 - a1 * c + a2 * c * c - 3 * Math.pow(c, 4);

    let cubic_roots = calculate_cubic(1, b2, (b2 * b2) / 4 - b0, -(b1 * b1) / 8);
    let m;
    if (cubic_roots[1].includes('i'))
    {
        m = cubic_roots[0];
    }
    m = Math.max(parseFloat(cubic_roots[0]), parseFloat(cubic_roots[1]),
        parseFloat(cubic_roots[2]));
    m = parseFloat(m) > 0 ? parseFloat(m) : 0;

    let sigma = b1 > 0 ? 1 : -1;
    let r = sigma * Math.sqrt(m * m + b2 * m + (b2 * b2) / 4 - b0);
    if (Number.isNaN(r)) {
        return set_labels({
            root1: '0',
            root2: '0',
            root3: '0',
            root4: '0',
            'algorithm-label': 'Ferrari\'s algorithm'
        });
    }
    if (-m / 2 - b2 / 2 - r > 0) {
        set_labels({
            root1: (Math.sqrt(m / 2) - c + Math.sqrt(-m / 2 - b2 / 2 - r)).toFixed(DECIMAL_PLACES),
            root2: (Math.sqrt(m / 2) - c - Math.sqrt(-m / 2 - b2 / 2 - r)).toFixed(DECIMAL_PLACES)
        });
    } else {
        set_labels({
            root1:
                (Math.sqrt(m / 2) - c).toFixed(DECIMAL_PLACES) +
                ' + i' +
                Math.sqrt(-(-m / 2 - b2 / 2 - r)).toFixed(DECIMAL_PLACES),
            root2:
                (Math.sqrt(m / 2) - c).toFixed(DECIMAL_PLACES) +
                ' - i' +
                Math.sqrt(-(-m / 2 - b2 / 2 - r)).toFixed(DECIMAL_PLACES)
        });
    }
    if (-m / 2 - b2 / 2 + r > 0) {
        set_labels({
            root3: (-Math.sqrt(m / 2) - c + Math.sqrt(-m / 2 - b2 / 2 + r)).toFixed(DECIMAL_PLACES),
            root4: (-Math.sqrt(m / 2) - c - Math.sqrt(-m / 2 - b2 / 2 + r)).toFixed(DECIMAL_PLACES)
        });
    } else {
        set_labels({
            root3:
                (-Math.sqrt(m / 2) - c).toFixed(DECIMAL_PLACES) +
                ' + i' +
                Math.sqrt(-(-m / 2 - b2 / 2 + r)).toFixed(DECIMAL_PLACES),
            root4:
                (-Math.sqrt(m / 2) - c).toFixed(DECIMAL_PLACES) +
                ' - i' +
                Math.sqrt(-(-m / 2 - b2 / 2 + r)).toFixed(DECIMAL_PLACES)
        });
    }
    document.getElementById('algorithm-label').innerHTML += ' + Ferrari\'s algorithm';
}

function check_and_calculate() {
    clear_elements(['solution-label', 'algorithm-label']);

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
