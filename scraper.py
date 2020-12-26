import sys
import json
import flask
from bs4 import BeautifulSoup
from urllib.request import urlopen
from flask import request, jsonify
from flask_cors import CORS

app = flask.Flask(__name__)
app.config["DEBUG"] = True
app.config['CORS_HEADERS'] = 'Content-Type'
CORS(app)


def get_product_elements(url):
    page = urlopen(url)
    html = page.read().decode("utf-8")
    soup = BeautifulSoup(html, "html.parser")

    product_title = soup.find('h1', class_='product-title')
    product_price_dollars_raw = soup.find('li', class_='price-current').strong
    product_price_cents = soup.find('li', class_='price-current').sup
    product_ship = soup.find('div', class_='product-inventory').strong

    product_price_dollars = product_price_dollars_raw.text.replace(',', '')
    product_price = int(product_price_dollars) + \
        float(product_price_cents.text)

    data = [{"productTitle": product_title.text,
             "productPrice": product_price,
             "productAvailability": product_ship.text}]
    return data


@app.route('/', methods=['GET'])
def home():
    message = []
    message[0] = 'GET api/resources/products provide url returns productTitle, productPrice, productAvailability'
    return message


@app.route('/api/resources/products', methods=['GET'])
def api_product():
    if 'url' in request.args:
        url = str(request.args['url'])
    else:
        return "Error: No url field provided. Please specify a url."

    product_elements = get_product_elements(url)
    return jsonify(product_elements)


app.run()
