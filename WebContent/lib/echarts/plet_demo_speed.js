{
    tooltip : {
        formatter: "{a} <br/>{b} : {c}%"
    },
    grid: {
        top: '2%'
    },
    series: [{
		name: '业务指标',
		type: 'gauge',
		radius: '90%',
        center: ['50%', '55%'],
		axisLine: {            // 坐标轴线
			lineStyle: {       // 属性lineStyle控制线条样式
				width: 15,
                color: [[0.6, '#DA5430'], [0.9, '#EC971F'], [1, '#449D44']]
			}
		},
		axisTick: {            // 坐标轴小标记
			length:19,        // 属性length控制线长
			lineStyle: {       // 属性lineStyle控制线条样式
				color: 'auto'
			}
		},
		splitLine: {           // 分隔线
			length:26,         // 属性length控制线长
			lineStyle: {       // 属性lineStyle（详见lineStyle）控制线条样式
				color: 'auto'
			}
		},
		pointer: {
			width:6
		},
		detail: {formatter:'{value}%'},
		data: [{value: 92, name: '完好率'}]
	}]
}