import React from 'react'
import events from '../utils/events'
import io from 'socket.io-client'
import Promise from 'bluebird'

import { serverLocation } from '../utils/server.settings.js'
const socket = io(serverLocation)

export default class extends React.Component{

    constructor(props){
        super(props);

        this.state = {
            repoId: this.props.repoId,
            clickToGoHome: this.props.clickToGoHome,
            collaborator: this.props.collaborator,
            myName: this.props.myName,
            myId: this.props.myId,
            MediaStreamURL: this.props.URL,
            incomingCall: this.props.incomingCall,
            sortOutMedia: this.props.sortOutMedia
            // setPairPartner: this.props.setPairPartner
        }

        this.callCollaborator = this.callCollaborator.bind(this)
        this.handleIncomingCall = this.handleIncomingCall.bind(this)
        this.streamSuccessHandler = this.streamSuccessHandler.bind(this)
        this.setUserMedia = this.setUserMedia.bind(this)
        this.setLocalUserMedia = this.setLocalUserMedia.bind(this)
        this.localVideoView = this.localVideoView.bind(this)

    }


    callCollaborator() {
      if (window.pc) {
        window.pc.signallingState = 'closed'
      }
        socket.emit('Pair with me', {
            room: this.state.repoId,
            name: this.state.collaborator.name,
            url: `/${this.state.myName}`,
            caller: this.state.myName
        })

        var settingLocalMedia = Promise.promisify(this.setUserMedia)

        this.props.setPairingRoomURL(`/${this.state.myName}`)
        this.props.setPairPartner(this.state.collaborator)
        Promise.resolve(this.setLocalUserMedia())
        .then(() => this.setUserMedia())
        .then(() => {
            return setTimeout(() => {


                // this.props.clickToGoHome()
                return this.props.sortOutMedia();
            }, 3000)
        })
        .catch(console.error)

    }

    handleIncomingCall() {
        this.props.setPairPartner(this.state.collaborator)
        Promise.resolve(this.setLocalUserMedia())
        .then(() => this.setUserMedia())
        .then(() => {
            return setTimeout(() => {
                this.props.clickToGoHome()
                return this.props.sortOutMedia()
            }, 3000)
        })
        .then(() => {
          return setTimeout(() => {
            return events.trigger('startCall', this.state.collaborator)
          }, 3000)
        })
        .then(() => socket.emit('call answered', { caller: this.state.collaborator.name, receiver: this.state.myName, room: this.props.repoId }))
        .catch(console.error)
    }

    setLocalUserMedia() {
        return navigator.getUserMedia(
            {
                video:true,
                audio:false,
            },
            this.localVideoView,
            console.error
        )
    }

    setUserMedia() {
        return navigator.getUserMedia(
            {
                video:true,
                audio:true,
            },
            this.streamSuccessHandler,
            console.error
        )
    }

    streamSuccessHandler(stream) {
        return this.props.UpdateStream(stream);
    }

    localVideoView(stream) {
        return this.props.UpdateLocalStream(stream);
    }


    render(){
        return (
          <div className="row collab-row">
            <img className="collab-avatar" src={this.state.collaborator.avatar_url} />
            <h3 className="collab-name" key={this.state.collaborator}>{this.state.collaborator.name}</h3>
            {
              !this.props.unavailable.find(name => name === this.state.collaborator.name) && <i className="fa fa-phone-square call-button" aria-hidden="true" onClick={this.callCollaborator} />
            }
            {
              this.props.incomingCall.find(name => name === this.state.collaborator.name) && <button className="answer-button" onClick={ this.handleIncomingCall }>Answer Call</button>
            }
          </div>
        )
    }
}
