from flask import Flask

from config import Config
from services.database import Database

db = Database()


def create_app(config):
    app = Flask(__name__)
    app.config.from_object(config)

    db.init_app(app.config.get('DATABASE_FILE_PATH'))
    app.db = db
    
    # Register blueprints
    from api.views import api
    app.register_blueprint(api)

    return app

app = create_app(Config)
