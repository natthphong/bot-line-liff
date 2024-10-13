import axios from "axios";


export async function apiCall({
                                  url,
                                  method = "GET",
                                  authType,
                                  body = null,
                                  liff,
                                  token = ""
                              }) {
    try {

        if (authType === "line" && liff){
            token  = liff.getIDToken()
        }
        const headers = {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
            "x-auth-type": authType,
        };

        const response = await axios({
            url: `${process.env.NEXT_PUBLIC_BASE_URL_API}${url}`,
            method,
            headers,
            data: body,
        });

        if (response.status === 401) {
            if (authType === "line" && liff){
                liff.logout();
            }

        }
        return response.data;
    } catch (error) {
        console.error(`API call error to ${url}:`, error.response || error);
        if (error.response.status === 401) {
            if (authType === "line" && liff){
                liff.logout();
            }

        }
        throw error.response?.data || error.message;
    }
}
