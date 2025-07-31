# from flask import Flask, render_template, request, redirect, url_for
# from flask_sqlalchemy import SQLAlchemy

# app = Flask(__name__)
# app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///predictions.db' # SQLite database file
# app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
# db = SQLAlchemy(app)

# # Database Models
# class User(db.Model):
#     id = db.Column(db.Integer, primary_key=True)
#     name = db.Column(db.String(100), nullable=False)
#     email = db.Column(db.String(100), unique=True, nullable=False)
#     predictions = db.relationship('Prediction', backref='user', lazy=True)

#     def __repr__(self):
#         return f'<User {self.name}>'

# class Prediction(db.Model):
#     id = db.Column(db.Integer, primary_key=True)
#     user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
#     team_name = db.Column(db.String(100), nullable=False)
#     rank = db.Column(db.Integer, nullable=False)

#     def __repr__(self):
#         return f'<Prediction {self.team_name} - {self.rank}>'

# # Create database tables (run once)
# with app.app_context():
#     db.create_all()

# # ... (Flask routes will go here)
# # ... (imports and models from before)

# @app.route('/')
# def index():
#     return render_template('index.html')

# @app.route('/submit_prediction', methods=['POST'])
# def submit_prediction():
#     if request.method == 'POST':
#         name = request.form['name']
#         email = request.form['email']
#         teams = []
#         for i in range(1, 21):
#             teams.append(request.form[f'team{i}'])

#         # Server-side validation (crucial!)
#         if not name or not email or not all(teams):
#             return render_template('index.html', error_message='Please fill in all fields.')

#         # Basic email validation (more robust regex for production)
#         if '@' not in email or '.' not in email:
#             return render_template('index.html', error_message='Please enter a valid email address.')

#         # Check for duplicate teams
#         if len(set(teams)) != 20:
#             return render_template('index.html', error_message='Please ensure all 20 team entries are unique.')


#         try:
#             # Find or create user
#             user = User.query.filter_by(email=email).first()
#             if not user:
#                 user = User(name=name, email=email)
#                 db.session.add(user)
#                 db.session.commit() # Commit to get user.id for foreign key

#             # Save predictions
#             # First, delete any existing predictions for this user to allow updates
#             Prediction.query.filter_by(user_id=user.id).delete()
#             db.session.commit()

#             for rank, team_name in enumerate(teams, 1):
#                 prediction = Prediction(user_id=user.id, team_name=team_name, rank=rank)
#                 db.session.add(prediction)

#             db.session.commit()
#             return render_template('index.html', success_message='Your prediction has been submitted successfully!')

#         except Exception as e:
#             db.session.rollback()
#             return render_template('index.html', error_message=f'An error occurred: {str(e)}')

# if __name__ == '__main__':
#     app.run(debug=True) # debug=True for development, turn off for production

#2

import os
from flask import Flask, render_template, request, redirect, url_for, jsonify # Import jsonify
from flask_sqlalchemy import SQLAlchemy
#from flask_mail import Mail, Message

# Initialize Flask app
app = Flask(__name__)

# --- Configuration ---
app.config['SECRET_KEY'] = 'your_super_secret_key_here'
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///' + os.path.join(app.root_path, 'predictions.db')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

# Flask-Mail Configuration
# app.config['MAIL_SERVER'] = os.environ.get('MAIL_SERVER', 'smtp.gmail.com')
# app.config['MAIL_PORT'] = int(os.environ.get('MAIL_PORT', 587))
# app.config['MAIL_USE_TLS'] = os.environ.get('MAIL_USE_TLS', 'true').lower() in ['true', 'on', '1']
# app.config['MAIL_USE_SSL'] = os.environ.get('MAIL_USE_SSL', 'false').lower() in ['true', 'on', '1']
# app.config['MAIL_USERNAME'] = os.environ.get('MAIL_USERNAME', 'your_email@example.com')
# app.config['MAIL_PASSWORD'] = os.environ.get('MAIL_PASSWORD', 'your_email_app_password')
# app.config['MAIL_DEFAULT_SENDER'] = os.environ.get('MAIL_DEFAULT_SENDER', 'Your Predictor App <your_email@example.com>')

# mail = Mail(app)

# --- Database Models (no changes here) ---
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(100), unique=True, nullable=False)
    predictions = db.relationship('Prediction', backref='user', lazy=True, cascade="all, delete-orphan")

    def __repr__(self):
        return f'<User {self.name} ({self.email})>'

class Prediction(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    team_name = db.Column(db.String(100), nullable=False)
    rank = db.Column(db.Integer, nullable=False)

    def __repr__(self):
        return f'<Prediction User ID: {self.user_id}, Team: {self.team_name}, Rank: {self.rank}>'

# --- Create Database Tables ---
with app.app_context():
    db.create_all()

# --- Flask Routes ---
@app.route('/', methods=['GET'])
def index():
    return render_template('index.html')

@app.route('/submit_prediction', methods=['POST'])
def submit_prediction():
    name = request.form.get('name')
    email = request.form.get('email')
    teams_raw = []
    for i in range(1, 21):
        team = request.form.get(f'team{i}')
        if team:
            teams_raw.append(team.strip())

    # --- Server-side Validation ---
    if not name or not email:
        return jsonify({'status': 'error', 'message': 'Name and Email are required!'}), 400

    if not all(teams_raw) or len(teams_raw) != 20:
        return jsonify({'status': 'error', 'message': 'Please enter all 20 football teams.'}), 400

    if '@' not in email or '.' not in email:
        return jsonify({'status': 'error', 'message': 'Please enter a valid email address.'}), 400

    if len(set(teams_raw)) != 20:
        return jsonify({'status': 'error', 'message': 'Please ensure all 20 team entries are unique.'}), 400

    try:
        user = User.query.filter_by(email=email).first()
        if not user:
            user = User(name=name, email=email)
            db.session.add(user)
            db.session.commit()

        Prediction.query.filter_by(user_id=user.id).delete()
        db.session.commit()

        for rank, team_name in enumerate(teams_raw, 1):
            prediction = Prediction(user_id=user.id, team_name=team_name, rank=rank)
            db.session.add(prediction)

        db.session.commit()

        # --- Email Sending Logic ---
        # email_sent = True
        email_message = "Your prediction has been submitted successfully!"
        # try:
        #     msg = Message(
        #         subject="Your Football League Prediction Confirmation",
        #         recipients=[email],
        #         html=render_template('email/prediction_confirmation.html', user_name=name, teams=teams_raw)
        #     )
        #     mail.send(msg)
        #     email_message += " A copy has been sent to your email."
        # except Exception as e:
        #     app.logger.error(f"Failed to send email to {email}: {e}")
        #     email_message += " However, we failed to send a confirmation email."
        #     email_sent = False
        # --- End Email Sending Logic ---

        return jsonify({'status': 'success', 'message': email_message}), 200

    except Exception as e:
        db.session.rollback()
        app.logger.error(f"Error submitting prediction: {e}")
        return jsonify({'status': 'error', 'message': f'An error occurred: {str(e)}'}), 500

# --- Run the application ---
if __name__ == '__main__':
    app.run(debug=True)