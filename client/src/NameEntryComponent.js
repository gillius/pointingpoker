import React from 'react';
import PropTypes from 'prop-types';
import { uniqueNamesGenerator, starWars, adjectives, animals, colors } from 'unique-names-generator';

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
	generatName = () => {
		const i = Math.floor(Math.random() * Math.floor(2));
		const nouns = [animals, starWars];
		const name = uniqueNamesGenerator({
			dictionaries: [adjectives, colors, nouns[i],],
			length: Math.floor(Math.random() * Math.floor(4)),
			separator: " ",
			style: "capital"
		});
		this.setState({ name })

	}

	handleChange = event => {
		this.setState({ name: event.target.value });
	}

	handleSubmit = event => {
		this.props.onSubmit(this.state.name);
		event.preventDefault();
	}

	render() {
		return (
			<div>
				<h3>Enter Player Name:</h3>
				<form onSubmit={this.handleSubmit} className="form-inline">
					<input className="form-control mb-2 mr-sm-2" type="text" name="name"
						value={this.state.name}
						onChange={this.handleChange} />
					<button className="btn btn-primary mr-2 mb-2" onClick={this.generatName} type="button">Generate Name</button>
					<button className="btn btn-primary mb-2" type="submit">Join</button>
				</form>
			</div>
		);
	}
}