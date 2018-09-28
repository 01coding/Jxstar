{
  tooltip : {
	  trigger: 'item',
	  formatter: '{a} <br/>{b} : {c} ({d}%)'
  },
  color: ['#2091CF', '#AF4E96', '#68BC31', '#DA5430', '#FEE074', '#CA8622', '#BDA29A','#6E7074'],
  series : [
	  {
		  name: '设备状态',
		  type: 'pie',
		  radius : '90%',
		  center: ['50%', '50%'],
		  data:[
			  {value:335, name:'在库'},
			  {value:310, name:'在用'},
			  {value:234, name:'停用'},
			  {value:135, name:'待报废'}
		  ],
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
}