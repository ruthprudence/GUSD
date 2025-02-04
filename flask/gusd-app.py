from flask import Flask, jsonify, request
from flask_sqlalchemy import SQLAlchemy
import credentials
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Database Configuration
app.config['SQLALCHEMY_DATABASE_URI'] = credentials.DB_URI
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SQLALCHEMY_POOL_RECYCLE'] = 299  # Recycle connections before MySQL timeout
app.config['SQLALCHEMY_POOL_TIMEOUT'] = 20  # Timeout waiting for connection from pool

db = SQLAlchemy(app)

class MyModel(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    value = db.Column(db.Integer, nullable=False)

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'value': self.value
        }

@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({"status": "healthy"}), 200

@app.route('/api/data', methods=['GET'])
def get_data():
    try:
        data = MyModel.query.all()
        return jsonify([d.to_dict() for d in data]), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/data', methods=['POST'])
def create_data():
    try:
        if not request.is_json:
            return jsonify({"error": "Content-Type must be application/json"}), 400
        
        data = request.get_json()
        if 'name' not in data or 'value' not in data:
            return jsonify({"error": "name and value are required"}), 400

        new_entry = MyModel(name=data['name'], value=data['value'])
        db.session.add(new_entry)
        db.session.commit()
        return jsonify(new_entry.to_dict()), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
