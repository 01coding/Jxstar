import flash.display.BitmapData;
import flash.geom.Rectangle;
import flash.geom.ColorTransform;

class it.sephiroth.PrintScreen {
	
	public var addListener:Function
	public var broadcastMessage:Function
	
	private var id:   Number;
	public  var record:LoadVars;
	
	function PrintScreen(){
		AsBroadcaster.initialize( this );
	}
	public function print(mc:MovieClip, x:Number, y:Number, w:Number, h:Number,mc_x:Number ,mc_y:Number){
		broadcastMessage("onStart", mc);
		if(x == undefined) x = 0;
		if(y == undefined) y = 0;
		if(w == undefined) w = mc._width;
		if(h == undefined) h = mc._height;
		var bmp:BitmapData = new BitmapData(w + mc_x, h + mc_y, false);
		record = new LoadVars();
		record.width  = w
		record.height = h
		record.cols   = 0
		record.rows   = 0
		bmp.draw(mc, mc.transform.matrix, new ColorTransform(), 1, new Rectangle(x + mc_x, y + mc_y, w, h));
		id = setInterval(copysource, 1, this, mc, bmp ,mc_x ,mc_y);
	}
	
	private function copysource(scope, movie, bit ,mc_x ,mc_y){
		var pixel:Number
		var str_pixel:String
		
		for(var b = 0; b < 20 && scope.record.rows < bit.height; b++){
			scope.record["px" + scope.record.rows] = new Array();
			for(var a = mc_x; a < bit.width; a++){
				pixel     = bit.getPixel(a, scope.record.rows + mc_y)
				str_pixel = pixel.toString(16)
				//if(pixel == 0xFFFFFF) str_pixel = "";	
				scope.record["px" + scope.record.rows].push(str_pixel)
			}
			scope.record.rows += 1
		}
		
		scope.broadcastMessage("onProgress", movie, scope.record.rows, bit.height)
		if(scope.record.rows >= bit.height){
			clearInterval(scope.id)
			scope.broadcastMessage("onComplete", movie, scope.record)
			bit.dispose();
		}
	}
}
