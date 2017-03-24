import React from 'react'
import ConfigureSocket from '../VideoChat/ConfiguringSocket'
import events from '../VideoChat/events'
import io from 'socket.io-client'

import { serverLocation } from '../utils/server.settings.js'
const socket = io(serverLocation)

export default class extends React.Component{

  constructor(props){
    super(props);

    this.state = {
      repoId: this.props.repoId,
      clickToGoHome: this.props.clickToGoHome,
      collaborator: this.props.collaborator,
      goToPairRoom: this.props.goToPairRoom,
      myName: this.props.myName,
      myId: this.props.myId,
      MediaStreamURL: this.props.URL,
      incomingCall: this.props.incomingCall,
      sortOutMedia: this.props.sortOutMedia

      // allProperties: this.props.allProperties
    }

    this.callCollaborator = this.callCollaborator.bind(this)
    this.handleIncomingCall = this.handleIncomingCall.bind(this)
    this.streamSuccessHandler = this.streamSuccessHandler.bind(this)

  }


  callCollaborator() {
    socket.emit('Pair with me', {
      room: this.state.repoId,
      name: this.state.collaborator.name,
      url: `/${this.state.myName}`
    })

    this.setLocalUserMedia();

    this.setUserMedia();
    this.state.sortOutMedia();

    //set roomname to store

  }

  handleIncomingCall() {
    console.log('answering incoming call');

    this.setLocalUserMedia();
    this.setUserMedia();
    this.state.sortOutMedia();

    events.trigger('startCall', this.state.collaborator);

    //set room to go to on store

    this.state.goToPairRoom();

    // move to next pair room
  }

  setLocalUserMedia() {
    navigator.getUserMedia(
      //configuration
      {
        video:true,
        audio:false,
      },
      //successHandler
      this.localVideoView,
      //error handler
      console.error
    )
  }

  setUserMedia() {
    navigator.getUserMedia(
			//configuration
			{
				video:true,
				audio:true,
			},
			//successHandler
			this.streamSuccessHandler,
			//error handler
			console.error
		)
  }

  streamSuccessHandler(stream) {
    this.props.UpdateStream(stream);
    // this.initiateConnection();
  }

  localVideoView(stream) {
    // const localVideo = document.getElementById('localWebchat');
    // console.log(localVideo);
    // localVideo.src = URL.createObjectURL(stream);
    // // localVideo.onloadedmetadata(play());
    // localVideo.play();
  }


  render(){
    console.log('Props: ', this.props.repoId);
    return (
      <div>
      <div key={this.state.collaborator} onClick={this.callCollaborator}>{this.state.collaborator.name}</div>
      {
        this.props.incomingCall && <button onClick={ this.handleIncomingCall}>Answer, begin pair</button>
      }
      </div>
    )
  }
}