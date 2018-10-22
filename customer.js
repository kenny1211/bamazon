const mysql = require("mysql");
const inquirer = require("inquirer");
const table = require("easy-table");

const connection = mysql.createConnection({
  host: "localhost",
  port: "3306",
  user: "root",
  password: "password",
  database: "products_db"
});

connection.connect((err) => {
  if (err) throw err;
  
  open();
});

const open = () => {
  console.log("======\nWelcome to Bamazon\nOur products are listed below. Please follow the prompts to make a purchase.\n======");
  start();
}

const start = () => {
  connection.query("SELECT * FROM products", (err, res) => {
    if (err) throw err;
    console.log(table.print(res));

    query();
  });
}

const query = () => {
  connection.query("SELECT * FROM products", (err, res) => {
    if (err) throw err;

    inquirer.prompt([
      {
        name: "productPick",
        type: "list",
        choices: () => {
          const options = [];
          for (let i = 0; i < res.length; i++) {
            options.push(res[i].product);
          } return options;
        },
        message: "Which product would you like to purchase?"
      },
      {
        name: "quantity",
        type: "input",
        message: "How many of the chosen product would you like to buy?",
        validate: (value) => {
          if (isNaN(value)) {
            return false;
          } else {
            return true;
          }
        }
      }
    ]).then(response => {
      let userProduct = "";

      for (let i = 0; i < res.length; i++) {
        if (res[i].product === response.productPick) {
          userProduct = res[i];
        }
      }

      if (userProduct.stock >= parseInt(response.quantity)) {
        let newStock = userProduct.stock - parseInt(response.quantity);
        let total = parseInt(response.quantity) * userProduct.price;

        connection.query("UPDATE products SET ? WHERE ?", 
        [{stock: newStock}, {id: userProduct.id}],
        (err) => {
          console.log(`======\nOrder Complete \nTotal: $${total}\n======`);
          start();
        });
      } 
      else {
        console.log("=====\nSorry we do not have enough in stock for your order. Please try again.\n=====");
        query();
      }
    });
  });
}

