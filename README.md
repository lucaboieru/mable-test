&nbsp;  
&nbsp;  
&nbsp;  
&nbsp;  
&nbsp;  
![](http://i.imgur.com/lhH4nNN.png =253x)
&nbsp;  
&nbsp;  
You are given a simple REST API. You have to create a website that consumes this API.

This website should have 9 pages as described below:
  - A home page with a full screen carousel and a link to the product list view (Design provided by us)
  - A list view with all the products (sortable by price: ascending or descending) with 'add to cart' functionality (Design provided by us)
  - A detail view for each product which opens when you click on a product in the list view
  - A cart page which contains all products added to the cart from the list view or the detail view, with the functionality to place the order
  - A login page for the website manager
  - A list view for the admin with all the orders from the users containing all the relevant data and with links to all products in the order
  - A list view for the admin with all the products with quick actions: edit, delete
  - A page with an 'add new product' form.
  - A page with and 'edit product' form (precompleted) which opens when the edit button in the admin list view is clicked

For the pages where the design is provided by us you'll find `.psd`s in the `Design` folder. Make sure you follow the design as much as possible (colors, dimensions, fonts, font sizes etc). For the other pages you'll have to come up with the design based on what we provided, keeping the same style.

You will also have to make the whole website responsive for phones and tablets starting from the width of 320px.

When you are done create a github repo and push the code there then send us the link to the repo.

#### Good luck!
&nbsp;  
&nbsp;  
&nbsp;  
&nbsp;  
&nbsp;  
### API Endpoints

Below you'll have the API endpoints defined; replace <your-key> with the string you'll get in your email along with this file.

#### Authentication

##### Login
  Will set a cookie with the authorization token

- URL: 
  `http://<your-key>.test.mable.ro/api/login`
- Method:
  `POST`
-  URL Params
    `None`
- Data Params

    `username=[string]`
    
    `password=[string]`
    
    *default*:
    ``` JSON
    {
      "username": "manager",
      "password": "123456"
    }
    ```

- Success response:
  * Code: 200
  * Content:
 
    ``` JSON
    {
      "first_name": "Product",
      "last_name": "Manager",
      "username": "manager",
      "role": "manager",
      "_ts": "2016-09-28T15:46:49.941Z"
    }
    ```

##### Logout
  Will delete the cookie containing the authorization token

- URL: 
  `http://<your-key>.test.mable.ro/api/logout`
- Method:
  `POST`
-  URL Params
    `None`
- Data Params
    `None`
- Success response:
  * Code: 200
  * Content: `None`

#### Products

##### Show all products
  Returns json data with all the products.

- URL: 
  `http://<your-key>.test.mable.ro/api/products`
- Method:
  `GET`
-  URL Params
    `None`
-  Query Params

    `sort` which can be `price_asc` or `price_desc` or not defined when products are needed in the order of creation
- Data Params
    `None`
- Success response:
  * Code: 200
  * Content:

    ``` JSON
    [
        {
            "_id": "57e7c6a09b1c9a65133022ad",
            "title": "Beer Camp",
            "description": "Lorem ipsum",
            "image": "http://<your-key>.test.mable.ro/uploads/b5c9b3250f311d1a9d88158dd453fc74.jpg",
            "price": 10.99
        },
        ...
    ]
    ```

##### Show one product
  Returns json data with one product.

- URL: 
  `http://<your-key>.test.mable.ro/api/products/:_id`
- Method:
  `GET`
- URL Params: 

   `_id=[String]` (required)
- URL Params: 
   `none`
- Success response:
  * Code: 200
  * Content:

    ``` JSON
    {
        "_id": "57e7c6a09b1c9a65133022ad",
        "title": "Beer Camp",
        "description": "Lorem ipsum",
        "image": "http://<your-key>.test.mable.ro/uploads/b5c9b3250f311d1a9d88158dd453fc74.jpg",
        "price": 10.99
    }
    ```

##### Create product
  Returns json data with the new product.

- URL: 
  `http://<your-key>.test.mable.ro/api/products`
- Method:
  `POST`
- Data Params

    `title=[string]` (required)
    
    `description=[string]` (required)
    
    `price=[number]` (required)
    
    `image=[form-data]` (required)
    
    must be sent using `multipart/form-data`
- Success response:
  * Code: 200
  * Content:

    ``` JSON
    {
        "_id": "57e7c6a09b1c9a65133022ad",
        "title": "Beer Camp",
        "description": "Lorem ipsum",
        "image": "http://<your-key>.test.mable.ro/uploads/b5c9b3250f311d1a9d88158dd453fc74.jpg",
        "price": 10.99
    }
    ```

##### Update product
  Returns json data with the updated product.

- URL: 
  `http://<your-key>.test.mable.ro/api/products/:_id`
- Method:
  `PUT`
- URL params: `_id=[String]` (required)
- Data Params

    `title=[string]` (required)
    
    `description=[string]` (required)
    
    `price=[number]` (required)
    
    `image=[form-data]` (required)
- Success response:
  * Code: 200
  * Content:

    ``` JSON
    {
        "_id": "57e7c6a09b1c9a65133022ad",
        "title": "Beer Camp",
        "description": "Lorem ipsum",
        "image": "http://<your-key>.test.mable.ro/uploads/b5c9b3250f311d1a9d88158dd453fc74.jpg",
        "price": 10.99
    }
    ```

##### Delete product
  Deletes a project

- URL: 
  `http://<your-key>.test.mable.ro/api/products/:_id`
- Method:
  `DELETE`
- URL params: `_id=[String]` (required)
- Data Params
 `None`
- Success response:
  * Code: 200
  * Content: `None`

#### Orders

##### Create order
Creates a new order

- URL: 
  `http://<your-key>.test.mable.ro/api/orders`
- Method:
  `POST`
- Data Params

    `description=[string]` (required)
    
    `products=[array]` (required) - an array of product IDs
    
    *default*:
    ``` JSON
    {
      "description": "Some order",
      "products": [
        "57ebe1bd21ceb2c4711a3511",
        "57ebe1bd21ceb2c4711a3512"
      ]
    }
    ```
    
- Success response:
  * Code: 200
  * Content:

    ``` JSON
    {
        "_id": "57ebe3873c3639c481e92e4d",
        "description": "Some order",
        "products": [
            {
                "_id": "57ebe1bd21ceb2c4711a3511",
                "title": "Some product",
                "price": 10.9,
                "description": "Some product Description",
                "image": "http://<your-key>.test.mable.ro/uploads/b5c9b3250f311d1a9d88158dd453fc74.jpg"
            }
          ...
        ]
    }
    ```

##### Show all orders
  Returns json data with all the orders.

- URL: 
  `http://<your-key>.test.mable.ro/api/orders`
- Method:
  `GET`
-  URL Params
    `None`
- Data Params
    `None`
- Success response:
  * Code: 200
  * Content:
 
    ``` JSON
    [
        {
            "_id": "57ebe3873c3639c481e92e4d",
            "description": "Some order",
            "products": [
                {
                    "_id": "57ebe1bd21ceb2c4711a3511",
                    "title": "Some product",
                    "price": 10.9,
                    "description": "Some product Description",
                    "image": "http://<your-key>.test.mable.ro/uploads/b5c9b3250f311d1a9d88158dd453fc74.jpg"
                }
              ...
            ]
        }
        ...
    ]
    ```
