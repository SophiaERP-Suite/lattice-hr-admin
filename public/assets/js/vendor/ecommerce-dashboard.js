/* orders status */
var options = {
    chart: {
        height: 352,
        type: 'line',
        stacked: false,
        toolbar: { show: false }
    },
    series: [
        {
            name: 'Orders',
            type: 'area',
            data: [35, 65, 50, 70, 55, 60, 45, 43, 75, 55, 63, 68],
            color: "#FEBB7B"
        },
        {
            name: 'Earnings',
            type: 'column',
            data: [90, 100, 70, 110, 80, 85, 60, 30, 95, 40, 85, 35],

            color: "#4F46E5", /* primary color code only*/
        },
        {
            name: 'Refunds',
            type: 'line',
            data: [10, 15, 12, 20, 18, 10, 5, 8, 10, 25, 14, 20],
            color: "var(--color-success)",
            stroke: {
                dashArray: 5,
                width: 2
            }
        }
    ],
    stroke: {
        width: [2, 0, 2],
        curve: 'smooth'
    },
    plotOptions: {
        bar: {
            columnWidth: '45%'
        }
    },
    fill: {
        opacity: [0.2, 1, 1]
    },
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    markers: {
        size: 5
    },
    xaxis: {
        type: 'category',
        labels: {
            style: {
                colors: 'var(--color-body)',
                fontSize: '12px',
                fontFamily: 'var(--ff-body)',
                fontWeight: 400,
                cssClass: 'apexcharts-xaxis-label',
            },
        },
    },
    yaxis: {
        labels: {
            style: {
                colors: 'var(--color-body)',
                fontSize: '12px',
                fontFamily: 'var(--ff-body)',
                fontWeight: 400,
                cssClass: 'apexcharts-yaxis-label',
            },
        },
    },
    legend: {
        position: "top",
        labels: {
            colors: "var(--color-body)",
        },
    },
    tooltip: {
        shared: true,
        intersect: false,
        y: {
            formatter: function (val) {
                return "$" + val;
            }
        },
    },
};
var chart = new ApexCharts(document.querySelector("#order-status"), options);
chart.render();
/* orders status */

/* Visitors Map */
var markers = [
    {
        name: "USA",
        coords: [37.0902, -95.7129],
    },
    {
        name: "Palestine",
        coords: [31.5, 34.4667],
    },
    {
        name: "Ireland",
        coords: [53.1424, -7.6921],
    },
    {
        name: "Brazil",
        coords: [-14.2350, -51.9253],
    },
];
var map = new jsVectorMap({
    map: "world_merc",
    selector: "#seles-countries",
    markersSelectable: true,
    zoomOnScroll: false,
    zoomButtons: false,
    onMarkerSelected(index, isSelected, selectedMarkers) {
        console.log(index, isSelected, selectedMarkers);
    },
    labels: {
        markers: {
            render: function (marker) {
                return marker.name;
            },
        },
    },
    markers: markers,
    markerStyle: {
        hover: {
            stroke: "#DDD",
            strokeWidth: 3,
            fill: "#FFF",
        },
        selected: {
            fill: "#ff525d",
        },
    },
    regionStyle: {
        initial: {
            stroke: "#e9e9e9",
            strokeWidth: .15,
            fill: "var(--gray-3)",
            fillOpacity: 1
        }
    },
    markerLabelStyle: {
        initial: {
            fontFamily: 'Nunito Sans, sans-serif',
            fontSize: 13,
            fontWeight: 500,
            fill: "#35373e",
        },
    },
});
/* Visitors Map */

/* Card activation js */
var swiper = new Swiper(".trendingProduct", {
    pagination: {
        el: ".bd-pagination",
        clickable: true,
    },
});

