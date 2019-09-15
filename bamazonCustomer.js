// let keys = require("./pass.js");
let mysql = require('mysql');
let inquirer = require('inquirer');

let connection = mysql.createConnection({
    host: "localhost",

    // Your port; if not 3306
    port: 3306,

    // Your username
    user: "root",

    // Your password
    password: "password",
    // database: "greatBay_DB"
    database: "bamazon"
});

connection.connect(function (err) {
    if (err) throw err;
    // console.log("connected as id " + connection.threadId + "\n");
});

function exit() {
    connection.end();
    console.log("Thank you for visiting GreatBay!");
}

function bid() {
    connection.query('SELECT * FROM auctions', (err, res) => {
        if (err) throw err;
        let itemForSale = [];
        let idForSale = [];
        res.forEach(function (i) {
            console.log("ID: " + i.id + " | " + "Item: " + i.item_name + " | " + "Current Bid: " + i.highest_bid);
            console.log("-----------------------------------");
            itemForSale.push(i.item_name);
            idForSale.push(i);
        });
        inquirer.prompt([{
            name: "choice",
            type: 'list',
            message: "What would you like to bid on?",
            choices: itemForSale
        }, {
            type: "input",
            name: "bid",
            message: "How much do you want to bid?"
        }]).then(answers => {
            let index = itemForSale.indexOf(answers.choice);
            parseInt(answers.bid) > parseInt(idForSale[index].highest_bid) ? (console.log("You are the highest bidder"), updatePrice(answers.bid, answers.choice)) : console.log("You didn't bid high enough");
        });
    });
}

function updatePrice(bid,name){
    connection.query("UPDATE auctions SET ? WHERE ?",[{
        highest_bid: bid
    },{
        item_name:name
    }],function(err, res) {
        if (err) throw err;
        console.log(res.affectedRows + " products updated!\n");
        // Call deleteProduct AFTER the UPDATE completes
        mainMenu();
      }
    );
}

function postItem() {
    inquirer
        .prompt([{
            type: "input",
            message: "What is your item called?",
            name: "itemName"
        },
        {
            type: "input",
            message: "What category does it fall in?",
            name: "categoryName"
        },
        {
            type: "input",
            message: "How much is your item?",
            name: "startingBid"
        }
        ])
        .then(answer => {
            connection.query("INSERT INTO auctions SET ?",
                {
                    item_name: answer.itemName,
                    category: answer.categoryName,
                    starting_bid: answer.startingBid,
                    highest_bid: answer.startingBid
                },
                function (err, res) {
                    if (err) throw err;
                    console.log("Success!!");
                    mainMenu();
                });
        });
}

function mainMenu() {
    inquirer.prompt([{
        type: "input",
        name: "username",
        message: "Please enter your username."
    },
    {
        type: "password",
        name: "password",
        message: "Please enter your password."
    }, {
        type: "list",
        choices: ["POST", "BID", "EXIT"],
        message: "What would you like to do?",
        name: 'choice'
    }]).then(answers => {
        switch (answers.choice) {
            case 'POST':
                postItem();
                break;
            case 'BID':
                bid();
                break;
            case 'EXIT':
                exit();
                break;
            default:
                console.log("??");
        }
    });
}


//When app first loads call mainMenu
mainMenu();