const express = require('express');
// const { appendFile } = require('fs');
const router = express.Router()

//import in the prodi=uct model

const {Product, Category} = require('../models');
const { bootstrapField, createProductForm } = require('../forms');

router.get('/', async (req,res) => {
    //2 fetch all the products that is being updated
    let products = await Product.collection().fetch();
    res.render('products/index',{
        'products': products.toJSON() //3-convert collection to json
    })
})

router.get('/:product_id/update', async function(req,res){
    //1. get the product that is being updated
    //select * from products where product_id= ,req.params.product_id>
    const product = await Product.where({
        'id': req.params.product_id,
    }).fetch({
        require: true 
    })
    //2. create the form to update the product
    const productForm = createProductForm();
    //3. fill the form with the previous values of the product
    productForm.fields.name.value = product.get('name');
    productForm.fields.cost.value = product.get('cost');
    productForm.fields.description.value = product.get('description');

    res.render('products/update',{
        'form' : productForm.toHTML(bootstrapField),
        'product': product.toJSON
    })
})

router.get('/create', async (req, res) => {

    const categories = await Category.fetchAll().map(category =>{
        return categories.get('id'),category.get('name')
    })

    const productForm = createProductForm();
    res.render('products/create',{
        'form': productForm.toHTML(bootstrapField)
    })
})

router.post('/create', async(req,res)=>{
    const productForm = createProductForm();
    productForm.handle(req, {
        'success': async (form) => {
            const product = new Product();
            product.set('name', form.data.name);
            product.set('cost', form.data.cost);
            product.set('description', form.data.description);
            await product.save();
            req.flash("success_messages", `New product ${product.get('name')} has been created`)
            res.redirect('/products');

        },
        'error': async (form) => {
            res.render('products/create', {
                'form': form.toHTML(bootstrapField)
            })
        }
    })
})

// router.post('/:product_id/update', async(req,res) =>{
//     const productForm = createProductForm();
//     //handle function wil run the validation on data
//     productForm.handle(req,{
//         'success': async function(form) {
//             // product.set('name', form.data.name);
//             // product.set('description', form.data.name);
//             product.set(form.data) // all keys in form.data object must be a column name in the table
//             await product.save();
//             res.redirect('/products')
//         }

//         //update products set name=?,description=?...
//     },
//     {
//         'error' : async function(form){
//             res.render('products/update',{
//                 'product': product.toJSON(),
//                 'form': form.toHTML(bootstrapField)
//             })
//         }
//     },'empty': async function(form) {
//         res.render('products/update',{
//             'product': product.toJSON(),
//             'form': form.toHTML(bootstrapField)
//         }
        
//     )
// })

router.post('/:product_id/update', async function(req,res){
    const productForm = createProductForm();

    const product = await Product.where({
        'id': req.params.product_id
    }).fetch({
        require: true  // if not found will cause an exception (aka an error)
    })

    // handle function will run the validation on the data
    productForm.handle(req, {
        'success':async function(form) {
            // the form arguments contain whatever the user has typed into the form
            // update products set name=?, cost=?, description=? where product_id=?
            // product.set('name', form.data.name);
            // product.set('description', form.data.description);
            // product.set('cost', form.data.cost);
            product.set(form.data);  // for the shortcut to work,
                                     // all the keys in form.data object
                                    // must be a column name in the table
            await product.save();
            res.redirect('/products')
        },
        'error': async function(form) {
            res.render('products/update',{
                'product': product.toJSON(),
                'form': form.toHTML(bootstrapField)
            })
        },
        'empty': async function(form) {
            res.render('products/update',{
                'product': product.toJSON(),
                'form': form.toHTML(bootstrapField)
            })
        }
    })
})

router.get('/:product_id/delete', async function(req,res){
    const product = await Product.where({
        'id': req.params.product_id
    }).fetch({
        'require': true
    })
    res.render('products/delete',{
        'product': product.toJSON()
    })
})

router.post('/:product_id/delete', async function(req,res){
    const product = await Product.where({
        id: req.params.product_id
    }).fetch({
        require: true
    })

    await product.destroy();
    res.redirect('/products')
})

// router.get('/', function(req,res){
//     res.send('list all products')
// })

// router.get('/create', function(req,res){
//     res.send('create product')
// })

module.exports = router;
