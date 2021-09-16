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
            <input type="number" class="number-box fade" id="box-a${power_index}"></input>x<sup>${x_index}</sup> + `;
    }
    user_input.innerHTML += `<input type="number" class="number-box" id="box-a0"></input> = 0`;
}

function handle_change(dropdown_object) {
    let function_map = { linear: 1, quad: 2, cubic: 3, quart: 4 };
    draw_labels(function_map[dropdown_object.value]);
    clear_elements(['algorithm-label']);
    document.getElementsByClassName('control-buttons')[0].style.display = 'block';
}

function prettify_root(root) {
    let numbers = root.match(/-?(\d+)?\.?\d+/g);
    for (number of numbers) {
        if (isNaN(parseFloat(number))) {
            continue;
        }
        root = root.replace(number, prettify_number(number));
    }
    root = root.replace('i-', 'i');
    return root;
}

function calculate_linear(b, c, should_label = true) {
    let first_root = String(-c / b);
    should_label &&
        set_elements_html({
            root1: prettify_root(first_root)
        });
    return [first_root];
}

function calculate_quad(a, b, c, should_label = true) {
    let first_root, second_root;
    // Calculates the roots of the quadratic equation and returns an array of strings representing the roots
    if (a === 0) {
        return calculate_linear(b, c);
    }

    if (Math.pow(b, 2) - 4 * a * c < 0) {
        let real_term = String(-b / (2 * a));
        let complex_term = String(Math.sqrt(-(Math.pow(b, 2) - 4 * a * c)) / (2 * a));
        first_root = real_term + ' + i' + complex_term;

        second_root = real_term + ' - i' + complex_term;
        should_label &&
            set_elements_html({
                root1: prettify_root(first_root),
                root2: prettify_root(second_root)
            });
        return [first_root, second_root];
    }

    first_root = String((-b + Math.sqrt(Math.pow(b, 2) - 4 * a * c)) / (2 * a));
    second_root = String((-b - Math.sqrt(Math.pow(b, 2) - 4 * a * c)) / (2 * a));
    should_label &&
        set_elements_html({
            root1: prettify_root(first_root),
            root2: prettify_root(second_root)
        });
    return [first_root, second_root];
}

function calculate_cubic(a3, a2, a1, a0, should_label = true) {
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

        first_root = String(A + B - p / 3);
        second_root =
            String((-1 / 2) * (A + B) - p / 3) + ' + i' + String((Math.sqrt(3) / 2) * (A - B));
        third_root =
            String((-1 / 2) * (A + B) - p / 3) + ' - i' + String((Math.sqrt(3) / 2) * (A - B));

        should_label &&
            set_elements_html({
                root1: prettify_root(first_root),
                root2: prettify_root(second_root),
                root3: prettify_root(third_root),
                'algorithm-label': "Cardano's Algorithm"
            });
        return [first_root, second_root, third_root];
    }

    // Viete's Algorithm
    let theta = a / 3 === 0 ? 0 : Math.acos(-b / 2 / Math.pow(-a / 3, 3 / 2));
    let phi1 = theta / 3;
    let phi2 = phi1 - (2 * Math.PI) / 3;
    let phi3 = phi1 + (2 * Math.PI) / 3;
    first_root = String(2 * Math.sqrt(-a / 3) * Math.cos(phi1) - p / 3);
    second_root = String(2 * Math.sqrt(-a / 3) * Math.cos(phi2) - p / 3);
    third_root = String(2 * Math.sqrt(-a / 3) * Math.cos(phi3) - p / 3);
    should_label &&
        set_elements_html({
            root1: prettify_root(first_root),
            root2: prettify_root(second_root),
            root3: prettify_root(third_root),
            'algorithm-label': "Vie&#768te's Algorithm"
        });
    return [first_root, second_root, third_root];
}

function calculate_quart(a4, a3, a2, a1, a0, should_label = true) {
    let first_root, second_root, third_root, fourth_root;
    // Put the equation in the standard form
    a3 /= a4;
    a2 /= a4;
    a1 /= a4;
    a0 /= a4;

    let c = a3 / 4;
    let b2 = a2 - 6 * c * c;
    let b1 = a1 - 2 * a2 * c + 8 * Math.pow(c, 3);
    let b0 = a0 - a1 * c + a2 * c * c - 3 * Math.pow(c, 4);

    let cubic_roots = calculate_cubic(1, b2, (b2 * b2) / 4 - b0, -(b1 * b1) / 8, false);
    let m;
    if (cubic_roots[1].includes('i')) {
        m = cubic_roots[0];
    } else {
        m = Math.max(
            parseFloat(cubic_roots[0]),
            parseFloat(cubic_roots[1]),
            parseFloat(cubic_roots[2])
        );
    }
    m = parseFloat(m) > 0 ? parseFloat(m) : 0;

    let sigma = b1 > 0 ? 1 : -1;
    let under_sqrt = parseFloat((m * m + b2 * m + (b2 * b2) / 4 - b0).toFixed(12));
    let r = sigma * Math.sqrt(under_sqrt);
    if (Number.isNaN(r)) {
        should_label &&
            set_elements_html({
                root1: '0',
                root2: '0',
                root3: '0',
                root4: '0',
                'algorithm-label': "Ferrari's algorithm"
            });
        return ['0', '0', '0', '0'];
    }
    if (-m / 2 - b2 / 2 - r > 0) {
        first_root = String(Math.sqrt(m / 2) - c + Math.sqrt(-m / 2 - b2 / 2 - r));
        second_root = String(Math.sqrt(m / 2) - c - Math.sqrt(-m / 2 - b2 / 2 - r));
        should_label &&
            set_elements_html({
                root1: prettify_root(first_root),
                root2: prettify_root(second_root)
            });
    } else {
        first_root =
            String(Math.sqrt(m / 2) - c) + ' + i' + String(Math.sqrt(-(-m / 2 - b2 / 2 - r)));
        second_root =
            String(Math.sqrt(m / 2) - c) + ' - i' + String(Math.sqrt(-(-m / 2 - b2 / 2 - r)));

        should_label &&
            set_elements_html({
                root1: prettify_root(first_root),
                root2: prettify_root(second_root)
            });
    }
    if (-m / 2 - b2 / 2 + r > 0) {
        third_root = String(-Math.sqrt(m / 2) - c + Math.sqrt(-m / 2 - b2 / 2 + r));
        fourth_root = String(-Math.sqrt(m / 2) - c - Math.sqrt(-m / 2 - b2 / 2 + r));
        should_label &&
            set_elements_html({
                root3: prettify_root(third_root),
                root4: prettify_root(fourth_root)
            });
    } else {
        third_root =
            String(-Math.sqrt(m / 2) - c) + ' + i' + String(Math.sqrt(-(-m / 2 - b2 / 2 + r)));
        fourth_root =
            String(-Math.sqrt(m / 2) - c) + ' - i' + String(Math.sqrt(-(-m / 2 - b2 / 2 + r)));

        should_label &&
            set_elements_html({
                root3: prettify_root(third_root),
                root4: prettify_root(fourth_root)
            });
    }
    should_label &&
        (document.getElementById('algorithm-label').innerHTML += " + Ferrari's algorithm");
    return [first_root, second_root, third_root, fourth_root];
}

function set_appropriate_degree(maximum_degree, labels) {
    let actual_maximum_degree = labels.length;
    let used_values = [];
    if (maximum_degree === actual_maximum_degree) {
        return;
    }
    let dropdown = document.getElementById('equation-dropdown');
    dropdown.selectedIndex = maximum_degree;
    for (let i = 0; i <= maximum_degree; ++i) {
        used_values.push(document.getElementById(`box-a${maximum_degree - i}`).value);
    }
    draw_labels(maximum_degree);
    let text_boxes_arr = [].slice.call(document.getElementsByClassName('number-box'));
    set_text_boxes_values(text_boxes_arr, used_values);
}

function check_validity_and_fill() {
    let valid_coefficients = false;
    for (let i = 0; i <= 4; ++i) {
        let text_box = document.getElementById(`box-a${i}`);
        if (!text_box) {
            break;
        }
        if (text_box.value.length === 0 || text_box.value === '0') {
            text_box.value = '0';
            continue;
        }
        if (i > 0) {
            valid_coefficients = true;
        }
    }
    if (!valid_coefficients) {
        return false;
    }
    return true;
}

function check_and_calculate() {
    clear_elements(['solution-label', 'algorithm-label']);

    if (!check_validity_and_fill()) {
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
    set_appropriate_degree(maximum_degree, document.getElementsByClassName('solution-label'));
    equations[maximum_degree - 1](...equation_arguments);
}
