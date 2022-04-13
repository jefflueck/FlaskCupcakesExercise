from flask import Flask, request, render_template, redirect, flash, session, jsonify
from flask_debugtoolbar import DebugToolbarExtension
from models import db, connect_db, Cupcake, DEFAULT_IMG_URL

app = Flask(__name__)

app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql:///cupcakes'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SQLALCHEMY_ECHO'] = True

# the toolbar is only enabled in debug mode:
app.debug = True
app.config['DEBUG_TB_INTERCEPT_REDIRECTS'] = False
# set a 'SECRET_KEY' to enable the Flask session cookies
app.config['SECRET_KEY'] = 'The secret key'
toolbar = DebugToolbarExtension(app)

connect_db(app)

@app.route('/')
def show_homepage():
  '''Show homepage'''
  return render_template('index.html')

@app.route('/api/cupcakes')
def list_cupcakes():
  """List all cupcakes."""
  all_cupcakes = [cupcake.serialize() for cupcake in Cupcake.query.all()]
  return jsonify(cupcakes=all_cupcakes)

@app.route('/api/cupcakes/<int:id>')
def get_cupcake(id):
  """Show a single cupcake."""
  cupcake = Cupcake.query.get_or_404(id)
  return jsonify(cupcake=cupcake.serialize())

@app.route('/api/cupcakes', methods=['POST'])
def create_cupcake():
  """Create a new cupcake."""
  flavor=request.json['flavor'],
  size=request.json['size'],
  rating=request.json['rating'],
  image=request.json['image'] if None else DEFAULT_IMG_URL

  new_cupcake = Cupcake(flavor=flavor, size=size, rating=rating, image=image)

  db.session.add(new_cupcake)
  db.session.commit()

  return jsonify(cupcake=new_cupcake.serialize()), 201

@app.route('/api/cupcakes/<int:id>', methods=['PATCH'])
def update_cupcake(id):
  """Update a cupcake."""
  cupcake = Cupcake.query.get_or_404(id)

  cupcake.flavor = request.json['flavor']
  cupcake.size = request.json['size']
  cupcake.rating = request.json['rating']
  cupcake.image = request.json['image'] if None else DEFAULT_IMG_URL

  db.session.add(cupcake)
  db.session.commit()

  return jsonify(cupcake=cupcake.serialize())

@app.route('/api/cupcakes/<int:id>', methods=['DELETE'])
def delete_cupcake(id):
  """Delete a cupcake."""
  cupcake = Cupcake.query.get_or_404(id)
  db.session.delete(cupcake)
  db.session.commit()

  return jsonify(message=f"Deleted cupcake with id {id}.")
