(function () {
    window.onload = function () {
        document.chart = null;
        set_defaults();
        document
            .getElementById('calculate-button')
            .addEventListener('click', choose_fitting_method);
        document.getElementById('clear-button').addEventListener('click', clear_graph_elements);
    };
    function set_defaults() {
        Chart.defaults.color = '#bbbbbb';
    }

    function clear_graph_elements() {
        if (document.chart) {
            document.chart.destroy();
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

    function remove_duplicates(x_arr, y_arr) {
        let points_data = [];
        let new_x_arr = [];
        let new_y_arr = [];

        for (let i = 0; i < x_arr.length; ++i) {
            let current_points = { x: x_arr[i], y: y_arr[i] };
            if (JSON.stringify(points_data).includes(JSON.stringify(current_points))) {
                continue;
            }
            points_data.push(current_points);
            new_x_arr.push(x_arr[i]);
            new_y_arr.push(y_arr[i]);
        }

        return [points_data, new_x_arr, new_y_arr];
    }

    function draw_line_graph(points_data, x_arr, y_arr, m, b) {
        if (document.chart) {
            document.chart.destroy();
        }
        if (x_arr.length !== y_arr.length) {
            return;
        }

        let minimum_x = Math.min(...x_arr);
        let maximum_x = Math.max(...x_arr);
        let minimum_y = Math.min(...y_arr);
        let maximum_y = Math.max(...y_arr);
        let absolute_maximum_x = Math.max(Math.abs(minimum_x), Math.abs(maximum_x));
        let absolute_maximum_y = Math.max(Math.abs(minimum_y), Math.abs(maximum_y));
        let line_data = [
            {
                x: -absolute_maximum_x - 2,
                y: m * (-absolute_maximum_x - 2) + b
            },
            {
                x: absolute_maximum_x + 2,
                y: m * (absolute_maximum_x + 2) + b
            }
        ];
        const data = {
            datasets: [
                {
                    label: 'Input points',
                    data: points_data,
                    backgroundColor: '#2ce4b3',
                    pointRadius: 5
                },
                {
                    label: 'Fittest straight line',
                    data: line_data,
                    showLine: true,
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
                        position: 'center',
                        min: -absolute_maximum_x - 1,
                        max: absolute_maximum_x + 1,
                        grid: {
                            borderColor: 'rgba(187, 187, 187, 0.5)',
                            borderWidth: 2,
                            color: 'rgba(187, 187, 187, 0.3)'
                        }
                    },
                    y: {
                        min: -absolute_maximum_y - 1,
                        max: absolute_maximum_y + 1,
                        position: 'center',
                        grid: {
                            borderColor: 'rgba(187, 187, 187, 0.5)',
                            borderWidth: 2,
                            color: 'rgba(187, 187, 187, 0.3)'
                        }
                    }
                }
            }
        };
        document.chart = new Chart(document.getElementById('graph'), config);
    }

    function determine_straight_line(x_arr, y_arr) {
        // Equation: sum(y) = m * sum(x) + b * (k or n - k)
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
            set_elements_html({
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
        set_elements_html({
            'equation-label': `The fittest straight line according to The Averages Method is<br />
            y = ${m_string} ${b_string}`
        });
        return [m, b];
    }

    function choose_fitting_method() {
        let number_arr = filter_number_arr(document.getElementById('arr-text-box'));
        if (number_arr.length < 3) {
            clear_elements(['text-box']);
            return;
        }
        let [x_arr, y_arr] = separate_xy_coordinates(number_arr);
        if (x_arr.length !== y_arr.length) {
            return set_elements_html({
                'equation-label':
                    'The number of x-coordinates does not match the number of y-coordinates'
            });
        }
        let points_data;
        [points_data, x_arr, y_arr] = remove_duplicates(x_arr, y_arr);
        let line_data = determine_straight_line(x_arr, y_arr);
        if (line_data.length === 0) {
            return;
        }
        let [m, b] = line_data;
        draw_line_graph(points_data, x_arr, y_arr, m, b);
    }
})();
