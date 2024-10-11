import { useEffect, useState } from "react";
import { useRouter } from "next/router";

export default function MenuPage(props) {
    const { liff } = props;
    const router = useRouter();
    const { branchCode } = router.query;
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState("");
    const [products, setProducts] = useState([]);
    const [authType, setAuthType] = useState(null);  // Use state for authType

    useEffect(() => {
        const storedAuthType = localStorage.getItem("x-auth-type");
        setAuthType(storedAuthType);
        const fetchCategories = async () => {
            if (liff) {
                const token = liff.getIDToken();
                const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL_API}/auth/category/list`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`,
                        "x-auth-type": authType,
                    },
                    body: JSON.stringify({
                        page: 1,
                        size: 10,
                        branchCode,
                    }),
                });
                const result = await response.json();
                setCategories(result.body.message.categories);
            }
        };

        if (branchCode && liff && liff.isLoggedIn()) {
            fetchCategories();
            fetchProducts("");
        }
    }, [branchCode, liff]);

    const fetchProducts = async (categoryCode) => {
        const token = liff.getIDToken();
        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL_API}/auth/product/list`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
                "x-auth-type": authType,
            },
            body: JSON.stringify({
                page: 1,
                size: 10,
                branchCode,
                categoryCode
            }),
        });
        const result = await response.json();
        setProducts(result.body.message.products);
    };

    return (
        <div>
            <h1>Menu for {branchCode}</h1>
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
                    {categories.map(category => (
                        <option key={category.categoryCode} value={category.categoryCode}>
                            {category.categoryNameEng}
                        </option>
                    ))}
                </select>
            </div>

            <table>
                <thead>
                <tr>
                    <th>Product Name</th>
                    <th>Description</th>
                    <th>Price</th>
                </tr>
                </thead>
                <tbody>
                {products && products.map(product => (
                    <tr key={product.productCode}>
                        <td>{product.productNameEng}</td>
                        <td>{product.productDescription}</td>
                        <td>{product.amount}</td>
                    </tr>
                ))}
                </tbody>
            </table>

            <style jsx>{`
        table {
          width: 100%;
          border-collapse: collapse;
        }
        th, td {
          border: 1px solid #ddd;
          padding: 8px;
        }
      `}</style>
        </div>
    );
}
