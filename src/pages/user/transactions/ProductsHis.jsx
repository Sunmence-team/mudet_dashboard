import React from 'react'

const ProductsHis = () => {
  const { user } = useUser();
  const [productsData, setProductsData] = useState({
    data: [],
    current_page: 1,
    last_page: 1,
    per_page: 10,
    total: 0,
  });
  const [loading, setLoading] = useState(true);
  const [selectedRow, setSelectedRow] = useState(null);

  const userId = user?.id;

  const fetchProducts = async (page = 1) => {
    setLoading(true);
    try {
      if (!userId) {
        console.error("User ID is undefined. Please log in.");
        setProductsData({
          data: [],
          current_page: 1,
          last_page: 1,
          per_page: 10,
          total: 0,
        });
        return;
      }

      // Note: Endpoint uses hardcoded user ID '2'. Consider using `userId` for dynamic user data: `/api/users/${userId}/manual-purchases`
      const response = await api.get(
        `/api/users/2/manual-purchases?page=${page}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${
              user?.token ||
              JSON.parse(localStorage.getItem("user") || "{}").token
            }`,
          },
        }
      );

      if (response.status === 200) {
        setProductsData({
          data: response.data.data || [],
          current_page: page,
          last_page: Math.ceil((response.data.total || 0) / 10),
          per_page: 10,
          total: response.data.total || 0,
        });
      } else {
        setProductsData({
          data: [],
          current_page: 1,
          last_page: 1,
          per_page: 10,
          total: 0,
        });
      }
    } catch (err) {
      console.error("Error fetching products:", err);
      setProductsData({
        data: [],
        current_page: 1,
        last_page: 1,
        per_page: 10,
        total: 0,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= productsData.last_page) {
      fetchProducts(page);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    return {
      date: date.toLocaleDateString("en-CA"),
      time: date.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      }),
    };
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case "delivered":
      case "success":
      case "successful":
      case "available":
        return "bg-[#dff7ee]/80 text-[var(--color-primary)]";
      case "out of stock":
      case "failed":
        return "bg-[#c51236]/20 text-red-600";
      case "pending":
      case "pending_manual":
        return "bg-yellow-100 text-yellow-600";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  const closeModal = () => setSelectedRow(null);

  const { data: products, current_page, per_page } = productsData;

  return (
    <div>
      
    </div>
  );
};

export default ProductsHis
