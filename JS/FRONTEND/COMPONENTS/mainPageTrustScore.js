// mainPageTrustScore.js
function initTrustScoreChart() {
    const canvas = document.getElementById('TrustScoreChart');
    
    if (canvas) {
        const ctx = canvas.getContext('2d');
        
        if (ctx) {
            new Chart(ctx, {
                type: 'line',
                data: {
                    labels: ['Януари', 'Февруари', 'Март', 'Април', 'Май', 'Юни', 'Юли', 'Август'],
                    datasets: [{
                        label: 'TrustScore',
                        data: [78, 82, 85, 88, 86, 91, 90, 93],
                        borderColor: '#154d29',
                        backgroundColor: 'rgba(21, 77, 41, 0.1)',
                        borderWidth: 3,
                        tension: 0.4,
                        fill: true,
                        pointBackgroundColor: '#154d29',
                        pointBorderColor: '#fff',
                        pointBorderWidth: 2,
                        pointRadius: 6,
                        pointHoverRadius: 8
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        y: {
                            beginAtZero: false,
                            min: 70,
                            max: 100,
                            ticks: {
                                stepSize: 5,
                                callback: function(value) {
                                    return value;
                                }
                            },
                            grid: {
                                color: 'rgba(0, 0, 0, 0.1)'
                            }
                        },
                        x: {
                            grid: {
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
                            callbacks: {
                                label: function(context) {
                                    return ' TrustScore: ' + context.parsed.y + ' pts';
                                }
                            }
                        }
                    }
                }
            });
        }
    }
}

// Наблюдавай DOM за промени - когато canvas се появи, стартирай графиката
document.addEventListener('DOMContentLoaded', function() {
    const observer = new MutationObserver(function(mutations) {
        if (document.getElementById('TrustScoreChart')) {
            initTrustScoreChart();
            observer.disconnect();
        }
    });

    observer.observe(document.body, { childList: true, subtree: true });
});