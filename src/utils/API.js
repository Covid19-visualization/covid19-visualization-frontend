// export const backendUrl = 'http://192.168.1.200:8888/' 192.168.1.42
export const backendUrl = 'http://127.0.0.1:8888/'


export const API = {
    GET_ALL_COUNTRY_DATA: `${backendUrl}data/getAllCountryInfo`,
    GET_SELECTED_COUNTRIES_DATA: `${backendUrl}data/getSelectedCountriesInfo`,
    UPDATE_DATA: `${backendUrl}data/updateData`,
    COMPUTE_PCA: `${backendUrl}data/computePca`,
    METHOD: {
        POST: "POST",
        GET: "GET",
    }
}
