"""
Flask application factory.
Creates and configures the Flask app with all necessary extensions and blueprints.
"""
from flask import Flask, jsonify
from flask_cors import CORS
from app.config import get_config
import logging


def create_app(config_name=None):
    """
    Application factory pattern.
    
    Args:
        config_name: Configuration name ('development', 'production', 'testing')
        
    Returns:
        Configured Flask application instance
    """
    app = Flask(__name__)
    
    # Load configuration
    config_class = get_config()
    app.config.from_object(config_class)
    
    # Validate configuration
    try:
        config_class.validate()
    except ValueError as e:
        app.logger.error(f"Configuration error: {e}")
        # In development, we'll allow the app to start but log the error
        if not app.config['DEBUG']:
            raise
    
    # Configure CORS
    CORS(app, resources={
        r"/api/*": {
            "origins": app.config['FRONTEND_URL'],
            "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
            "allow_headers": ["Content-Type", "Authorization"]
        }
    })
    
    # Configure logging
    if not app.debug:
        logging.basicConfig(
            level=logging.INFO,
            format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
        )
    
    # Register error handlers
    register_error_handlers(app)
    
    # Register blueprints
    register_blueprints(app)
    
    return app


def register_error_handlers(app):
    """Register error handlers for common HTTP errors."""
    
    @app.errorhandler(400)
    def bad_request(error):
        return jsonify({
            'error': 'Bad Request',
            'message': str(error.description) if hasattr(error, 'description') else 'Invalid request'
        }), 400
    
    @app.errorhandler(401)
    def unauthorized(error):
        return jsonify({
            'error': 'Unauthorized',
            'message': 'Authentication required'
        }), 401
    
    @app.errorhandler(403)
    def forbidden(error):
        return jsonify({
            'error': 'Forbidden',
            'message': 'You do not have permission to access this resource'
        }), 403
    
    @app.errorhandler(404)
    def not_found(error):
        return jsonify({
            'error': 'Not Found',
            'message': 'The requested resource was not found'
        }), 404
    
    @app.errorhandler(500)
    def internal_error(error):
        app.logger.error(f'Internal server error: {error}')
        return jsonify({
            'error': 'Internal Server Error',
            'message': 'An unexpected error occurred'
        }), 500


def register_blueprints(app):
    """Register Flask blueprints."""
    from app.routes.health import health_bp
    from app.routes.friends import friends_bp
    
    app.register_blueprint(health_bp, url_prefix='/api/v1')
    app.register_blueprint(friends_bp, url_prefix='/api/v1')
