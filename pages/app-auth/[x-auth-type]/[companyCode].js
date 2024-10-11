import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { apiCall } from "utils/api";


export default function RedirectPage(props) {
    const { liff } = props;
    const router = useRouter();
    const { "x-auth-type": authType, companyCode } = router.query;  // Get authType and companyCode from URL query
    const [company, setCompany] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCompanyDetails = async () => {
            try {

                const data = await apiCall({
                    url: "/auth/company/inquiry",
                    method: "POST",
                    authType,
                    body: { companyCode },
                    liff
                });

                setCompany(data.body.message);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching company details:", error);
                setLoading(false);
            }
        };

        if (liff && authType && companyCode) {

            localStorage.setItem("x-auth-type", authType);
            localStorage.setItem("companyCode", companyCode);

            fetchCompanyDetails();
        }
    }, [liff, authType, companyCode, router]);

    const handleRedirect = () => {
        router.push("/");
    };


    if (loading) {
        return <p>Loading company details...</p>;
    }

    if (!company) {
        return <p>Company details not found.</p>;
    }
    console.log(company)

    return (
        <div style={{ textAlign: 'center', padding: '20px' }}>
            {/* Display company name */}
            <h1>{company.companyName}</h1>

            {/* Display company logo */}
            <img
                src={company.companyPicture || "/logo_baan.png"}  // Use a default image if companyPicture is null
                alt="Company Logo"
                style={{
                    width: "200px",
                    height: "200px",
                    borderRadius: "50%",  // Circle image
                    display: "block",
                    margin: "0 auto",
                    opacity: company.inActive === 'N' ? 0.5 : 1,  // Grayed out if inactive
                    cursor: company.inActive === 'N' ? 'not-allowed' : 'pointer',  // No pointer if inactive
                }}
                onClick={company.inActive === 'Y' ? handleRedirect : null}  // Redirect only if company is active
            />

            {/* Display company description */}
            <p>{company.companyDescription}</p>

            {/* Render button based on company's active/inactive status */}
            <button
                onClick={handleRedirect}
                disabled={company.inActive === 'N'}
                style={{
                    backgroundColor: company.inActive === 'N' ? 'gray' : '#0070f3',  // Gray if inactive
                    color: 'white',
                    padding: '10px 20px',
                    border: 'none',
                    cursor: company.inActive === 'N' ? 'not-allowed' : 'pointer',  // Disabled cursor if inactive
                    opacity: company.inActive === 'N' ? 0.6 : 1,
                }}
            >
                {company.inActive === 'N' ? 'Inactive' : 'Go to Home'}  {/* Change button text based on status */}
            </button>
        </div>
    );
}
