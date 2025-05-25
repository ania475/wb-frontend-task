import { useEffect, useState } from "react";

const formatNumber = (number) =>
  new Intl.NumberFormat("en", { minimumFractionDigits: 2 }).format(number);

const collator = new Intl.Collator(); //declaring a collator for product name comparison

function App() {
  const [branches, setBranches] = useState({
    branchOne: null,
    branchTwo: null,
    branchThree: null,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [searchValue, setSearchValue] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [resOne, resTwo, resThree] = await Promise.all([
        //fetching data from all three branches
        fetch(`api/branch1.json`).then((res) => res.json()),
        fetch(`api/branch2.json`).then((res) => res.json()),
        fetch(`api/branch3.json`).then((res) => res.json()),
      ]);

      setBranches({
        //storing the response in the branches state variable per branch
        branchOne: resOne,
        branchTwo: resTwo,
        branchThree: resThree,
      });
    } catch (err) {
      setError(err.message);
      throw new Error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p>Loading...</p>; //display loading text

  if (error) {
    return <p>Error: {error}</p>; //if there is an error, display its message on the screen
  }

  const allProducts = ["branchOne", "branchTwo", "branchThree"].flatMap(
    (branchKey) => {
      const branch = branches[branchKey];
      if (!branch || !branch.products) return []; //if there is no branch name or products inside the branch, return an empty array
      return branch.products.map((product) => ({
        name: product.name,
        revenue: product.unitPrice * product.sold,
      }));
    }
  );

  //aggregate the revenue by product name
  const aggregatedProducts = Object.values(
    allProducts.reduce((acc, product) => {
      const name = product.name;
      if (!acc[name]) {
        acc[name] = { name, revenue: 0 }; //if there is not already a product with this name, initialising an entry in the accumulator with the revenue of 0
      }
      acc[name].revenue += product.revenue; //adding the product revenue to the total revenue for this name
      return acc;
    }, {})
  );

  //filter the table by search bar value
  const filteredProducts = aggregatedProducts
    .filter((product) =>
      product.name.toLowerCase().includes(searchValue.toLowerCase())
    )
    .sort((a, b) => collator.compare(a.name, b.name)); //sort the names alphabetically by using the collator to compare the product names

  //calculating the total revenue by adding the previously calculated sum with product revenue
  const totalRevenue = filteredProducts.reduce((sum, p) => sum + p.revenue, 0);

  return (
    <div className="product-list">
      <h1>Our Products</h1>
      <div className="search-div">
        <label htmlFor="search-bar" aria-hidden="true">
          Search Products
        </label>
        <input
          type="search"
          aria-description="search results will appear below"
          id="search-bar"
          placeholder="Search by product name..."
          aria-label="Search Products"
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          aria-describedby="search-description"
        />
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
              <tr key={index}>
                <td>{product.name}</td>
                <td>{formatNumber(product.revenue)}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="2">No products found.</td>
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
