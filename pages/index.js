import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import axios from "axios";

export default function Home(props) {
    const { liff, liffError } = props;
    const router = useRouter();
    const [branches, setBranches] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBranches = async () => {
            const authType = localStorage.getItem("x-auth-type");
            const companyCode = localStorage.getItem("companyCode");

            if (liff && liff.isLoggedIn() ) {
                if (companyCode===""){
                    companyCode ="BAANFOOD"
                }
                try {
                    const token = liff.getIDToken();
                    const response = await axios.post(
                        `${process.env.NEXT_PUBLIC_BASE_URL_API}/auth/branch/list`,
                        {
                            page: 1,
                            size: 10,
                            companyCode: companyCode,
                            internal: ""
                        },
                        {
                            headers: {
                                "Content-Type": "application/json",
                                "Authorization": `Bearer ${token}`,
                                "x-auth-type": authType,
                            },
                        }
                    );
                    const result = response.data;
                    if (result.status === 401 || result.code > 450) {
                        liff.logout();
                    }
                    setBranches(result.body.message.branches);
                    setLoading(false);
                } catch (error) {
                    if (error.status === 401 || error.code > 450) {
                        liff.logout();
                    }
                    console.error(error);
                }
            }
        };

        if (liff) {
            if (liff.isLoggedIn()) {
                fetchBranches();
            }
        }
    }, [liff]);

    if (loading) return <div>Loading...</div>;
    if (liffError) return <div>Error: {liffError.message}</div>;
    return (
        <div>
            <Head>
                <title>Baan อาหารตามสั่ง</title>
            </Head>
            <h1>Choose a Branch</h1>
            <div className="branch-list">
                {branches && branches.map(branch => (
                    <div
                        key={branch.branchCode}
                        className="branch-card"
                        onClick={() => router.push(`/menu/${branch.branchCode}`)}
                    >
                        <img src="/logo_baan.png" alt="Branch logo" className="branch-logo" />
                        <div className="branch-details">
                            <h3>{branch.branchName}</h3>
                            <p>{branch.branchDescription}</p>
                        </div>
                    </div>
                ))}
            </div>

            <style jsx>{`
        .branch-list {
          display: flex;
          flex-wrap: wrap;
        }
        .branch-card {
          width: 100%;
          border: 1px solid #ddd;
          margin: 10px;
          padding: 10px;
          border-radius: 5px;
          cursor: pointer;
        }
        .branch-logo {
          width: 100px;
          height: 100px;
        }
        .branch-details {
          margin-left: 10px;
        }
      `}</style>
        </div>
    );
}
