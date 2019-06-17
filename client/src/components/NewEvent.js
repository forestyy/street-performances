import React, { Component } from 'react';
import { Menu, Dropdown, Form, Icon } from 'semantic-ui-react';
import DatePicker from 'antd/lib/date-picker';
import 'antd/lib/date-picker/style/css';

class NewEvent extends Component {
	constructor(props) {
		super(props);
		this.state = {
			artist: this.props.user.name,
			date: null,
			pickerIsOpen: false,
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
		this.setState({ date: date }, () => {console.log(this.state.date)});
	}

	handleOpenChange = (status) => {
		this.setState({ pickerIsOpen: status }, () => {console.log(this.state.pickerIsOpen)});
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
		const { artist, date, description, pickerIsOpen } = this.state;
		const isDone = artist && date && description && !pickerIsOpen;
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
					<Form.TextArea placeholder='Description' value={description} onChange={this.handleDescriptionChange}/>
					<Form.Select
					    placeholder='Category'
					    fluid
					    options={this.eventOptions}
					/>
			        <DatePicker 
			        	size="large" 
			        	showTime={{ format: 'h:mm a' }} 
			        	format="MM/DD/YYYY h:mm a" 
			        	placeholder="Select Time" 
			        	onOpenChange={this.handleOpenChange}
			        	onChange={this.handleDateChange} 
			        	onOk={this.handleDateChange} 
			        />
				</Form>
			</div>
		);
	}
}

export default NewEvent;