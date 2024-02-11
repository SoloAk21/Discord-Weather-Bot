const { SlashCommandBuilder } = require('discord.js');
const axios = require('axios');

const {weatherApiKey  } = require('../../config.json');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('weather')
		.setDescription('Replies with the current weather in a city')
		.addStringOption(option =>
			option.setName('city')
				.setDescription('The city name')
				.setRequired(true))
		.addStringOption(option =>
			option.setName('temp_type')
				.setDescription('The temperature type')
				.setRequired(true)
				.addChoices(
					{ name: 'Celsius', value: 'metric' },
					{ name: 'Fahrenheit', value: 'imperial' },
					{ name: 'Kelvin', value: 'standard' },
				)),
	async execute(interaction) {
		const city = interaction.options.getString('city');
		const temp_type = interaction.options.getString('temp_type');
		
		const weather = await getWeather(city, temp_type);
		await interaction.reply(weather);
	},
};

async function getWeather(city, temp_type) {
	// Replace this with your own API key
	
	const url = "https://api.openweathermap.org/data/2.5/weather";
	// Get the weather data from OpenWeatherMap API
	const response = await axios.get(`${url}?q=${city}&units=${temp_type}&appid=${weatherApiKey}`);
	// Check if the response is valid
	if (response.status === 200) {
	
		const weatherData = response.data;
		
		return `The current weather in ${city} with ${weatherData.weather[0].description}`;
	} else {
		// Return an error message
		return `Could not get the weather for ${city}: ${response.statusText}`;
	}
}
