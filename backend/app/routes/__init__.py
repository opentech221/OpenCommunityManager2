# Routes API

from .main import main_bp
from .auth import auth_bp
from .members import members_bp
from .cotisations import cotisations_bp
from .events import events_bp
from .finances import finances_bp
from .health import health_bp
from .guidance import guidance_bp

__all__ = [
    'main_bp',
    'auth_bp',
    'members_bp',
    'cotisations_bp',
    'events_bp',
    'finances_bp',
    'health_bp',
    'guidance_bp'
]
