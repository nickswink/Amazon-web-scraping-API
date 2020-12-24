
import sys
import json
from bs4 import BeautifulSoup
from urllib.request import urlopen
# %%
if __name__ == "__main__":
    # %%
    # url = 'https://www.newegg.com/black-purple-dowinx-ls-668806-computer-gaming/p/2T4-029X-00021?Item=9SIAKUYC2X4632&cm_sp=Homepage_SS-_-P0_9SIAKUYC2X4632-_-12222020&quicklink=true'
    url = sys.argv[1]
    page = urlopen(url)
    html = page.read().decode("utf-8")
    soup = BeautifulSoup(html, "html.parser")

    # %%
    product_title = soup.find('h1', class_='product-title')
    product_price_dollars = soup.find('li', class_='price-current').strong
    product_price_cents = soup.find('li', class_='price-current').sup
    product_ship = soup.find('div', class_='product-inventory').strong
    # %%
    product_price = float(product_price_dollars.text) + \
        float(product_price_cents.text)

    data = {"productTitle": product_title.text,
            "productPrice": product_price,
            "productAvailability": product_ship.text}
    data_json = json.dumps(data)
    print(data_json)
