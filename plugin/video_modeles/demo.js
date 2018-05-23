/*
 * (C) Copyright 2016 Kurento (http://kurento.org/)
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */
var kurento;
var room;
var num=1;
window.onload = function() {
	console = new Console('console', console);
}

function register() {

	var userId = document.getElementById('name').value;
	var roomId = document.getElementById('roomName').value;

	var wsUri = 'wss://172.16.3.8:8443/room';
	//172.16.3.9:8443

	kurento = KurentoRoom(wsUri, function(error, kurento) {
		if (error)
			return console.log(error);

		room = kurento.Room({
			room : roomId,
			user : userId,
			subscribeToStreams : true
		});

		var localStream = kurento.Stream(room, {
			audio : true,
			video : true,
			data : true
		});
		//用户授权访问摄像头和麦克风时
		localStream.addEventListener("access-accepted", function() {
			var playVideo = function(stream) {
				//添加视频最外层盒子  stream.getGlobalID()——>wxy_webcam这样的
				var elementId = "video-" + stream.getGlobalID();
				var div = document.createElement('div');
				div.className = "video_list";
				div.setAttribute("id", elementId);
				document.getElementById("participants").appendChild(div);
				//插入进入房间后视频里面具体的标签
				stream.playThumbnail(elementId);

				// Check color
				//videoTag 找到具体的video
				var videoTag = document.getElementById("native-" + elementId);
				var userId = stream.getGlobalID();
				var canvas = document.createElement('CANVAS');
				checkColor(videoTag, canvas, userId);   //???
			};


			room.addEventListener("room-connected", function(roomEvent) {
				//document.getElementById('room-header').innerText = 'ROOM \"'
						//+ room.name + '\"';
				//document.getElementById('join').style.display = 'none';
				//document.getElementById('room').style.display = 'block';

				localStream.publish(); //发布

				var streams = roomEvent.streams;
				for (var i = 0; i < streams.length; i++) {
					playVideo(streams[i]);
				}
			});

			room.addEventListener("stream-added", function(streamEvent) {
				playVideo(streamEvent.stream);
			});

			room.addEventListener("stream-removed", function(streamEvent) {
				var element = document.getElementById("video-"
						+ streamEvent.stream.getGlobalID());
				if (element !== undefined) {
					element.parentNode.removeChild(element);
				}
			});

			room.addEventListener("error-room", function (streamEvent) {

			});
			//参与者加入
			room.addEventListener("participant-joined", function (streamEvent) {
				num++;
				console.log(num);
				//超过两个人进入视频   2
				if(num > 2){
					//断开活跃的参与者
					kurento.disconnectParticipant(streamEvent.stream);
				}
			});
			playVideo(localStream);

			room.connect();
		});


		//用户拒绝访问她的相机和麦克风时
		localStream.addEventListener("access-denied", function (streamEvent) {

		});
		//将触发向用户授予对本地摄像头和麦克风访问权的请求
		localStream.init();

	});
}

function leaveRoom() {
	//num--;
	//document.getElementById('join').style.display = 'block';
	//document.getElementById('room').style.display = 'none';

	var streams = room.getStreams();
	//var leave_video = document.getElementById("participants");
	//var leave_canvas=document.getElementById("myCanvas");
	//var ctx = leave_canvas.getContext('2d');
	//ctx.drawImage(leave_video,0,0);
	//leave_canvas.show();
	for ( var index in streams) {
		var stream = streams[index];
		var element = document.getElementById("video-" + stream.getGlobalID());

		if (element) {
			element.parentNode.removeChild(element);
		}
	}
	kurento.close();
}

//即将离开当前页面(刷新或关闭)
window.onbeforeunload = function() {
	kurento.close();
};
