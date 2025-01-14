// filepath: /workspaces/flight-delay-hackathon/flight-delay-client/src/components/FlightDelayPredictor.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const FlightDelayPredictor = () => {
    const [airports, setAirports] = useState([]);
    const [dayOfWeek, setDayOfWeek] = useState('');
    const [airportId, setAirportId] = useState('');
    const [result, setResult] = useState(null);

    useEffect(() => {
        axios.get('https://zany-engine-jjx5qx4pph5qrw-5000.app.github.dev/airports')
            .then(response => {
                setAirports(response.data);
            })
            .catch(error => {
                console.error('There was an error fetching the airports!', error);
            });
    }, []);

    const handlePredict = () => {
        axios.post('https://zany-engine-jjx5qx4pph5qrw-5000.app.github.dev/predict', {
            day_of_week: dayOfWeek,
            airport_id: airportId
        })
        .then(response => {
            setResult(response.data);
        })
        .catch(error => {
            console.error('There was an error making the prediction!', error);
        });
    };

    return (
        <div>
            <h1>Flight Delay Predictor</h1>
            <div>
                <label>
                    Day of the Week:
                    <select value={dayOfWeek} onChange={e => setDayOfWeek(e.target.value)}>
                        <option value="">Select a day</option>
                        <option value="1">Monday</option>
                        <option value="2">Tuesday</option>
                        <option value="3">Wednesday</option>
                        <option value="4">Thursday</option>
                        <option value="5">Friday</option>
                        <option value="6">Saturday</option>
                        <option value="7">Sunday</option>
                    </select>
                </label>
            </div>
            <div>
                <label>
                    Airport:
                    <select value={airportId} onChange={e => setAirportId(e.target.value)}>
                        <option value="">Select an airport</option>
                        {airports.map(airport => (
                            <option key={airport.DestAirportID} value={airport.DestAirportID}>
                                {airport.DestAirportName}
                            </option>
                        ))}
                    </select>
                </label>
            </div>
            <button onClick={handlePredict}>Predict</button>
            {result && (
                <div>
                    <h2>Prediction Result</h2>
                    <p>Delay Prediction: {result.delay_prediction}</p>
                    <p>Confidence: {result.confidence}</p>
                </div>
            )}
        </div>
    );
};

export default FlightDelayPredictor;