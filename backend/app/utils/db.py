from flask_sqlalchemy import SQLAlchemy

# Single shared SQLAlchemy instance.
# Import this wherever you need db.session or db.Model.
db = SQLAlchemy()
