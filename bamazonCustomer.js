//npm i
var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
    host: "localhost",

    // Your port; if not 3306
    port: 3306,

    // Your username
    user: "root",

    // Your password
    password: "password",

    database: "bamazon"
});

connection.connect(function (err) {
    if (err) throw err;
    productPost();

});

function productPost() {
    connection.query("SELECT * FROM products", function (err, res) {
        console.log("********BAMAZON************");
        console.log("-----------------------");
        for (var i = 0; i < res.length; i++) { //prints out all the items for mysql
            console.log('Item Number: ' + res[i].item_id + '\nName: ' + res[i].itemName + '\nDepartment: ' + res[i].department_name + '\nPrice: $' + res[i].price + '\nQuantity: ' + res[i].stock_quantity + '\n----------------------------------------')

        };
        selectItem();
    });
};

function selectItem() { //inquirer
    inquirer.prompt([{
            name: "itemNum",
            type: "input",
            message: "Enter the item number you would like to purchase: ",
        },
        {
            name: "itemQuan",
            type: "input",
            message: "How many would you like to purchase: "
        }
    ]).then(function (itemPicked) {
        connection.query("SELECT * FROM products WHERE item_id = ?", [itemPicked.itemNum], function (err, res) { //will go to the item number entered
            if (err) throw err;
            for (var i = 0; i < res.length; i++) {
                var numQuan = parseInt(itemPicked.itemQuan);
                var total = itemPicked.itemQuan * res[i].price;
                var itemName = res[i].itemName;
                var itemUpdate = res[i].stock_quantity - numQuan;
                if (numQuan > res[i].stock_quantity) {//will print out if not enough in stock
                    console.log("Insufficient quantity!");
                    connection.end();
                } else {//continue purchase

                    console.log("Item chosen: " + itemName);
                    sqlUpdate(itemPicked.itemNum, itemUpdate);
                    console.log("There is " + itemUpdate + " " + itemName + " left");
                }

                function sqlUpdate(target_item, itemUpdate) {

                    connection.query("UPDATE products SET ? WHERE ?",
                        [{
                                stock_quantity: itemUpdate
                            },
                            {
                                item_id: target_item
                            }
                        ],
                        function (err, res) {
                            if (err) throw err;
                            console.log("Inventory updated");
                            connection.end();
                            console.log("Total purchase $" + total)

                        });
                }
            }


        });
    })

};