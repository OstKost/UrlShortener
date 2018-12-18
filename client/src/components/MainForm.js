import React, { Component } from 'react'
import axios from 'axios'
import FormHeader from './FormHeader'
import FormFooter from './FormFooter'
import UInput from './UI/UInput'
import UButton from './UI/UButton'
import FormMessage from './FormMessage'

export default class MainForm extends Component {
	state = {
		fullUrl: '',
		shortCode: '',
		shortUrl: '',
		loading: false,
		error: true,
		message: 'Just give it a try!'
	}

	onInputChange = event => {
		const value = event.target.value
		const id = event.target.id

		const newState = {
			[id]: value
		}

		if (id === 'fullUrl') {
			if (!value) {
				newState.error = true
				newState.message = 'URL field is empty!'
			} else if (value && this.validUrl(value)) {
				newState.error = false
				newState.message = 'Seems like an valid URL. Short it!'
			} else {
				newState.error = true
				newState.message = 'URL is not valid!'
			}
		}

		this.setState({ ...newState })
	}

	onFormSubmit = async event => {
		event.preventDefault()

		this.setState({
			loading: true,
			message: 'Wait a second...'
		})

		try {
			const response = await axios.post('/', {
				fullUrl: this.state.fullUrl,
				shortCode: this.state.shortCode
			})

			this.setState({
				fullUrl: response.data.fullUrl,
				shortUrl: response.data.shortUrl,
				message: response.data.message,
				loading: false
			})
		} catch (error) {
			this.setState({
				loading: false,
				error: true,
				message: error.message
			})
		}
	}

	validUrl(url) {
		// const regStr = /^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/
		const regStr = /^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([-.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/
		return regStr.test(url)
	}	

	render() {
		return (
			<form className="form-signin" onSubmit={this.onFormSubmit}>
				<FormHeader />

				<FormMessage {...this.state} />

				<UInput
					type="text"
					id="fullUrl"
					placeholder="Long URL address"
					required={true}
					autoFocus={true}
					value={this.state.fullUrl}
					onChange={this.onInputChange}
				/>

				<UInput
					type="text"
					id="shortCode"
					placeholder="Your own code for short URL"
					value={this.state.shortCode}
					onChange={this.onInputChange}
				/>

				<UButton
					type="submit"
					text="Generate"
					classes="btn-lg btn-primary btn-block"
					disabled={
						this.state.loading || this.state.error ? true : false
					}
				/>

				<FormFooter />
			</form>
		)
	}
}