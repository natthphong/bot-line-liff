import {useEffect} from "react";


export default function About(props) {
    const { liff, liffError } = props;
    useEffect(() => {
        if (liff) {
            // Check if logged in and get access token
            if (liff.isLoggedIn()) {
                // console.log("Access Token: ", liff.getAccessToken());
                console.log("Access Token: ", liff.getAccessToken());
                console.log("Version: ", liff.getVersion());
            } else {
                liff.login();
            }
        }
    }, [liff]); // Trigger when liff is initialized

    if (!liff) {
        return <div>Loading...</div>; // Show a loading state while `liff` is being initialized
    }

    if (liffError) {
        return <div>Error: {liffError.message}</div>;
    }
    return (
        <div>
            <h1>About Page {liff.getAccessToken()}</h1>

            <p>Welcome to the about page of this Next.js application.</p>
            <button onClick={()=> {
                liff.logout()
                window.location.reload()
            }}>Logout</button>
        </div>
    );
}
