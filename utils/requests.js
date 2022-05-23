import { GEOCODING_API_KEY } from "@env"

export async function postJsonData(url = '', data = {}, additionalHeaders = {}) {
    // console.log('POST ' + url + ' ' + JSON.stringify(data));
    reqHeaders = Object.assign({}, additionalHeaders, { 'Content-Type': 'application/json' });

    return fetch(url, {
        method: 'POST',
        headers: reqHeaders,
        body: JSON.stringify(data),
        maxContentLength: Infinity,
        maxBodyLength: Infinity
    })
    .then(response => {
        if (response.ok) {
            return response;
        } else {
            console.log('POST ' + url + ' returned ' + response.status);
            throw Error('Request at POST ' + url + ' returned ' + response.status)
        }
    })
    .then(response => response.json())
    .then((response) => {
        return response;
    });
};

export async function deleteJsonData(url = '', data = {}, additionalHeaders = {}) {
    reqHeaders = Object.assign({}, additionalHeaders, { 'Content-Type': 'application/json' });

    return fetch(url, {
        method: 'DELETE',
        headers: reqHeaders,
        body: JSON.stringify(data)
    })
    .then(response => {
        if (response.ok) {
            return response;
        } else {
            console.log('DELETE ' + url + ' returned ' + response.status);
            throw Error('Request at DELETE ' + url + ' returned ' + response.status)
        }
    });
};


export async function getJsonData(url = '', additionalHeaders = {}) {
    reqHeaders = Object.assign({}, additionalHeaders, { 'Content-Type': 'application/json'});
    console.log(`GET ${url} with headers ${JSON.stringify(reqHeaders)}`);
    return fetch(url, {
        method: 'GET',
        headers: reqHeaders
    })
    .then(response => {
        if (response.ok) {
            return response;
        } else {
            console.log('GET ' + url + ' returned ' + response.status);
            throw Error('Request at GET ' + url + ' returned ' + response.status)
        }
    })
    .then(response => response.json())
    .then((response) => {
        return response;
    });
};


export async function putJsonData(url = '', data = {}, additionalHeaders = {}) {
    reqHeaders = Object.assign({}, additionalHeaders, { 'Content-Type': 'application/json'});

    // console.log('PUT ' + url + ' ' + JSON.stringify(data));
    return fetch(url, {
        method: 'PUT',
        headers: reqHeaders,
        body: JSON.stringify(data) 
    })
    .then(response => {
        if (response.ok) {
            return response;
        } else {
            console.log('PUT ' + url + ' returned ' + response.status);
            throw Error('Request at PUT ' + url + ' returned ' + response.status)
        }
    })
    .then(response => response.json())
    .then((response) => {
        return response;
    });
};

export async function getLocationFromCoordinates(latitude, longitude) {
    const url = `http://api.positionstack.com/v1/reverse?access_key=${GEOCODING_API_KEY}&query=${latitude},${longitude}`
    return fetch(url)
    .then(response => {
        if (response.ok) {
            return response;
        } else {
            console.log('GET ' + url + ' returned ' + response.status);
            throw Error('Request at GET ' + url + ' returned ' + response.status)
        }
    })
    .then(response => response.json())
    .then((response) => {
        return response;
    });
};

export async function getCoordinatesFromLocation(location) {
    const url = `http://api.positionstack.com/v1/forward?access_key=${GEOCODING_API_KEY}&query=${location}`
    return fetch(url)
    .then(response => {
        if (response.ok) {
            return response;
        } else {
            console.log('GET ' + url + ' returned ' + response.status);
            throw Error('Request at GET ' + url + ' returned ' + response.status)
        }
    })
    .then(response => response.json())
    .then((response) => {
        return response;
    });
};
