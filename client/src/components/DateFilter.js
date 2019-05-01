import React, { Component } from 'react';
import { Form, Field } from 'semantic-ui-react';
import DatePicker from 'react-datepicker';

class DateFilter extends Component {
	constructor(props) {
		super(props);
		this.state = {
			before: null,
			after: null		}
	}

	handleChangeStart = (date) => {
		if (date == null || this.state.before == null || date < this.state.before) {
			this.setState({ after: date }, () => { this.props.setAfter(date); });
		}
	}

	handleChangeEnd = (date) => {
		if (date == null || this.state.after == null || date > this.state.after) {
			this.setState({ before: date }, () => { this.props.setBefore(date); });
		}
	}



	onEnd
	
	render() {
		const { before, after } = this.state;
		return (
			<Form size='mini'>
				<h5>Filter dates</h5>
				<DatePicker
				    selected={after}
				    selectsStart
				    showTimeSelect
				    isClearable={true}
				    startDate={after}
				    endDate={before}
				    onChange={this.handleChangeStart}
				    dateFormat="MM/dd/yyyy h:mm aa"
				    placeholderText='Start'
				    // onChange={this.handleChangeStart}
				/>

				<DatePicker
				    selected={before}
				    selectsEnd
				    showTimeSelect
				    isClearable={true}
				    startDate={after}
				    endDate={before}
				    onChange={this.handleChangeEnd}
				    dateFormat="MM/dd/yyyy h:mm aa"
				    placeholderText='End'
				    // onChange={this.handleChangeEnd}
				/>
			</Form>
		);
	}
}

export default DateFilter;