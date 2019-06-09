import React, { Component } from 'react';
import { Menu, Dropdown, Form, Icon } from 'semantic-ui-react';
import { DatePicker } from 'antd';


class NewEvent extends Component {
	constructor(props) {
		super(props);
		this.state = {
			artist: this.props.user.name,
			date: null,
			status: 'closed',
			description: ''
		}

		this.eventOptions = [
			{
				text: 'Art',
				value: 'Art'
			},
			{
				text: 'Dance',
				value: 'Dance'
			},
			{
				text: 'Food',
				value: 'Food'
			},
			{
				text: 'Music',
				value: 'Music'
			}
		]
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

	handleOpenChange = (status) => {
		console.log(status);
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
			});
			this.props.toIdle();
		});

	}

	render() {
		const { artist, date, description } = this.state;
		const isDone = artist && date && description;
		return (
			<div>
				<Menu size='massive' id='top-menu' secondary>
					<Menu.Item name='home' onClick={() => { this.props.switchVisibleFull('selecting-location'); }}>
						<Icon link className='close' name='arrow left'/>
					</Menu.Item>
					<Menu.Menu position='right'>
						<Menu.Item
							disabled={!isDone}
							name='done'
							onClick={this.handleSubmit}
						/>
					</Menu.Menu>
				</Menu>
				<Form size='huge' onSubmit={this.handleSubmit} id='eventForm'>
					<h1>Event details</h1>
					<Form.Input placeholder="Who's performing?" name='artist' value={artist} onChange={this.handleNameChange} />
					{/*<DatePicker
						id='event-date-picker'
						required
						fixedHeight
						selected={date}
						showTimeSelect
						timeIntervals={15}
						onChange={this.handleDateChange.bind(this)}
						dateFormat="MM/dd/yyyy h:mm aa"
						placeholderText="Date and time"
					/>*/}
					<Form.TextArea placeholder='Description' value={description} onChange={this.handleDescriptionChange}/>
					<Form.Select
					    placeholder='Category'
					    fluid
					    options={this.eventOptions}
					/>
					{/*<DayPicker
			          selectedDays={this.state.date}
			          onDayClick={this.handleDateChange}
			        />*/}
			        <DatePicker size="large" showTime={{ format: 'HH:mm' }} format="MM-DD-YYYY HH:mm" placeholder="Select Time" onOk={this.handleDateChange} />
				</Form>
			</div>
		);
	}
}

export default NewEvent;