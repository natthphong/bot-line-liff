import "../styles/globals.css";
import { useState, useEffect } from "react";
import liff from "@line/liff";


function MyApp({ Component, pageProps }) {
  const [liffObject, setLiffObject] = useState(null);
  const [liffError, setLiffError] = useState(null);

  // Execute liff.init() when the app is initialized
  useEffect(() => {
    const main = async () => {
      try {
        await liff.init({ liffId: process.env.LIFF_ID });

        if (liff.isLoggedIn()) {
          console.log(liff.getAccessToken());
          console.log(liff.getIDToken());
        } else {
          liff.login();
        }
        
        // Set the liff object after initialization
        // console.log("set",liff)
        setLiffObject(liff);
      } catch (error) {
        // If there is an error during initialization, set the error
        setLiffError(error);
        console.error("LIFF initialization failed", error);
      }
    };

    main();

  }, []);

  // Provide `liff` object and `liffError` object
  // to page component as property
  pageProps.liff = liffObject;
  pageProps.liffError = liffError;
  return <Component {...pageProps} />;
}

export default MyApp;
