function separate_xy_coordinates(number_arr) {
    let x_arr = [];
    let y_arr = [];
    for (let i = 0; i < number_arr.length; ++i) {
        if (i % 2 == 0) {
            x_arr.push(number_arr[i]);
            continue;
        }
        y_arr.push(number_arr[i]);
    }
    return [x_arr, y_arr];
}

function determine_straight_line(x_arr, y_arr) {
    // Equation: sum(y) = m * sum(x) + b
    // Unknowns: m, b
    /*
        k = n / 2 or (n-1) / 2
        a11 = sum of x from 1 to k
        a12 = k
        a21 = sum of x from k + 1 to n
        a22 = n - k
        b1 = sum of y from 1 to k
        b2 = sum of y from k + 1 to n
        delta = a11 * a22 - a12 * a21
        m = (a22 * b1 - a12 * b2) / delta
        b = (-a21 * b1 + a11 * b2) / delta
        Final result: mx + b
    */
    if (x_arr.length !== y_arr.length) {
        return set_labels({
            'equation-label':
                'The number of x-coordinates does not match the number of y coordinates'
        });
    }
    let n = x_arr.length;
    let k;
    if (n % 2 == 0) {
        k = n / 2;
    } else {
        k = (n - 1) / 2;
    }
    let a11 = get_arr_sum(x_arr.slice(0, k));
    let a12 = k;
    let a21 = get_arr_sum(x_arr.slice(k));
    let a22 = n - k;
    let b1 = get_arr_sum(y_arr.slice(0, k));
    let b2 = get_arr_sum(y_arr.slice(k));
    let delta = a11 * a22 - a12 * a21;
    if (delta === 0) {
        set_labels({
            'equation-label':
                'Could not determine the straight line using AVM (could not solve the equations)'
        });
        return [];
    }
    let m = (a22 * b1 - a12 * b2) / delta;
    let b = (-a21 * b1 + a11 * b2) / delta;
    let m_string = m === 1 ? '' : String(prettify_number(m));
    m_string += 'x';
    let b_string = b === 0 ? '' : String(prettify_number(b));
    if (b <= 0) {
        b_string = b_string.replace('-', ' - ');
    } else {
        b_string = ' + ' + b_string;
    }
    set_labels({
        'equation-label': `The fittest straight line according to The Averages Method is<br />
        y = ${m_string} ${b_string}`
    });
    return [m, b];
}

function choose_fitting_method() {
    let number_arr = filter_number_arr(document.getElementById('arr-text-box'));
    let xy_arr = separate_xy_coordinates(number_arr);
    determine_straight_line(xy_arr[0], xy_arr[1]);
}
