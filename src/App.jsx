import { useEffect, useState } from "react";

const formatNumber = (number) =>
  new Intl.NumberFormat("en", { minimumFractionDigits: 2 }).format(number);

//declaring a collator for product name comparison
const collator = new Intl.Collator();

function App() {
  const [branches, setBranches] = useState({
    branchOne: {},
    branchTwo: {},
    branchThree: {},
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const [searchValue, setSearchValue] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  //fetching data from all branches
  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [resOne, resTwo, resThree] = await Promise.all([
        fetch(`api/branch1.json`).then((res) => res.json()),
        fetch(`api/branch2.json`).then((res) => res.json()),
        fetch(`api/branch3.json`).then((res) => res.json()),
      ]);

      setBranches({
        branchOne: resOne,
        branchTwo: resTwo,
        branchThree: resThree,
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) return <p>Loading...</p>;

  if (error) {
    return <p>Error: {error}</p>;
  }

  //getting all the products across all branches or return empty array if there is no data inside the branches
  const allProducts = Object.keys(branches).flatMap((branchKey) => {
    const branch = branches[branchKey];
    if (!branch || !branch.products) return [];
    return branch.products.map((product) => ({
      name: product.name,
      revenue: product.unitPrice * product.sold,
    }));
  });

  //aggregate the revenue by product name
  const aggregatedProducts = {};

  for (const product of allProducts) {
    const productName = product.name;
    const productRevenue = product.revenue;

    if (!aggregatedProducts[productName]) {
      aggregatedProducts[productName] = { name: productName, revenue: 0 };
    }

    aggregatedProducts[productName].revenue += productRevenue;
  }

  //filter the table by search bar value and sort the names alphabetically using the collator
  const filteredProducts = Object.values(aggregatedProducts)
    .filter((product) =>
      product.name.toLowerCase().includes(searchValue.toLowerCase())
    )
    .sort((a, b) => collator.compare(a.name, b.name));

  //calculating the total revenue
  const totalRevenue = filteredProducts.reduce((sum, p) => sum + p.revenue, 0);

  return (
    <div className="product-list">
      <h1>Our Products</h1>
      <div className="search-div">
        <label htmlFor="search-bar">
          Search Products
          <input
            type="search"
            aria-description="search results will appear below"
            id="search-bar"
            placeholder="Search by product name..."
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            aria-describedby="search-description"
          />
        </label>
        <p id="search-description">Search results will appear below.</p>
      </div>

      <table>
        <thead>
          <tr>
            <th>Product</th>
            <th>Revenue</th>
          </tr>
        </thead>
        <tbody>
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product, index) => (
              <tr key={`${product}-${index}`}>
                <td>{product.name}</td>
                <td>{formatNumber(product.revenue)}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td>No products found.</td>
              <td>N/A</td>
            </tr>
          )}
        </tbody>
        <tfoot>
          <tr>
            <td>Total</td>
            <td>{formatNumber(totalRevenue)}</td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
}

export default App;
