const formatNumber = (number) =>
  new Intl.NumberFormat('en', { minimumFractionDigits: 2 }).format(number);

function App() {
  return (
    <div className="product-list">
      <label>Search Products</label>
      <input type="text" />

      <table>
        <thead>
          <tr>
            <th>Product</th>
            <th>Revenue</th>
          </tr>
        </thead>
        <tbody></tbody>
        <tfoot>
          <tr>
            <td>Total</td>
            <td></td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
}

export default App;
