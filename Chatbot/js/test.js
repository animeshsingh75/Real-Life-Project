async function getJoke() {
    const response = await fetch('http://api.icndb.com/jokes/random');
    const jsonResp = await response.json();
    return jsonResp;
}

async function getNews() {
    const response = await fetch('http://newsapi.org/v2/top-headlines?country=in&pageSize=1&apiKey=0fb55be3f26242f2b9e8d2aa016d426f');
    const jsonResp = await response.json();
    return jsonResp;
}