import "../styles/globals.css";
import { useState, useEffect } from "react";
import liff from "@line/liff";

function MyApp({ Component, pageProps }) {
  const [liffObject, setLiffObject] = useState(null);
  const [liffError, setLiffError] = useState(null);

  useEffect(() => {
    const main = async () => {
      try {
        await liff.init({ liffId: process.env.LIFF_ID });
        if (liff.isLoggedIn()) {
        } else {
          liff.login();
          const idToken = liff.getIDToken();
          await loginToBackend(idToken);
        }

        // Set the liff object after initialization
        setLiffObject(liff);
      } catch (error) {
        // If there is an error during initialization, set the error
        setLiffError(error);
        console.error("LIFF initialization failed", error);
      }
    };

    main();

  }, []);

  const loginToBackend = async (idToken) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL_API}/login/line`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          idToken: idToken,
        }),
      });

      if (!response.ok) {
         new Error('Failed to login to backend');
      }

      const data = await response.json();
      console.log("Backend login success:", data);
    } catch (error) {
      console.error("Error logging in to backend:", error);
    }
  };

  // Provide `liff` object and `liffError` object
  // to page component as property
  pageProps.liff = liffObject;
  pageProps.liffError = liffError;
  return <Component {...pageProps} />;
}

export default MyApp;