var options = {
    series: [{
        name: 'series1',
        data: [80, 50, 60, 95, 85, 95, 50]
    }],
    chart: {
        height: 161,
        width: '100%',
        type: 'area',
        offsetY: 2,
        toolbar: {
            show: false,
        },
        zoom: {
            enabled: false
        },
        sparkline: {
            enabled: true
        }
    },
    colors: ['#4F46E5'],
    fill: {
        type: "gradient",
        gradient: {
            shadeIntensity: 1,
            opacityFrom: 0.5,
            opacityTo: 0.5,
            stops: [0, 90, 100]
        }
    },
    dataLabels: {
        enabled: false
    },
    legend: {
        show: false,
    },
    stroke: {
        curve: 'smooth'
    },
    xaxis: {
        type: 'datetime',
        categories: ["2018-09-19T00:00:00.000Z", "2018-09-19T01:30:00.000Z", "2018-09-19T02:30:00.000Z", "2018-09-19T03:30:00.000Z", "2018-09-19T04:30:00.000Z", "2018-09-19T05:30:00.000Z", "2018-09-19T06:30:00.000Z"],
        axisBorder: {
            show: false,
        },
        axisTicks: {
            show: false
        },
        labels: {
            show: false,
            style: {
                fontSize: '12px',
            }
        },
        crosshairs: {
            show: false,
            position: 'front',
            stroke: {
                width: 1,
                dashArray: 3
            }
        },
        tooltip: {
            enabled: false,
            formatter: undefined,
            offsetY: 0,
            style: {
                fontSize: '12px',
            }
        }
    },
    yaxis: {
        show: false,
    },
    tooltip: {
        x: {
            format: 'dd/MM/yy HH:mm'
        },
    },
    grid: {
        show: false,
        borderColor: '#eee',
        padding: {
            top: 0,
            right: 0,
            bottom: 0,
            left: 0
        }
    },
};
var chart = new ApexCharts(document.querySelector("#widgetChartYear"), options);
chart.render();

var options = {
    series: [{
        name: 'series1',
        data: [80, 50, 60, 95, 85, 95, 50]
    }],
    chart: {
        height: 161,
        width: '100%',
        type: 'area',
        offsetY: 2,
        toolbar: {
            show: false,
        },
        zoom: {
            enabled: false
        },
        sparkline: {
            enabled: true
        }
    },
    colors: ['#FEBB7B'],
    fill: {
        type: "gradient",
        gradient: {
            shadeIntensity: 1,
            opacityFrom: 0.5,
            opacityTo: 0.5,
            stops: [0, 90, 100]
        }
    },
    dataLabels: {
        enabled: false
    },
    legend: {
        show: false,
    },
    stroke: {
        curve: 'smooth'
    },
    xaxis: {
        type: 'datetime',
        categories: ["2018-09-19T00:00:00.000Z", "2018-09-19T01:30:00.000Z", "2018-09-19T02:30:00.000Z", "2018-09-19T03:30:00.000Z", "2018-09-19T04:30:00.000Z", "2018-09-19T05:30:00.000Z", "2018-09-19T06:30:00.000Z"],
        axisBorder: {
            show: false,
        },
        axisTicks: {
            show: false
        },
        labels: {
            show: false,
            style: {
                fontSize: '12px',
            }
        },
        crosshairs: {
            show: false,
            position: 'front',
            stroke: {
                width: 1,
                dashArray: 3
            }
        },
        tooltip: {
            enabled: false,
            formatter: undefined,
            offsetY: 0,
            style: {
                fontSize: '12px',
            }
        }
    },
    yaxis: {
        show: false,
    },
    tooltip: {
        x: {
            format: 'dd/MM/yy HH:mm'
        },
    },
    grid: {
        show: false,
        borderColor: '#eee',
        padding: {
            top: 0,
            right: 0,
            bottom: 0,
            left: 0

        }
    },
};
var chart = new ApexCharts(document.querySelector("#widgetChartYear2"), options);
chart.render();

var options = {
    series: [{
        name: 'series1',
        data: [50, 80, 70, 90, 85, 95, 90]
    }],
    chart: {
        height: 161,
        width: '100%',
        type: 'area',
        offsetY: 2,
        toolbar: {
            show: false,
        },
        zoom: {
            enabled: false
        },
        sparkline: {
            enabled: true
        }
    },
    colors: ['#35BE5E'],
    fill: {
        type: "gradient",
        gradient: {
            shadeIntensity: 1,
            opacityFrom: 0.5,
            opacityTo: 0.5,
            stops: [0, 90, 100]
        }
    },
    dataLabels: {
        enabled: false
    },
    legend: {
        show: false,
    },
    stroke: {
        curve: 'smooth'
    },
    xaxis: {
        type: 'datetime',
        categories: ["2018-09-19T00:00:00.000Z", "2018-09-19T01:30:00.000Z", "2018-09-19T02:30:00.000Z", "2018-09-19T03:30:00.000Z", "2018-09-19T04:30:00.000Z", "2018-09-19T05:30:00.000Z", "2018-09-19T06:30:00.000Z"],
        axisBorder: {
            show: false,
        },
        axisTicks: {
            show: false
        },
        labels: {
            show: false,
            style: {
                fontSize: '12px',
            }
        },
        crosshairs: {
            show: false,
            position: 'front',
            stroke: {
                width: 1,
                dashArray: 3
            }
        },
        tooltip: {
            enabled: false,
            formatter: undefined,
            offsetY: 0,
            style: {
                fontSize: '12px',
            }
        }
    },
    yaxis: {
        show: false,
    },
    tooltip: {
        x: {
            format: 'dd/MM/yy HH:mm'
        },
    },
    grid: {
        show: false,
        borderColor: '#eee',
        padding: {
            top: 0,
            right: 0,
            bottom: 0,
            left: 0

        }
    },
};
var chart = new ApexCharts(document.querySelector("#widgetChartYear3"), options);
chart.render();

