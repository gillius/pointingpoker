import React, {useState} from "react";
import PropTypes from 'prop-types';

export default function DebuggingComponent({pendingActions, messages}) {
	const [showDebugging, setShowDebugging] = useState(false);

	return (
			<>
				<p className="mt-5">
					<button className="btn btn-light btn-sm"
					        onClick={() => setShowDebugging(!showDebugging)}>
						{showDebugging ? 'Hide' : 'Show'} Debug Info
					</button>
				</p>
				{showDebugging &&
				<>
					<h5>Pending Actions:</h5>
					<ul className="list-unstyled">
						{
							pendingActions.map(it => (
									<li key={it.seq}>{JSON.stringify(it)}</li>
							))
						}
					</ul>
					<h5>Messages:</h5>
					<ul className="list-unstyled">
						{
							messages.map((it, index) => (
									<li key={index}>{it}</li>
							))
						}
					</ul>
				</>
				}
			</>
	);
}
DebuggingComponent.propTypes = {
	pendingActions: PropTypes.array,
	messages: PropTypes.array,
};