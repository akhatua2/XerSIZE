from flask import Flask, render_template, request
from forms import SignUpForm


app = Flask(__name__)
app.config['SECRET_KEY'] = 'alpha'

@app.route('/')
def home():
	return 'hello world'


@app.route('/about')
def about():
	return 'about page'

@app.route('/blog') 
def blog():
	return render_template('blog.html', author = "ayan")
@app.route('/login') 
def login():
	return render_template('index.html')

@app.route('/signup', methods=['GET', 'POST'])
def signup():
	form = SignUpForm()
	if form.is_submitted():
		result = request.form
		return render_template("user.html", result=result)
	return render_template('signup.html', form = form)
	

if __name__ == '__main__':
	app.run()