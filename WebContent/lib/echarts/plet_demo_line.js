{
	tooltip : {
	  trigger: 'axis'
	},
	legend: {
	  data:['时间开动率','故障强度率']
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
		  data : ['一月','二月','三月','四月','五月','六月','七月']
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
	series : [
	  {
		  name:'时间开动率',
		  type:'line',
		  data:[86, 80, 92, 78, 85, 88, 72],
		  markPoint : {
			  data : [
				  {type : 'max', name: '最大值'},
				  {type : 'min', name: '最小值'}
			  ]
		  },
		  markLine : {
			  data : [
				  {type : 'average', name: '平均值'}
			  ]
		  }
	  },
	  {
		  name:'故障强度率',
		  type:'line',
		  data:[4, 8, 2, 10, 6, 5, 12],
		  markPoint : {
			  data : [
				  {name : '月最低', value : -2, xAxis: 1, yAxis: -1.5}
			  ]
		  },
		  markLine : {
			  data : [
				  {type : 'average', name : '平均值'}
			  ]
		  }
	  }
	]
}