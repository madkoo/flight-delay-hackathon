from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import pandas as pd



app = Flask(__name__)
CORS(app)
CORS(app, resources={r"/*": {"origins": "*"}})


# Enable cors
@app.after_request
def after_request(response):
    """
    Enable CORS
    """
    response.headers.add('Access-Control-Allow-Origin', '*')
    response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
    return response



# Load the model
model = joblib.load('flight_delay_model.pkl')

# Load the airport data
airports = pd.read_csv('../data/airports.csv')

@app.route('/predict', methods=['POST'])
def predict():
    data = request.get_json()
    day_of_week = data.get('day_of_week')
    airport_id = data.get('airport_id')
    
    if day_of_week is None or airport_id is None:
        return jsonify({'error': 'Missing day_of_week or airport_id'}), 400
    
    # Create a DataFrame for the input
    input_data = pd.DataFrame([[day_of_week, airport_id]], columns=['DayOfWeek', 'DestAirportID'])
    
    # Make prediction
    prediction = model.predict(input_data)
    prediction_proba = model.predict_proba(input_data)
    
    # Return the result
    return jsonify({
        'delay_prediction': int(prediction[0]),
        'confidence': float(prediction_proba[0][1])
    })

@app.route('/airports', methods=['GET'])
def get_airports():
    sorted_airports = airports.sort_values(by='DestAirportName')
    return jsonify(sorted_airports.to_dict(orient='records'))

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)