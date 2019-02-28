const sendTimeInterval = 200, byteMax = 255, separator = " ";

function mapToInterval(val, intA, intB, toIntA, toIntB) {
	return (val - intA) * (toIntB - toIntA) / (intB - intA) + toIntA;
}

class JoystickElement extends InputHandler{
	constructor(canvas) {
		super(canvas);
		
		this.leverX = 0, this.leverY = 0;
		this.azimuth = 0, this.polarRad = 0;
		
		this._moving = false;
		this._lastSentTime = new Date().getTime();
		
		this.addEventListener("move", this.onMove);
		this.addEventListener("down", this.onDown);
		this.addEventListener("up", this.onUp);
		
		setInterval(this.sendBTDetails.bind(this), sendTimeInterval);
	}
}

var _p = JoystickElement.prototype;

/*
	We send two 16bit Integers for the xCoordinate and yCoordinate of the joystick
*/
_p.sendBTDetails = function() {
	var sendTime = new Date().getTime();
	
	//if (sendTime - this._lastSentTime < sendTimeInterval) {
	//	return;
	///}
	
	this.updateCoords();
	
	this._lastSentTime = sendTime;
	
	var sendX = Math.round(mapToInterval(this.leverX, -this.joystickRadius, this.joystickRadius, -byteMax, byteMax)), 
		sendY = Math.round(mapToInterval(-this.leverY, -this.joystickRadius, this.joystickRadius, -byteMax, byteMax)),
		sendString = sendX + separator + sendY + separator;
	
	bluetoothSerial.write(sendString, 
						  function() {
								
							},
						  function() {
								alert("There was a problem while sending the coords.");
							}
						 );
}

_p.updateSize = function(joyRadius, leverRadius) {
	this.joystickRadius = joyRadius;
	this.leverRadius = leverRadius;
	
	this.joystX = this.joystOffsetX + this.joystickRadius;
	this.joystY = this.joystOffsetY + this.joystickRadius;
}

_p.updateOffset = function(offX, offY) {
	this.joystOffsetX = offX;
	this.joystOffsetY = offY;
	
	this.joystX = this.joystOffsetX + this.joystickRadius;
	this.joystY = this.joystOffsetY + this.joystickRadius;
}

_p.updateCoords = function() {
	this.leverX = Math.floor(Math.cos(this.azimuth) * this.polarRad);
	this.leverY = Math.floor(Math.sin(this.azimuth) * this.polarRad);
}

_p.onMove = function(e) {
	if (!this._moving)
		return;
	
	e = e.detail;
	
	e.x = e.x - controlsUI.canvas.offsetLeft;
	e.y = e.y - controlsUI.canvas.offsetTop;
	
	var levCenterX = this.joystX,
		levCenterY = this.joystY,
		deltaX = (e.x - levCenterX),
		deltaY = (e.y - levCenterY);
	
	this.polarRad = Math.floor(Math.sqrt(
			deltaX * deltaX + deltaY * deltaY
		));
	
	this.azimuth = Math.atan2(deltaY, deltaX);
	
	if (deltaX * deltaX + deltaY * deltaY > this.joystickRadius * this.joystickRadius) {
		this.polarRad = Math.floor(this.joystickRadius);
	}
	
	controlsUI.draw();
}

_p.onUp = function() {
	this.azimuth = 0, this.polarRad = 0;
	this._moving = false;
	
	controlsUI.draw();
}

//if we are inside the lever circle we start moving
_p.onDown = function(e) {
	e = e.detail;
	
	e.x = e.x - controlsUI.canvas.offsetLeft;
	e.y = e.y - controlsUI.canvas.offsetTop;
	
	var levCenterX = this.joystX,
		levCenterY = this.joystY;
	
	if ((e.x - levCenterX) * (e.x - levCenterX) + 
		(e.y - levCenterY) * (e.y - levCenterY) <= this.leverRadius * this.leverRadius) {

		this._moving = true;
	}
}

_p.draw = function() {
	var ctx = controlsUI.ctx;
	
	this.updateCoords();
	
	//drawing the joystick
	ctx.fillStyle = "rgb(63, 191, 225)";
	ctx.strokeStyle = "black";
	
	ctx.beginPath();
	ctx.arc(this.joystX, this.joystY, this.joystickRadius, 0, 2 * Math.PI);
	ctx.fill();
	ctx.stroke();
	ctx.closePath();
	
	ctx.translate(this.joystX, this.joystY);
	
	ctx.fillStyle = "rgb(63, 225, 191)";
	
	ctx.beginPath();
	ctx.arc(this.leverX, this.leverY, this.leverRadius, 0, 2 * Math.PI);
	ctx.fill();
	ctx.stroke();
	ctx.closePath();
	
	ctx.translate(-this.joystX, -this.joystY);
}

var controlsUI = {
	canvas : null,
	ctx : null,
	joystick : null
}

controlsUI.init = function() {
	this.canvas = document.getElementById(canvasID);
	this.ctx = this.canvas.getContext("2d");
	
	this.joystick = new JoystickElement(this.canvas);
	
	this.onResize();
	window.addEventListener("resize", this.onResize.bind(this));
	
	this.draw();
}

controlsUI.onResize = function() {
	this.canvas.width = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
	this.canvas.height = Math.floor(3 * Math.max(document.documentElement.clientHeight, window.innerHeight || 0) / 4);
	
	this.joystickRadius = Math.floor(Math.min(this.canvas.width, this.canvas.height) / 4);
	this.leverRadius = Math.floor(this.joystickRadius / 2);
	
	this.joystick.updateSize(this.joystickRadius, this.leverRadius);
	this.joystick.updateOffset(Math.floor((this.canvas.width - this.joystickRadius * 2) / 2), 
							   this.joystickRadius);

	this.draw();
}

controlsUI.draw = function(leverX = 0, leverY = 0, joystX = this.joystickRadius, joystY = this.joystickRadius) {
	var ctx = this.ctx;
	
	ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
	
	this.joystick.draw(leverX, leverY, joystX, joystY);
}