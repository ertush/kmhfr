import React from 'react';

import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'




const BarChart = props => {

    const options = {
        chart: {
            type: 'column'
        },
        title: {
            text: props.title || ''
        },
        colors: ['#1f77b4', '#ff7f0e', '#5ab747', '#9217a4'],
        exporting: {
            enabled: true
        },
        xAxis: {
            categories: props.categories || [],
            title: {
                text: props.xaxistitle || ''
            }
        },
        yAxis: {
            title: {
                text: props.yaxistitle || '',
                align: 'high'
            },
            labels: {
                overflow: 'justify'
            },
        },
        tooltip: {
            valueSuffix: props.tooltipsuffix || ''
        },
        plotOptions: {
            bar: {
                dataLabels: {
                    enabled: true
                }
            }
        },
        legend: {
            layout: 'vertical',
            align: 'right',
            verticalAlign: 'top',
            floating: true,
            borderWidth: 1,
            backgroundColor: '#FFFFFF',
            shadow: true
        },
        credits: {
            enabled: false
        },
        series: props.data
    }

    return (
        <div
            className="flex flex-col items-start justify-center p-2 w-full"
        >
            <hr className="my-2 border-b border-gray-300" />
          
            <div className="flex flex-col items-center justify-center w-full p-2 rounded bg-white shadow" style={{ minHeight: '350px' }}>
                <div className="w-full p-0">
                    {props.data.length <= 0 ? (
                        <div className="p-2 bg-blue-200 border rounded border-blue-600 shadow-sm">
                            <p className="text-gray-800 text-base font-medium">Loading&hellip;</p>
                        </div>
                    ) : (
                        <HighchartsReact highcharts={Highcharts} options={options} />
                    )}
                </div>
            </div>
        </div>
    );
};

export default BarChart;