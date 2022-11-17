const requestProduct = async (category) => {
    const url = `https://makeup-api.herokuapp.com/api/v1/products.json`;
    const urlCategory = `?product_category=${category}`;
    const baseUrl = url + urlCategory;

    try {
        const fetchUrl = await fetch (baseUrl);
        data = await fetchUrl.json();

        return data;
    }

    catch (error) {
        console.log(error);
    }
}
