import React from 'react';
import PropTypes from 'prop-types';

export default class NameEntryComponent extends React.Component {
	static propTypes = {
		onSubmit: PropTypes.func,
		defaultValue: PropTypes.string,
	}

	constructor(props, context) {
		super(props, context);

		this.state = {
			name: this.props.defaultValue || ''
		}
	}

	handleChange = event => {
		this.setState({name: event.target.value});
	}

	handleSubmit = event => {
		this.props.onSubmit(this.state.name);
		event.preventDefault();
	}

	render() {
		return (
				<div>
					<h3>Enter Player Name:</h3>
					<form onSubmit={this.handleSubmit}>
						<input type="text" name="name" value={this.state.name} onChange={this.handleChange}/>
						<button type="submit">Join</button>
					</form>
				</div>
		);
	}
}