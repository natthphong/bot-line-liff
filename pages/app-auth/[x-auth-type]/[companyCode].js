import { useEffect } from "react";
import { useRouter } from "next/router";

export default function RedirectPage() {
    const router = useRouter();
    const { "x-auth-type": authType, companyCode } = router.query;

    useEffect( () => {
        if (authType && companyCode) {
            // Store x-auth-type and companyCode in localStorage
            localStorage.setItem("x-auth-type", authType);
            localStorage.setItem("companyCode", companyCode);
            // await router.push("/");
        }
    }, [authType, companyCode, router]);

    // Handler for button click to manually redirect
    const handleRedirect = () => {
        router.push("/");
    };

    return (
        <div>
            <p>Redirecting...</p>
            <button onClick={handleRedirect}>Go to Home</button>
        </div>
    );
}
