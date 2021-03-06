import React from 'react'
import { connect } from 'react-redux'

import FileListContainer from '../containers/FileListContainer'

export default class FilesComponent extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      dir: ''
    }
    this.selectFile = this.selectFile.bind(this)
    this.onSubmit = this.onSubmit.bind(this)
  }

  componentDidMount() {
    this.refs.local.setAttribute('webkitdirectory', true)
    this.refs.local.setAttribute('directory', true)
  }

  onSubmit() {
    this.props.dispatchSetFileDirAndLoadFiles(this.state.dir)
  }

  selectFile(ev) {
    const fileName = ev.target.files[0].path.split('/').slice(-1)[0]
    if (fileName !== this.props.repoName) alert('That file does not match the name of your Github repo. Please double check which file you want to work from.')
    this.setState({ dir: ev.target.files[0].path })
  }

  render() {
    return (
      <div>
        <div id="file-container-driver" className="col-sm-4">
          <h1>{this.props.repoName}</h1>
          <h3 id="currentBranch">
          {this.props.currentBranch && <i className="fa fa-code-fork"/>}
          {this.props.currentBranch && '  Working on branch: ' + this.props.currentBranch}
          </h3>
          <input id="file-selector" type="file" ref="local" onChange={this.selectFile} />
          <button onClick={this.onSubmit}>Pair It!</button>
        </div>
        <div id="file-list-container-driver" className="col-sm-4">
        <FileListContainer />
        </div>
      </div>
    )
  }
}
