import mx.core.UIObject;
import mx.core.UIComponent;

[Event("draw")]
[Event("close")]
[TagName("mloaderWindow")]

dynamic class it.sephiroth.mloaderWindow extends UIComponent {
	static var symbolName:String = "mloaderWindow";
	static var symbolOwner = mloaderWindow;
	var className:String = "it.sephiroth.mloaderWindow";
	var progress:MovieClip;
	var border_mc:MovieClip;
	var label_txt:TextField;
	var title_mc:MovieClip;
	var shadow_mc:MovieClip;
	var msg:String;
	var modalWindow:MovieClip;
	var ls_stage:Object;
	private var bar_fg:MovieClip;
	private var max_w = 128;
	private var min_w = 1;
	private var dispatchEvent:Function;
	public var addEventListener:Function;
	public var removeEventListener:Function;
	public var progressBar:Boolean
	public var  isModal:Boolean
	private var centered:Boolean
	
	function mloaderWindow() {
		progressBar = true
		
		ls_stage = new Object();
		ls_stage.target = this
		ls_stage.onResize = function(){
			if(this.target.centered){
				this.target.setPosition((Stage.width/2) - this.target.getSize()[0]/2, (Stage.height/2) - this.target.getSize()[1]/2)
			} else {
				this.target.updateModalWindow();
			}
		}
		Stage.addListener(ls_stage);
	}

	function init(Void):Void {
		super.init();
		mx.events.EventDispatcher.initialize(this);
		this._x = Math.floor(this._x)
		this._y = Math.floor(this._y)
		this.label_txt.autoSize = "left";
		this.bar_fg = progress.bar_fg;
		this.bar_fg._width = this.min_w;	
		this.modalWindow._visible = false;
		this.modalWindow.onPress = function(){}
		this.modalWindow.useHandCursor = false;
		this.modalWindow._width  = 0;
		this.modalWindow._height = 0;
	}
	function draw(){
		super.draw();
	}
	function createChildren(Void):Void
	{
		super.createChildren();
	}	
	public function set value(obj:Number):Void {
		obj = Math.ceil(obj);
		if (obj<0) {
			obj = 1;
		}
		if (obj>100) {
			obj = 100;
		}
		progress.bar_fg._width = (this.max_w/100)*obj;
	}
	public function get value():Number {
		return (this.bar_fg._width/this.max_w)*100;
	}
	
	[Inspectable(defaultValue="loading...")]
	public function set label(str:String):Void {
		this.label_txt.text = str;
		this.invalidate();
	}
	public function get label():String {
		return this.label_txt.text;
	}
	[Inspectable(defaultValue=0xFF6600)]
	public function set borderColor(str):Void{
		var col1:Color = new Color(this.border_mc.border_up.line)
		var col2:Color = new Color(this.border_mc.border_down.line)
		var col3:Color = new Color(this.border_mc.border_middle.line)
		col1.setRGB(str)
		col2.setRGB(str)
		col3.setRGB(str)
	}

	public function open(modal:Boolean, animate:Boolean, center:Boolean):Void {
		if(modal == true){
			isModal = true;
		} else {
			isModal = false;
		}
		centered = center
		invalidate();
		if(centered){ 
			setPosition((Stage.width/2) - getSize()[0]/2, (Stage.height/2) - getSize()[1]/2)		
		}
		var target_h = border_mc._height;
		
		if(animate == true || animate == undefined){
			progress._visible  = false;
			label_txt._visible = false;
			title_mc._visible  = false;
			shadow_mc._visible = false;
			this.accSize(0);
			border_mc.dy = 0;
			border_mc.onEnterFrame = function() {
				this.dy = (this.dy+(target_h - this._height)/1.6)/2.3;
				this._parent.accSize(this._parent.height + this.dy);
				if (Math.abs(this.dy)<.2) {
					delete this.onEnterFrame;
					this._parent.adjustContents()
					this._parent.progress._visible  = this._parent.progressBar;
					this._parent.label_txt._visible = true;
					this._parent.title_mc._visible  = true;
					this._parent.shadow_mc._visible = true;
					this._parent.adjustShadow();
					this._parent.dispatchEvent({type:"draw", target:this._parent});
				}
			}
		} else {
			invalidate();
			this.dispatchEvent({type:"draw", target:this});
		}
	}

	public function close(delay:Number):Void {
		if(delay == undefined) delay = 0
		var t1 = getTimer();
		border_mc.onEnterFrame = function(){
			if(getTimer() - t1 > (delay*1000)){
				this._parent.progress._visible = false;
				this._parent.label_txt._visible = false;
				this._parent.title_mc._visible = false;
				this._parent.shadow_mc._visible = false;
				delete this.onEnterFrame;
				this.onEnterFrame = function() {
					if(this._alpha < 0){
						delete this.onEnterFrame;
						this._visible = false;
						this._alpha = 100;
						this._parent.dispatchEvent({type:"close", target:this._parent});
					}
					this._alpha -= 10;
				}
			}
		};
	}

	public function invalidate():Void {
		var gb:Object = new Object();
		this.adjustContents();
		gb = progress.getBounds(this.border_mc);
		if(this.progressBar == false){
			progress._visible = false;
			gb.yMax -= progress._height;
		}
		if(this.isModal){
			this.updateModalWindow();
		} else {
			this.modalWindow._visible = false;
		}
		this.border_mc.border_down._y = Math.floor(gb.yMax+10) + 0.5
		this.border_mc.border_middle._height = this.border_mc.border_down._y - this.border_mc.border_middle._y
		this.adjustShadow();
	}
	
	private function updateModalWindow(){
		if(this.isModal){
			this.modalWindow._visible = true
			this.modalWindow._width  = Stage.width;
			this.modalWindow._height = Stage.height;
			var point = new Object();
			point.x = this.border_mc._x
			point.y = this.border_mc._y
			this.localToGlobal(point);
			var gb = this._parent.getBounds(border_mc)
			this.modalWindow._x = -point.x+border_mc._x
			this.modalWindow._y = -point.y+border_mc._y
		}
	}
	

	private function adjustContents():Void{
		var gb:Object = new Object();
		gb = this.border_mc.border_up.getBounds(this)
		title_mc._y  = Math.floor(gb.yMin + 20)
		label_txt._y = Math.floor(title_mc._y + 16)
		progress._y  = Math.ceil(this.label_txt._y+this.label_txt.textHeight+5);
	}
	

	private function accSize(size:Number):Void{
		this.border_mc.border_up._y   = - size/2
		this.border_mc.border_down._y = (this.border_mc.border_up._y + this.border_mc.border_up._height) + size
		this.border_mc.border_middle._y = this.border_mc.border_up._y + this.border_mc.border_up._height
		this.border_mc.border_middle._height = (this.border_mc.border_down._y - this.border_mc.border_middle._y)
	}
	

	function get height():Number{
		return (this.border_mc.border_down._y - this.border_mc.border_up._y) - this.border_mc.border_up._height
	}
	

	private function adjustShadow():Void{
		this.shadow_mc.shadow_up._y = this.border_mc.border_up._y + 4
		this.shadow_mc.shadow_down._y = this.border_mc.border_down._y + 4
		this.shadow_mc.shadow_middle._height = this.border_mc.border_middle._height
		this.shadow_mc.shadow_middle._y = this.border_mc.border_middle._y + 4
	}
	

	public function getSize():Array{
		return [border_mc._x, border_mc._y]
	}
	
	public function setPosition(x:Number, y:Number):Void{
		modalWindow._width  = 0
		modalWindow._height = 0
		modalWindow._x = border_mc._x
		modalWindow._y = border_mc._y
		_x = Math.round(x - border_mc._x/2)
		_y = Math.round(y - border_mc._y/2)
		updateModalWindow();
	}
	
}
