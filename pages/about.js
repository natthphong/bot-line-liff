import liff from "@line/liff";

export default function About(props) {
    const { liff, liffError } = props;
    console.log("liff",liff);
    // liff.getVersion()
    if (!liff){
        return <div>Loading</div>;
    }
    if (liffError ) {
        return <div>Error: {liffError.message}</div>;
    }
    // liff.login()
    // console.log("about")
    console.log(liff.getAccessToken());
    // console.log(liff.getIDToken());


    if (!liff) {
        return <div>Loading...</div>; // Show a loading state while `liff` is being initialized
    }
    console.log(liff.getVersion())
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
