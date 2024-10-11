import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { apiCall } from "utils/api";

export default function ProductDetailsPage(props) {
    const { liff } = props;
    const router = useRouter();
    const { productCode } = router.query;
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProductDetails = async () => {
            try {
                const branchCode = localStorage.getItem("branchCode");
                const storedProduct = JSON.parse(localStorage.getItem("product"));
                const companyCode = localStorage.getItem("companyCode") || "BAANFOOD";
                setProduct(storedProduct);
                setLoading(false);
                // if (liff && branchCode && productCode) {
                //     const data = await apiCall({
                //         url: "/auth/product-details/inquiry",
                //         method: "POST",
                //         authType: localStorage.getItem("x-auth-type"),
                //         body: {
                //             productCode,
                //             branchCode,
                //             companyCode
                //         },
                //         liff: liff
                //     });
                //     console.log("data",data)
                //     setProduct(storedProduct);
                //     setLoading(false);
                // }
            } catch (error) {
                console.error("Error fetching product details:", error);
            }
        };

        fetchProductDetails();
    }, [liff,productCode]);

    if (loading) return <div>Loading product details...</div>;

    if (!product) return <div>Product details not found.</div>;

    return (
        <div>
            <h1>{product.productNameTh}</h1>
            <p>{product.productDescription}</p>

            {/* Show image if productType is FOOD */}
            {product.productType === "FOOD" && (
                <div>
                    <img
                        src={product.productImage || "/product-image.png"}  // Fallback to default image
                        alt={product.productNameEng}
                        style={{ width: "200px", height: "200px" }}
                    />
                </div>
            )}

            {/* Show quantity if productType is FOOD */}
            {product.productType !== "FOOD" && (
                <p>Quantity: {product.productQuantity}</p>
            )}

            <style jsx>{`
                img {
                    display: block;
                    margin: 20px auto;
                }
            `}</style>
        </div>
    );
}
