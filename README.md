# A news editor

A python poetry polylith project

## Before you start:

- Install poetry: https://python-poetry.org/docs/#installation
- Add polylith tooling: https://davidvujic.github.io/python-polylith-docs/installation/

Run

```shell
git init
poetry install
# install pre-commit hook
poetry run pre-commit install
# install pre-commit dependencies
poetry run pre-commit run -a
```

## How to build locally

- Go to `projects/news_app`
- Build the project if needed: `poetry build-project`
- Create an local vitualenv, build and install the `.whl`:
  - `python3 -m venv .venv`
  - `source .venv/bin/activate`
  - `pip install dist/news_app-x.x.x-py3-none-any.whl`
  - Install `pyinstaller`: `pip install pyinstaller`
  - Create the pyinstaller distributable:
    - `pyinstaller --onefile runner.py`
  - Copy binary to `elec_app` project:
    - `cp dist/runner ../elec_app/papp/runner`
  - Change folder to the elec_app project: `cd ../elec_app/papp/runner`
  - run the app with: `npm run start`

## Polylith Docs
The official Polylith documentation:
[high-level documentation](https://polylith.gitbook.io/polylith)

A Python implementation of the Polylith tool:
[python-polylith](https://github.com/DavidVujic/python-polylith)
