# %%
if __name__ == "__main__":

    from bs4 import BeautifulSoup
    from urllib.request import urlopen

    # %%
    url = 'https://www.newegg.com/black-purple-dowinx-ls-668806-computer-gaming/p/2T4-029X-00021?Item=9SIAKUYC2X4632&cm_sp=Homepage_SS-_-P0_9SIAKUYC2X4632-_-12222020&quicklink=true'
    page = urlopen(url)
    html = page.read().decode("utf-8")
    soup = BeautifulSoup(html, "html.parser")

    # %%
    product_title = soup.find('h1', class_='product-title')
    product_price = soup.find('li', class_='price-current').strong
    product_ship = soup.find('div', class_='product-inventory').strong

    # %%
    points = [product_title.text, product_price.text, product_ship.text]
    print(points)
