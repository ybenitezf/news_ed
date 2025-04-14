from fasthtml.common import serve


def run(reload: bool = False):
    serve(
        appname="news.ui_back.core", host="127.0.0.1", port=8000, reload=reload
    )


if __name__ == "__main__":
    run()
