from fasthtml.common import Div, P, fast_app

app, rt = fast_app()


@rt("/")
def get():
    return Div(P("Hello World!"), hx_get="/change")


@rt("/change")
def page2():
    return P("Nice to be here!")
