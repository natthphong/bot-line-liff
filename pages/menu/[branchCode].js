import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { apiCall } from "../../../utils/api";

export default function MenuPage(props) {
    const { liff } = props;
    const router = useRouter();
    const { branchCode } = router.query;
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState("");
    const [products, setProducts] = useState([]);
    const [authType, setAuthType] = useState(null);

    // Pagination state
    const [page, setPage] = useState(1);
    const [size, setSize] = useState(10);
    const [totalProducts, setTotalProducts] = useState(0);

    // Get authType from localStorage on component mount
    useEffect(() => {
        const storedAuthType = localStorage.getItem("x-auth-type");
        setAuthType(storedAuthType);
    }, []);

    // Fetch categories when the component mounts or branchCode changes
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const data = await apiCall({
                    url: "/auth/category/list",
                    method: "POST",
                    authType,
                    body: { page: 1, size: 10, branchCode },
                    liff,
                });

                setCategories(data.message.categories);
            } catch (error) {
                console.error("Error fetching categories:", error);
            }
        };

        if (branchCode && liff && liff.isLoggedIn() && authType) {
            fetchCategories();
            fetchProducts("");  // Fetch products without category to load initial list
        }
    }, [branchCode, liff, authType, page, size]);

    // Fetch products based on selected category and pagination
    const fetchProducts = async (categoryCode) => {
        try {
            const data = await apiCall({
                url: "/auth/product/list",
                method: "POST",
                authType,
                body: { page, size, branchCode, categoryCode },
                liff,
            });

            setProducts(data.message.products);
            setTotalProducts(data.message.totalCount);  // Assuming the total count is returned
        } catch (error) {
            console.error("Error fetching products:", error);
        }
    };

    // Handle page change for pagination
    const handlePageChange = (newPage) => {
        setPage(newPage);
        fetchProducts(selectedCategory);  // Refetch products with the updated page
    };

    // Handle size change for pagination
    const handleSizeChange = (newSize) => {
        setSize(newSize);
        setPage(1);  // Reset to page 1 when size changes
        fetchProducts(selectedCategory);  // Refetch products with the updated size
    };

    return (
        <div>
            <h1>Menu for {branchCode}</h1>

            {/* Category selection */}
            <div>
                <label>Select Category:</label>
                <select
                    value={selectedCategory}
                    onChange={(e) => {
                        setSelectedCategory(e.target.value);
                        fetchProducts(e.target.value);  // Fetch products for selected category
                    }}
                >
                    <option value="">Select a category</option>
                    {categories.map((category) => (
                        <option key={category.categoryCode} value={category.categoryCode}>
                            {category.categoryNameEng}
                        </option>
                    ))}
                </select>
            </div>

            {/* Pagination size control */}
            <div>
                <label>Products per page: </label>
                <select value={size} onChange={(e) => handleSizeChange(Number(e.target.value))}>
                    <option value={5}>5</option>
                    <option value={10}>10</option>
                    <option value={20}>20</option>
                </select>
            </div>

            {/* Product table */}
            <table>
                <thead>
                <tr>
                    <th>Product Name</th>
                    <th>Description</th>
                    <th>Price</th>
                </tr>
                </thead>
                <tbody>
                {products.map((product) => (
                    <tr key={product.productCode}>
                        <td>{product.productNameEng}</td>
                        <td>{product.productDescription}</td>
                        <td>{product.amount}</td>
                    </tr>
                ))}
                </tbody>
            </table>

            {/* Pagination controls */}
            <div>
                <button
                    disabled={page === 1}
                    onClick={() => handlePageChange(page - 1)}
                >
                    Previous
                </button>
                <span>{`Page ${page}`}</span>
                <button
                    disabled={page * size >= totalProducts}
                    onClick={() => handlePageChange(page + 1)}
                >
                    Next
                </button>
            </div>

            {/* Table styling */}
            <style jsx>{`
                table {
                    width: 100%;
                    border-collapse: collapse;
                }
                th, td {
                    border: 1px solid #ddd;
                    padding: 8px;
                }
                button {
                    margin: 5px;
                    padding: 5px 10px;
                }
            `}</style>
        </div>
    );
}
