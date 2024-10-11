import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import { apiCall } from "utils/api";

export default function Home(props) {
    const { liff, liffError } = props;
    const router = useRouter();
    const [branches, setBranches] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);  // State for current page
    const [size, setSize] = useState(10);  // State for size (number of branches per page)
    const [totalBranches, setTotalBranches] = useState(0);  // State for total number of branches

    useEffect(() => {
        const fetchBranches = async () => {
            let authType = localStorage.getItem("x-auth-type");
            let companyCode = localStorage.getItem("companyCode");

            if (!companyCode) {
                companyCode = "BAANFOOD";  // Fallback value if companyCode is empty
            }
            if (!authType) {
                authType = "line";  // Fallback value if authType is empty
            }

            if (liff && liff.isLoggedIn()) {
                try {
                    // Use the apiCall utility to fetch branches
                    const data = await apiCall({
                        url: "/auth/branch/list",
                        method: "POST",
                        authType,
                        body: {
                            page: page,  // Fetch the current page
                            size: size,  // Fetch the specified size per page
                            companyCode,
                            internal: ""
                        },
                        liff
                    });

                    if (data.status === 401 || data.code > 450) {
                        liff.logout();
                    }

                    setBranches(data.body.message.branches);
                    setTotalBranches(data.body.message.totalCount);  // Assuming totalCount is returned from the API
                    setLoading(false);
                } catch (error) {
                    if (error.status === 401 || error.code > 450) {
                        liff.logout();
                    }
                    console.error("Error fetching branches:", error);
                }
            }
        };

        if (liff && liff.isLoggedIn()) {
            fetchBranches();  // Fetch branches when liff is ready
        }
    }, [liff, page, size]);  // Re-fetch data when page or size changes

    // Handle page change
    const handlePageChange = (newPage) => {
        setPage(newPage);
    };

    // Handle page size change
    const handleSizeChange = (event) => {
        setSize(Number(event.target.value));  // Set new size from dropdown and reset to page 1
        setPage(1);
    };

    if (loading) return <div>Loading...</div>;
    if (liffError) return <div>Error: {liffError.message}</div>;

    return (
        <div>
            <Head>
                <title>Baan อาหารตามสั่ง</title>
            </Head>
            <h1>Choose a Branch</h1>

            {/* Page Size Selector */}
            <div>
                <label>Branches per page: </label>
                <select value={size} onChange={handleSizeChange}>
                    <option value={5}>5</option>
                    <option value={10}>10</option>
                    <option value={20}>20</option>
                </select>
            </div>

            <div className="branch-list">
                {branches && branches.map(branch => (
                    <div
                        key={branch.branchCode}
                        className="branch-card"
                        onClick={() => {
                            localStorage.setItem("branchCode",branch.branchCode)
                            router.push(`/menu/${branch.branchCode}`)
                        }}
                    >
                        <img src="/logo_baan.png" alt="Branch logo" className="branch-logo" />
                        <div className="branch-details">
                            <h3>{branch.branchName}</h3>
                            <p>{branch.branchDescription}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Pagination Controls */}
            <div className="pagination-controls">
                <button
                    disabled={page === 1}
                    onClick={() => handlePageChange(page - 1)}
                >
                    Previous
                </button>
                <span>{`Page ${page}`}</span>
                <button
                    disabled={page * size >= totalBranches}
                    onClick={() => handlePageChange(page + 1)}
                >
                    Next
                </button>
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
        .pagination-controls {
          display: flex;
          justify-content: center;
          margin-top: 20px;
        }
        button {
          margin: 5px;
          padding: 5px 10px;
        }
      `}</style>
        </div>
    );
}
