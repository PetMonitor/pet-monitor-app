import { GEOCODING_API_KEY } from "@env"
import { getSecureStoreValueFor } from './store';

export const HttpStatusCodes = {
    "NOT_FOUND": 404
}

class HttpError extends Error {
    constructor (message, statusCode) {
        super(message);
        this.statusCode = statusCode;
    }
}

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
            throw new HttpError('Request at POST ' + url + ' returned ' + response.status, response.status)
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
            throw new HttpError('Request at DELETE ' + url + ' returned ' + response.status, response.status)
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
        }
        console.log('GET ' + url + ' returned ' + response.status);
        throw new HttpError('Request at GET ' + url + ' returned ' + response.status, response.status)
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
            throw new HttpError('Request at PUT ' + url + ' returned ' + response.status, response.status)
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
            throw new HttpError('Request at GET ' + url + ' returned ' + response.status, response.status)
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
            throw new HttpError('Request at GET ' + url + ' returned ' + response.status, response.status)
        }
    })
    .then(response => response.json())
    .then((response) => {
        return response;
    });
};

export async function fetchFosterVolunteerProfilesByRegion(filterByRegion, searchRegion, searchCallback) {
    let regionFilter = (filterByRegion && searchRegion != "") ? `?profileRegion=${searchRegion}` : ""
    getSecureStoreValueFor('sessionToken').then((sessionToken) => {
        getSecureStoreValueFor("userId").then(userId => {
            getJsonData(global.noticeServiceBaseUrl + '/fosterVolunteerProfiles' + regionFilter, { 'Authorization': 'Basic ' + sessionToken }
            ).then(profilesInfo => {
                let volunteers = []
                let promises = []

                //console.log(`Obtained volunteer profiles ${JSON.stringify(profilesInfo)}`)
                for (let i = 0; i < profilesInfo.length; i++) {
                    let profileUserId = profilesInfo[i].userId
                    promises.push(getJsonData(global.noticeServiceBaseUrl + '/users/' + profileUserId + '/contactInfo',
                    ).then(userInfo => {
                        //console.log(`User info ${JSON.stringify(userInfo)}`)

                        let volunteerInfo = {
                            label: `--- ${userInfo.name.length > 0? userInfo.name : userInfo.username } ---\n${profilesInfo[i].location}, ${profilesInfo[i].province}`,
                            value: profileUserId
                        }
                        if (userId !== userInfo.userId) {
                            volunteers.push(volunteerInfo)
                        } 
                    }).catch(err => {
                        console.error(err);
                        return {}
                    }))
                }
                Promise.all(promises)
                .then(() => {
                    let dropdownValue = null
                    if (volunteers.length > 0) {
                        volunteers.sort((a, b) => a.label.toLowerCase().localeCompare(b.label.toLowerCase()))
                        dropdownValue = volunteers[0].value
                    }

                    const res = { 
                        volunteers: volunteers,
                        dropdownValue: dropdownValue
                    }

                    //console.log(`RETURNING ${JSON.stringify(res)}`)

                    return searchCallback(res)
                })
                .catch(err => {
                    console.error(err);
                    return {}
                });
            }).catch(err => {
                console.error(err);
                return {}
            });
        });
    });
}