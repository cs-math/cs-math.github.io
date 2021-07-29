let chart = null;

function set_defaults() {
    Chart.defaults.color = '#bbbbbb';
}

function clear_graph_elements() {
    if (chart) {
        chart.destroy();
    }
    clear_elements(['text-box', 'solution-label']);
}

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

function draw_line_graph(x_arr, y_arr, m, b) {
    if (chart) {
        chart.destroy();
    }
    if (x_arr.length !== y_arr.length) {
        return;
    }

    let points_data = [];

    for (let i = 0; i < x_arr.length; ++i) {
        points_data.push({ x: x_arr[i], y: y_arr[i] });
    }
    let minimum_x = Math.min(...x_arr) - 1;
    let maximum_x = Math.max(...x_arr) + 1;
    let line_data = [
        {
            x: minimum_x,
            y: m * minimum_x + b
        },
        {
            x: maximum_x,
            y: m * maximum_x + b
        }
    ];
    const data = {
        datasets: [
            {
                label: 'Input points',
                data: points_data,
                backgroundColor: 'rgba(106, 179, 186, 1)',
                borderColor: 'rgba(106, 179, 186, 1)'
            },
            {
                label: 'Fittest straight line',
                data: line_data,
                showLine: true,
                backgroundColor: 'rgba(187, 187, 187, 0.3)',
                borderColor: 'rgba(187, 187, 187, 0.5)'
            }
        ]
    };
    const config = {
        type: 'scatter',
        data,
        options: {
            scales: {
                x: {
                    type: 'linear',
                    position: 'bottom',
                    grid: {
                        color: 'rgba(187, 187, 187, 0.3)'
                    }
                },
                y: {
                    grid: {
                        color: 'rgba(187, 187, 187, 0.3)'
                    }
                }
            }
        }
    };
    chart = new Chart(document.getElementById('graph'), config);
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
    m_string += m === 0 ? '' : 'x';
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
    draw_line_graph(x_arr, y_arr, m, b);
    return [m, b];
}

function choose_fitting_method() {
    let number_arr = filter_number_arr(document.getElementById('arr-text-box'));
    let xy_arr = separate_xy_coordinates(number_arr);
    let x_arr = xy_arr[0];
    let y_arr = xy_arr[1];
    if (x_arr.length !== y_arr.length) {
        return set_labels({
            'equation-label':
                'The number of x-coordinates does not match the number of y-coordinates'
        });
    }
    determine_straight_line(x_arr, y_arr);
}
