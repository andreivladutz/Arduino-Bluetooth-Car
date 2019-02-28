/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
const blueDevicesDivID = "discovered-devices", closeButtonID = "close-discovered",
	  statusDivID = "deviceready", connectButtonID = "discovered-show",
	  canvasID = "mainCanvas", loggerID = "logger";

var app = {
    // Application Constructor
    initialize: function() {
        document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
    },

    // deviceready Event Handler
    //
    // Bind any cordova events here. Common events are:
    // 'pause', 'resume', etc.
    onDeviceReady: function() {
		this.init();
    }
};

app.initialize();

app.init = function() {
	UI.init();
	controlsUI.init();
}

var UI = {
	statusDiv : document.getElementById(statusDivID),
	connectButton : document.getElementById(connectButtonID),
	logger : document.getElementById(loggerID)
}

UI.init = function() {
	this.initListeners();
}

UI.initListeners = function() {
	this.connectButton.addEventListener("click", BTManager.showBluetoothDevices.bind(BTManager));
	
	setInterval(function checkConnection() {
		bluetoothSerial.isConnected(UI.reportConnected.bind(UI), UI.reportNotConnected.bind(UI));
		bluetoothSerial.available(function() {
			bluetoothSerial.read(UI.logReceived);
		});
	}, 500);
}

UI.logReceived = function(text) {
	if (!text)
		logger.innerHTML = "<br/>";
	
	logger.innerHTML = text;
}

UI.reportNotConnected = function() {
	if (!this.statusDiv)
		return;
	
	var awaitElement = this.statusDiv.querySelector('.awaiting');
	var connectElement = this.statusDiv.querySelector('.connected');

	awaitElement.removeAttribute('style');
	connectElement.removeAttribute('style');
}

UI.reportConnected = function() {
	if (!this.statusDiv)
		return;
	
	var awaitElement = this.statusDiv.querySelector('.awaiting');
	var connectElement = this.statusDiv.querySelector('.connected');

	awaitElement.setAttribute('style', 'display:none;');
	connectElement.setAttribute('style', 'display:block;');
}

var BTManager = {
	parrEl : document.getElementById(blueDevicesDivID),
	closeButton : document.getElementById(closeButtonID)
};

BTManager.init = function() {
	bluetoothSerial.enable();
}

//closes the bluetooth devices list window
BTManager.closeDevicesWindow = function() {
	this.closeButton.removeEventListener("click", this.boundClose);
	this.parrEl.style.display = "";
}

//opens the bluetooth devices list window
BTManager.showBluetoothDevices = function() {
	bluetoothSerial.list(BTManager.showDevices.bind(BTManager));
	
	this.boundClose = this.closeDevicesWindow.bind(this);
	this.closeButton.addEventListener("click", this.boundClose);
}

//handler when device to connect to is clicked
BTManager.connectToBTDevice = function(e) {
	var DOMEl = e.target, btDevice = DOMEl._DESCRIBE_ARRAY;
	
	this.boundClose();
	
	var firstTimeConnection = false;
	
	bluetoothSerial.connect(btDevice.address,
							function() {
								firstTimeConnection = true;
							},
							function() {
								if (!firstTimeConnection)
									alert("Couldn't connect. Make sure your device is turned on!");
								else
									BTManager.reconnectToBTDevice(btDevice.address);
							});
}

BTManager.reconnectToBTDevice = function(btAddress) {
	bluetoothSerial.connect(
		btAddress,
		function() {},
		function() {
			BTManager.reconnectToBTDevice(btAddress);
		}
	)
}

//callback for bluetoothSerial.list
BTManager.showDevices = function(arr) {
	BTManager.parrEl.style.display = "block";
	
	var oldDevices = this.parrEl.querySelectorAll("p");
	
	//keep the title and close button
	for (var dev of oldDevices)
		this.parrEl.removeChild(dev);
	
	arr.forEach(function(arrEl) {
		var DOMEl = document.createElement("p");
		
		DOMEl._DESCRIBE_ARRAY = arrEl;
		DOMEl.innerHTML = arrEl.name + " " + arrEl.address;
		
		DOMEl.addEventListener("click", this.connectToBTDevice.bind(BTManager));
		
		this.parrEl.appendChild(DOMEl);
	}, BTManager);
}