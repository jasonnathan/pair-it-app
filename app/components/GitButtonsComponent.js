import React from 'react';
import simpleGit from 'simple-git';
import chalk from 'chalk';


let Git = simpleGit();

export default class extends React.Component {
	constructor(props){
		super(props)
		this.state = {
			displayBranchList:false,
		}
		this.handleBranchCheckout = this.handleBranchCheckout.bind(this);
	}

	componentDidMount(){

	}

	getBranchList(){
		Git.branchLocal(
			(error, branchSummary) => {
				this.props.updateBranchList(branchSummary);
				this.props.handleError(error);
			}
		);
	}

	getCurrentBranch(){

	}


	handleBranchCheckout(){
		console.log(this.props.branchQuery);
		Git.checkoutLocalBranch(
			this.props.branchQuery, 
			(error, newBranch) => {
				this.props.handleError(error);
				this.props.updateCurrentBranch(newBranch);
			}
		)
		this.props.toggleDisplayBranches()
	}

	errorHandler(error, data){
		this.setState({successData:data});
		this.setState({errorMessage:error});
	}


	render(){

		return (
			<div>
				{this.props.successData}
				{this.props.errorMessage}
					<input type="text" onSubmit={this.handleBranchCheckout}onChange={this.props.handleBranchChangeQuery}></input>
					<button onClick={this.handleBranchCheckout}>Checkout Branch</button>
				
				<button onClick={this.handleGitAdd}>Add Files</button>
				<form onSubmit={this.handleGitCommit}>
					Commit
					<input type="text" onChange={this.handleCommitMessage}></input>
				</form>
				<button onClick={this.handleGitStatus}>Status</button>
				<button onClick={this.handleGitPush}>Push</button>
				<button onClick={this.handleGitPull}>Pull</button>
				<button onClick={this.props.toggleDisplayBranches}>ShowBranchList</button>
				{this.state.displayBranchList && this.state.branchList.map(el => {
						if (el === currentBranch){
							return <ul>{chalk.green(el)}</ul>
						} else {
							return <ul>el</ul>
						}
					}
					)
				}
			</div>
			)
	}

}