import logging
from pathlib import Path

from appdirs import AppDirs
from fasthtml.common import Div, P, fast_app

log = logging.getLogger("NewsEd")

log.info("Creating application dirs")
app_dirs = AppDirs("NewsEd", "adelante")
app_data_dir = Path(app_dirs.user_data_dir)
app_data_dir.mkdir(parents=True, exist_ok=True)
uploads_dir = app_data_dir / "uploads"
uploads_dir.mkdir(parents=True, exist_ok=True)
log.info(f"User data dir is: ${app_data_dir}")


app, rt = fast_app(key_fname=str(app_data_dir / ".sessionkey"), pico=True)


@rt("/")
def get():
    return Div(P("Hello World!"), hx_get="/change")


@rt("/change")
def page2():
    return P("Nice to be here!")
