import { useEffect } from "react";
import { useRouter } from "next/router";

export default function RedirectPage() {
    const router = useRouter();
    const { "x-auth-type": authType, companyCode } = router.query;

    useEffect(() => {
        if (authType && companyCode) {
            // Store x-auth-type and companyCode in localStorage
            localStorage.setItem("x-auth-type", authType);
            localStorage.setItem("companyCode", companyCode);

            // // Redirect to the home page router.push("/");

        }
    }, [authType, companyCode, router]);

    return <div>`TEST...${authType} ${companyCode}`</div>;
}