var options = {
    series: [{
        name: 'series1',
        data: [50, 80, 70, 90, 85, 95, 90]
    }],
    chart: {
        height: 161,
        width: '100%',
        type: 'area',
        offsetY: 2,
        toolbar: {
            show: false,
        },
        zoom: {
            enabled: false
        },
        sparkline: {
            enabled: true
        }
    },
    colors: ['#93E7FE'],
    fill: {
        type: "gradient",
        gradient: {
            shadeIntensity: 1,
            opacityFrom: 0.5,
            opacityTo: 0.5,
            stops: [0, 90, 100]
        }
    },
    dataLabels: {
        enabled: false
    },
    legend: {
        show: false,
    },
    stroke: {
        curve: 'smooth'
    },
    xaxis: {
        type: 'datetime',
        categories: ["2018-09-19T00:00:00.000Z", "2018-09-19T01:30:00.000Z", "2018-09-19T02:30:00.000Z", "2018-09-19T03:30:00.000Z", "2018-09-19T04:30:00.000Z", "2018-09-19T05:30:00.000Z", "2018-09-19T06:30:00.000Z"],
        axisBorder: {
            show: false,
        },
        axisTicks: {
            show: false
        },
        labels: {
            show: false,
            style: {
                fontSize: '12px',
            }
        },
        crosshairs: {
            show: false,
            position: 'front',
            stroke: {
                width: 1,
                dashArray: 3
            }
        },
        tooltip: {
            enabled: false,
            formatter: undefined,
            offsetY: 0,
            style: {
                fontSize: '12px',
            }
        }
    },
    yaxis: {
        show: false,
    },
    tooltip: {
        x: {
            format: 'dd/MM/yy HH:mm'
        },
    },
    grid: {
        show: false,
        borderColor: '#eee',
        padding: {
            top: 0,
            right: 0,
            bottom: 0,
            left: 0

        }
    },
};
var chart = new ApexCharts(document.querySelector("#widgetChartYear4"), options);
chart.render();

var options = {
    series: [{
        name: 'series1',
        data: [50, 80, 70, 90, 85, 95, 90]
    }],
    chart: {
        height: 161,
        width: '100%',
        type: 'area',
        offsetY: 2,
        toolbar: {
            show: false,
        },
        zoom: {
            enabled: false
        },
        sparkline: {
            enabled: true
        }
    },
    colors: ['#F991DC'],
    fill: {
        type: "gradient",
        gradient: {
            shadeIntensity: 1,
            opacityFrom: 0.5,
            opacityTo: 0.5,
            stops: [0, 90, 100]
        }
    },
    dataLabels: {
        enabled: false
    },
    legend: {
        show: false,
    },
    stroke: {
        curve: 'smooth'
    },
    xaxis: {
        type: 'datetime',
        categories: ["2018-09-19T00:00:00.000Z", "2018-09-19T01:30:00.000Z", "2018-09-19T02:30:00.000Z", "2018-09-19T03:30:00.000Z", "2018-09-19T04:30:00.000Z", "2018-09-19T05:30:00.000Z", "2018-09-19T06:30:00.000Z"],
        axisBorder: {
            show: false,
        },
        axisTicks: {
            show: false
        },
        labels: {
            show: false,
            style: {
                fontSize: '12px',
            }
        },
        crosshairs: {
            show: false,
            position: 'front',
            stroke: {
                width: 1,
                dashArray: 3
            }
        },
        tooltip: {
            enabled: false,
            formatter: undefined,
            offsetY: 0,
            style: {
                fontSize: '12px',
            }
        }
    },
    yaxis: {
        show: false,
    },
    tooltip: {
        x: {
            format: 'dd/MM/yy HH:mm'
        },
    },
    grid: {
        show: false,
        borderColor: '#eee',
        padding: {
            top: 0,
            right: 0,
            bottom: 0,
            left: 0

        }
    },
};
var chart = new ApexCharts(document.querySelector("#widgetChartYear5"), options);
chart.render();