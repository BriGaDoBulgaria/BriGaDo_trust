// trustScoreChart.js

// Всички данни за месеците (от най-стария към най-новия)
const allMonthsData = [
    { label: 'Сеп', value: 72 },
    { label: 'Окт', value: 75 },
    { label: 'Ное', value: 78 },
    { label: 'Дек', value: 80 },
    { label: 'Яну', value: 82 },
    { label: 'Фев', value: 84 },
    { label: 'Мар', value: 78 },
    { label: 'Апр', value: 82 },
    { label: 'Май', value: 85 },
    { label: 'Юни', value: 88 },
    { label: 'Юли', value: 89 },
    { label: 'Авг', value: 92 }
];

let trustScoreChart = null;

function initTrustScoreChart(months = 6) {
    const canvas = document.getElementById('TrustScoreChart');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Вземи последните N месеца
    const slicedData = allMonthsData.slice(-months);
    const labels = slicedData.map(d => d.label);
    const values = slicedData.map(d => d.value);

    // Ако вече има графика, я унищожи преди да създадеш нова
    if (trustScoreChart) {
        trustScoreChart.destroy();
    }

    trustScoreChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'TrustScore',
                data: values,
                borderColor: '#154d29',
                backgroundColor: 'rgba(21, 77, 41, 0.08)',
                borderWidth: 3,
                tension: 0.4,
                fill: true,
                pointBackgroundColor: '#154d29',
                pointBorderColor: '#fff',
                pointBorderWidth: 2,
                pointRadius: 5,
                pointHoverRadius: 7
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            layout: {
                padding: {
                    top: 25 // място за числата над точките
                }
            },
            scales: {
                y: {
                    beginAtZero: false,
                    min: 60,
                    max: 100,
                    ticks: {
                        stepSize: 20,
                        color: '#adb5bd',
                        font: {
                            size: 11
                        }
                    },
                    grid: {
                        color: 'rgba(0, 0, 0, 0.05)',
                        drawBorder: false
                    },
                    border: {
                        display: false
                    }
                },
                x: {
                    grid: {
                        display: false
                    },
                    ticks: {
                        color: '#495057',
                        font: {
                            size: 12,
                            weight: '500'
                        }
                    },
                    border: {
                        display: false
                    }
                }
            },
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    backgroundColor: '#154d29',
                    titleColor: '#fff',
                    bodyColor: '#fff',
                    padding: 10,
                    cornerRadius: 8,
                    displayColors: false,
                    callbacks: {
                        label: function(context) {
                            return 'Trust Score: ' + context.parsed.y + ' pts';
                        }
                    }
                }
            }
        },
        // Плъгин за числата над точките
        plugins: [{
            id: 'valueLabels',
            afterDatasetsDraw(chart) {
                const { ctx } = chart;
                ctx.save();
                ctx.font = 'bold 12px sans-serif';
                ctx.fillStyle = '#154d29';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'bottom';

                chart.data.datasets.forEach((dataset, i) => {
                    const meta = chart.getDatasetMeta(i);
                    meta.data.forEach((point, index) => {
                        const value = dataset.data[index];
                        ctx.fillText(value, point.x, point.y - 10);
                    });
                });

                ctx.restore();
            }
        }]
    });
}

// Инициализация при зареждане
document.addEventListener('DOMContentLoaded', function() {
    const observer = new MutationObserver(function() {
        if (document.getElementById('TrustScoreChart')) {
            initTrustScoreChart(6); // по подразбиране 6 месеца
            observer.disconnect();
            setupPeriodDropdown();
        }
    });

    observer.observe(document.body, { childList: true, subtree: true });
});

// Настройка на dropdown-а
function setupPeriodDropdown() {
    const options = document.querySelectorAll('.period-option');
    const label = document.getElementById('selectedPeriodLabel');

    options.forEach(option => {
        option.addEventListener('click', function(e) {
            e.preventDefault();

            // Махни active от всички
            options.forEach(o => o.classList.remove('active'));
            // Добави active на текущия
            this.classList.add('active');

            // Вземи периода
            const period = parseInt(this.getAttribute('data-period'));
            const periodText = this.textContent;

            // Обнови label-а
            if (label) label.textContent = periodText;

            // Презареди графиката
            initTrustScoreChart(period);
        });
    });
}