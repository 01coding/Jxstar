/*!
 * Copyright 2011 Guangzhou Donghong Software Technology Inc.
 * Licensed under the www.jxstar.org
 */
 
/**
 * 图表相关工具类。用ECharts包实现。
 * 
 * @author TonyTan
 * @version 1.0, 2016-02-20
 */

JxChart = {
	green:'#449D44', 
	yellow:'#EC971F', 
	red:'#DA5430',
	
	//构建速度仪表盘，datas格式为：[[0.6, JxChart.red], [0.9, JxChart.yellow], [1, JxChart.green]] 
	//参数说明：ct -- 容器对象, value -- 刻度值, datas -- 数据值, title -- 标题
	speedChart: function(config) {
		var chart = echarts.init(config.ct);
		
		var option = {
			tooltip : {
				formatter: "{a} <br/>{b} : {c}%"
			},
			grid: {
				top: '2%'
			},
			series: [{
				name: config.title,
				type: 'gauge',
				radius: '90%',
				center: ['50%', '55%'],
				axisLine: {            // 坐标轴线
				  lineStyle: {       // 属性lineStyle控制线条样式
					width: 15,
					color: config.datas     //[[0.6, '#DA5430'], [0.9, '#EC971F'], [1, '#449D44']]
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
				data: [{value: config.value, name: config.title}]
		  	}]
		};

		chart.setOption(option);
		return chart;
	},
	
	
	//构建线状图表 ydatas 数据格式：[{name:'xxx', type:'line', data:[2,13,4...]},...]
	//参数说明：ct -- 容器对象, xdatas -- x数据值, ydatas -- y数据值, titles -- 主标题, xtitle -- x标题, ytitle -- y标题
	lineChart: function(config) {
		var chart = echarts.init(config.ct);
		var option = {
			  tooltip : {
			    trigger: 'axis'
			  },
			  legend: {
			    data:config.titles
			  },
			  color: ['#DA5430', '#2091CF', '#68BC31', '#AF4E96', '#FEE074', '#CA8622', '#BDA29A','#6E7074'],
			  grid: {
			    left: '3%',
			    right: '4%',
			    bottom: '3%',
			    containLabel: true
			  },
			  xAxis : [
			    {
			      type : 'category',
			      boundaryGap : false,
			      data : config.xdatas
			    }
			  ],
			  yAxis : [
			    {
			      type : 'value',
			      axisLabel : {
			        formatter: '{value} %'
			      }
			    }
			  ],
			  series : config.ydatas
		};
		
		chart.setOption(option);
		return chart;
	},
	
	//构建矩状图 ydatas格式：[{name:'xxx', type:'bar', data:[2,3,4...]}...]
	//参数说明：ct -- 容器对象, xdatas -- x数据值, ydatas -- y数据值, title -- 主标题, xtitle -- x标题, ytitle -- y标题
	columnChart: function(config) {
		var chart = echarts.init(config.ct);
		var titles = [];
		for (var i = 0; i < config.ydatas.length; i++){
			titles[titles.length] = config.ydatas[i].name;
		}
		var option = {
		    tooltip : {
		        trigger: 'axis',
		        axisPointer : {            // 坐标轴指示器，坐标轴触发有效
		            type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
		        }
		    },
		    legend: {
		        data:titles
		    },
		    color: ['#DA5430', '#2091CF', '#68BC31', '#AF4E96', '#FEE074', '#CA8622', '#BDA29A','#6E7074'],
		    grid: {
		        left: '3%',
		        right: '4%',
		        bottom: '3%',
		        containLabel: true
		    },
		    xAxis : [
		        {
		            type : 'category',
		            data : config.xdatas
		        }
		    ],
		    yAxis : [
		        {
		            type : 'value'
		        }
		    ],
		    series : config.ydatas
		};
		chart.setOption(option);
		
		return chart;
	},
	
	//构建饼状图表
	//参数说明：ct -- 容器对象, datas -- 数据值, title -- 标题
	//数据值格式：[{value:335, name:'在库'}, {value:335, name:'在库'}, ...]
	pieChart: function(config) {
		var chart = echarts.init(config.ct);

		var option = {
			  tooltip : {
			    trigger: 'item',
			    formatter: '{a} <br/>{b} : {c} ({d}%)'
			  },
			  color: ['#68BC31', '#AF4E96', '#2091CF', '#DA5430', '#FEE074', '#CA8622', '#BDA29A','#6E7074'],
			  series : [
			    {
			      name: config.title,
			      type: 'pie',
			      radius : '80%',
			      center: ['50%', '50%'],
			      data: config.datas,
			      itemStyle: {
			        normal: {
			          borderColor: '#fff',
			          borderWidth: 1
			        },
			        emphasis: {
			          borderColor: '#fff',
			          borderWidth: 1,
			          shadowBlur: 10,
			          shadowOffsetX: 0,
			          shadowColor: 'rgba(0, 0, 0, 0.5)'
			        }
			      }
			    }
			  ]
		};
		
		chart.setOption(option);
		return chart;
	}
};