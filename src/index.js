import fetch from 'node-fetch';

class WeatherAPI {
    /** @type {String} */
    #apiKey;
    /**
     * 
     * @param {String} apiKey 
     */
    constructor(apiKey) {
        if (!apiKey) throw new Error('Missing API key');
        this.#apiKey = apiKey;
    }

    /**
     * Returns the payload containing weather data about the city. 
     * If no such city is found returns success: false
     * @param {String} city 
     * @param {Boolean} celcius 
     * @returns {Promise<Object>} Promise object representing the weather data
     */
    async getWeather(city = 'London', celcius = true ) {
        if (typeof celcius != 'boolean') throw new Error('Temperature parameter must be a boolean');
        if (typeof city != 'string') throw new Error('City parameter must be a string');
        const searchParam = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${this.#apiKey}`;
        const response = await fetch(searchParam, { method: 'GET' });
        if (!response.ok) return { success: false, data: null, message: 'No Weather Data Found' }
        const jsonR = await response.json();
        const payLoad = this.#getPayload(jsonR, celcius);
        return { success: true, data: payLoad, message: 'Weather Data Found' };
    }

    /**
     * 
     * @param {Object} data 
     * @param {Boolean} celcius 
     * @returns {Object}
     */
    #getPayload(data, celcius) {
        let { name } = data;
        let { icon, description } = data.weather[0];
        let { temp, humidity } = data.main;
        let { speed } = data.wind;
        let unit = 'celcius';

        temp = celcius ? temp : this.#convertTemp(temp);
        unit = celcius ? unit : 'farenheit';

        let payload = {
            city: name,
            icon: icon,
            unit: unit,
            temperature: temp,
            humidity: humidity,
            windSpeed: speed,
            description: description
        }

        return payload;
    }

    /**
     * 
     * @param {Number} temp 
     * @returns {Number}
     */
    #convertTemp(temp) {
        return (Number(temp) * 9/5) + 32;
    }
}


export default WeatherAPI;