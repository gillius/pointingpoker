import React, {Component} from "react";

export default class DebuggingComponent extends Component {
	constructor(props, context) {
		super(props, context);

		this.state = {
			showDebugging: false
		}
	}

	toggleShow = () => {
		this.setState(s => ({showDebugging: !s.showDebugging}));
	}

	render() {
		let messages;
		if (this.state.showDebugging) {
			messages =
					<div>
						<p>Pending Actions:</p>
						{
							this.props.pendingActions.map(it => (
									<p key={it.seq}>{JSON.stringify(it)}</p>
							))
						}
						<p>Messages:</p>
						{
							this.props.messages.map((it, index) => (
									<p key={index}>{it}</p>
							))
						}
					</div>
		}

		return [
			<p><button onClick={this.toggleShow}>
				{this.state.showDebugging ? 'Hide' : 'Show'} Debugging Messages</button></p>,
			messages
		]
	}
}