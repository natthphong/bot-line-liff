import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";

export default function RedirectPage(props) {
    const { liff } = props;
    const router = useRouter();
    const { "x-auth-type": authType, companyCode } = router.query;
    const [company, setCompany] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCompanyDetails = async () => {
            try {
                // Get the token from LIFF
                const token = liff.getIDToken();

                // Make a POST request with headers
                const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL_API}/company/inquiry`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`,
                        "x-auth-type": authType,
                    },
                    body: JSON.stringify({ companyCode })
                });

                const data = await response.json();
                if (response.ok) {
                    setCompany(data.message);
                } else {
                    console.error("Failed to fetch company details:", data);
                }
                setLoading(false);
            } catch (error) {
                console.error("Error fetching company details:", error);
            }
        };

        if (liff && authType && companyCode) {
            localStorage.setItem("x-auth-type", authType);
            localStorage.setItem("companyCode", companyCode);
            fetchCompanyDetails();  // Fetch company details from API
        }
    }, [liff, authType, companyCode, router]);

    // Handler for button click to manually redirect
    const handleRedirect = () => {
        router.push("/");
    };

    if (loading) {
        return <p>Loading company details...</p>;
    }

    if (!company) {
        return <p>Company details not found.</p>;
    }

    return (
        <div style={{ textAlign: 'center', padding: '20px' }}>
            <h1>{company.companyName}</h1>
            <img
                src={company.companyPicture || "/default-image.png"}  // Fallback image if companyPicture is null
                alt="Company Logo"
                style={{
                    width: "200px",
                    height: "200px",
                    borderRadius: "50%",
                    display: "block",
                    margin: "0 auto",
                    opacity: company.inActive === 'N' ? 0.5 : 1, // Grayed out if inactive
                    cursor: company.inActive === 'N' ? 'not-allowed' : 'pointer',
                }}
                onClick={company.inActive === 'Y' ? handleRedirect : null}  // Only clickable if active
            />
            <p>{company.companyDescription}</p>

            <button
                onClick={handleRedirect}
                disabled={company.inActive === 'N'}
                style={{
                    backgroundColor: company.inActive === 'N' ? 'gray' : '#0070f3',
                    color: 'white',
                    padding: '10px 20px',
                    border: 'none',
                    cursor: company.inActive === 'N' ? 'not-allowed' : 'pointer',
                    opacity: company.inActive === 'N' ? 0.6 : 1,
                }}
            >
                {company.inActive === 'N' ? 'Inactive' : 'Go to Home'}
            </button>
        </div>
    );
}
