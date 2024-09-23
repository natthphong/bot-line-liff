import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import packageJson from "../package.json";

export default function Home(props) {
    const { liff, liffError } = props;
    const router = useRouter();
    const [branches, setBranches] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBranches = async () => {
            if (liff && liff.isLoggedIn()) {
                try {
                    const token = liff.getIDToken();
                    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL_API}/auth/branch/list`, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            "Authorization": `Bearer ${token}`,
                        },
                        body: JSON.stringify({
                            page: 1,
                            size: 10,
                            companyCode: "BAANFOOD",
                            internal: ""
                        }),
                    });
                    const result = await response.json();
                    setBranches(result.body.message.branches);
                    setLoading(false);
                } catch (error) {
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
                {branches.map(branch => (
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
