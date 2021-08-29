
// eslint-disable-next-line import/no-anonymous-default-export
export const fetchHandler = (data, method, url, callback) => {
    console.log(data, method, url);
    fetch(url, {
        mode: 'cors',
        method: method,
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    })
        .then((response) => response.json())
        .then((response) => {
            //console.log(`${url} -> ${response.status}`);
            callback(response.data)
        })
        .catch((error) => {

            console.error(error);
        });
}