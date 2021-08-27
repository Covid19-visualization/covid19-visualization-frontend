import { FETCH_ERROR, FETCH_LOADED, FETCH_LOADING } from "./API";

// eslint-disable-next-line import/no-anonymous-default-export
export default (data, method, url) => (dispatch) => {
    dispatch({
        type: FETCH_LOADING,
    })
    fetch(url, {
        mode: 'cors',
        method: method,
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
        },
        body: data,
    })
        .then((response) => response.json())
        .then((response) => {
            //console.log(`${url} -> ${response.status}`);
            dispatch({
                type: FETCH_LOADED,
                payload: response.data,
            })
        })
        .catch((error) => {
            dispatch({
                type: FETCH_ERROR,
                payload: error,
            })
            console.error(error);
        });
}