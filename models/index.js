const bookshelf = require('../bookshelf')
//by right, if we require a folder, nodejs will look for index.js


//a bookshelf Model represents one table
//the name of the model (the first arg)
//must be the SINGULAR form of the table name
//and the first letter must be UPPERCASE
const Product = bookshelf.model('Product', {
    tableName:'products'
});

const Category = bookshelf.model('Category', {
    tableName: 'Categories',
    //the name od a function for a has many relationship should be the plural form of the corresponding model in a plural form
    category: function(){return this.hasMany('Product')}
})

const User = bookshelf.model('User',{
    tableName: 'users'
})

module.exports = { Product, Category, User };