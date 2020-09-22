import React, {useState} from "react";
import PropTypes from 'prop-types';

export default function DebuggingComponent({pendingActions, messages}) {
	const [showDebugging, setShowDebugging] = useState(false);

	return (
			<>
				<p><button onClick={() => setShowDebugging(!showDebugging)}>
					{showDebugging ? 'Hide' : 'Show'} Debugging Messages</button></p>
				{showDebugging &&
				<>
					<p>Pending Actions:</p>
					{
						pendingActions.map(it => (
								<p key={it.seq}>{JSON.stringify(it)}</p>
						))
					}
					<p>Messages:</p>
					{
						messages.map((it, index) => (
								<p key={index}>{it}</p>
						))
					}
				</>
				}
			</>
	);
}
DebuggingComponent.propTypes = {
	pendingActions: PropTypes.array,
	messages: PropTypes.array,
};