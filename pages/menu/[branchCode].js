import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { apiCall } from "utils/api";

export default function MenuPage(props) {
    const { liff } = props;
    const router = useRouter();
    const { branchCode } = router.query;
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState("");
    const [products, setProducts] = useState([]);
    const [authType, setAuthType] = useState(null);

    const [page, setPage] = useState(1);
    const [size, setSize] = useState(10);
    const [totalProducts, setTotalProducts] = useState(0);

    useEffect(() => {
        const storedAuthType = localStorage.getItem("x-auth-type");
        setAuthType(storedAuthType);
    }, []);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const data = await apiCall({
                    url: "/auth/category/list",
                    method: "POST",
                    authType,
                    body: { page: 1, size: 99999, branchCode },
                    liff,
                });

                setCategories(data.body.message.categories);
            } catch (error) {
                console.error("Error fetching categories:", error);
            }
        };

        if (branchCode && liff && liff.isLoggedIn() && authType) {
            fetchCategories();
            fetchProducts("");
        }
    }, [branchCode, liff, authType, page, size]);

    const fetchProducts = async (categoryCode) => {
        try {
            const data = await apiCall({
                url: "/auth/product/list",
                method: "POST",
                authType,
                body: { page, size, branchCode, categoryCode },
                liff,
            });

            setProducts(data.body.message.products);
            setTotalProducts(data.body.message.totalCount);
        } catch (error) {
            console.error("Error fetching products:", error);
        }
    };

    const handlePageChange = (newPage) => {
        setPage(newPage);
        fetchProducts(selectedCategory);
    };

    const handleSizeChange = (newSize) => {
        setSize(newSize);
        setPage(1);
        fetchProducts(selectedCategory);
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
                        fetchProducts(e.target.value);
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
                    <th>Quantity</th> {/* Show quantity for FOOD items */}
                    <th>Image</th> {/* Show product image */}
                </tr>
                </thead>
                <tbody>
                {products && products.map((product) => (
                    <tr
                        key={product.productCode}
                        onClick={() => {

                            if (product.inActive === 'Y') {
                                localStorage.setItem("product", JSON.stringify(product));
                                router.push(`/menu/product/${product.productCode}`);
                            }
                        }}
                        style={{
                            cursor: product.inActive === 'Y' ? 'pointer' : 'not-allowed',
                            opacity: product.inActive === 'Y' ? 1 : 0.5,
                        }}
                    >
                        {/* Show productNameTh for FOOD */}
                        <td>{product.productType !== 'FOOD' ? product.productNameTh : product.productNameEng}</td>
                        <td>{product.productDescription}</td>
                        <td>{product.amount}</td>

                        {/* Show productQuantity if productType is FOOD */}
                        <td>{product.productType !== 'FOOD' ? product.productQuantity : '-'}</td>

                        {/* Show productImage or fallback to default image */}
                        <td>
                            <img
                                src={product.productImage || "/product-image.png"}
                                alt={product.productNameEng}
                                style={{ width: "50px", height: "50px" }}
                            />
                        </td>
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
                img {
                    display: block;
                    margin: 0 auto;
                }
            `}</style>
        </div>
    );
}
