
// eslint-disable-next-line import/no-anonymous-default-export
export const fetchHandler = (data, method, url, callback) => {
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
            callback(response.data)
        })
        .catch((error) => {
            console.error(error);
        });
}