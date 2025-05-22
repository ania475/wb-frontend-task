# Supermarket revenue aggregator component

You are creating a supermarket branch revenue aggregator. It's a React-based web application which displays a list of products from multiple supermarket branches in a table that is sorted, filterable and displays the total revenue from all branches.

## Setup

To get started:

1. `npm i` – install the dependencies
2. `npm test` – run all tests in watch mode (the tests will fail until you implement the app)
3. `npm start` – view the app running at [http://localhost:3000/](http://localhost:3000/)

# Tasks

- Request the data from 'api/branch{1, 2, 3}.json' and render it inside the table, where each row contains two columns: product name and total revenue from sales of the product.
- Branches may sell the same products, so you need to aggregate (sum) the revenue per branch
- The table should be sorted alphabetically by product name
- The table can be filtered by product name, the filter should be case insensitive
- At the bottom of the table the total revenue is shown for all the products that are displayed, i.e. if you filter the table, the total needs to update
- You should use the provided `formatNumber` function to display numbers
- You need to get all of the tests passing
- Make sure Search input is inline with the label and working, could this be more accessible?

# Notes

- You don't need to make branch data loading dynamic, you can hardcode the json names
- You don't need to display partial data, you can wait for all data to load first
- Make sure you are happy with the complete solution and it's done to the best of your ability
- The app only needs to work on the latest version Chrome
