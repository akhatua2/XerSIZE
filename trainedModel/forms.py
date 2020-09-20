from flask_wtf import FlaskForm
from wtforms import StringField, PasswordField, SubmitField

class SignUpForm(FlaskForm):
	name = StringField('name')
	password = PasswordField('Password')
	submit = SubmitField('Sign up')