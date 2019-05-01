import React, { Component } from 'react';
import { Form } from 'semantic-ui-react';
import DatePicker from 'react-datepicker';


class NewEvent extends Component {
	constructor(props) {
		super(props);
		this.state = {
			artist: '',
			date: null,
			description: ''
		}
	}

	handleNameChange = (e, { value }) => {
		this.setState({ artist: value }, () => {console.log(this.state.artist)});
	}

	handleDateChange = (date) => {
		// if (date instanceof Date && !isNaN(date)) {
		// 	this.setState({ date: date }, () => {console.log(this.state.date)});
		// }
		this.setState({ date: date }, () => {console.log(this.state.date)});
	}

	handleDescriptionChange = (e, { value }) => {
		this.setState({ description: value });
	}

	handleSubmit = () => {
		console.log(this.state)
		const { artist, date, description } = this.state;
		console.log(this.props.location)
		this.props.addEvent(artist, date, description, this.props.location, () => {
			this.setState({
				artist: '',
				date: null,
				description: ''
			}, () => { this.props.closePopup(); });
		});

	}

	render() {
		const { artist, date, description } = this.state;
		return (
			<Form size='mini' onSubmit={this.handleSubmit} id='eventForm'>
				<Form.Group inline>
					<Form.Input required placeholder='Artist Name' name='artist' value={artist} onChange={this.handleNameChange} />
					<DatePicker
						id='event-date-picker'
						required
						fixedHeight
					    selected={date}
					    showTimeSelect
					    timeIntervals={15}
					    onChange={this.handleDateChange.bind(this)}
					    dateFormat="MM/dd/yyyy h:mm aa"
					    placeholderText="Date and time"
					/>
				</Form.Group>
				<Form.TextArea required placeholder='Description' value={description} onChange={this.handleDescriptionChange}/>
				<Form.Button size='mini' content='Submit' />
			</Form>
		);
	}
}

export default NewEvent;