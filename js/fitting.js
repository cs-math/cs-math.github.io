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

function determine_straight_line() {
    let number_arr = filter_number_arr(document.getElementById('arr-text-box'));
    let xy_arr = separate_xy_coordinates(number_arr);
    let x_arr = xy_arr[0];
    let y_arr = xy_arr[1];
    console.log(x_arr, y_arr);
    let n = x_arr.length;
    let k;
    if (n % 2 == 0) {
        k = n / 2;
    } else {
        k = (n - 1) / 2;
    }
    console.log(k);
    let a11 = get_arr_sum(x_arr.slice(0, k + 1));
    let a12 = k;
    let a21 = get_arr_sum(x_arr.slice(k + 1));
    let a22 = n - k;
    let b1 = get_arr_sum(y_arr.slice(0, k + 1));
    let b2 = get_arr_sum(y_arr.slice(k + 1));
    let delta = a11 * a22 - a12 * a21;
    let m = (a22 * b1 - a12 * b2) / delta;
    let b = (-a21 * b1 + a11 * b2) / delta;
    console.log(m, b);
}
