const express = require('express');
const mongoose = require('mongoose');
const Product = require('./models/product');
const User = require('./models/user');
const Cart = require('./models/cart');
// express app
const app = express();

// listen for requests
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));

const dbURI =
    'mongodb+srv://AT:LETSdoMONGO0@nodetrials.vryil.mongodb.net/PharmaMan?retryWrites=true&w=majority';
mongoose
    .connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then((result) => {
        console.log('connected');
        app.listen(3000);
    })
    .catch((err) => console.log(err));

//Products Grouping

const products = [{
        src: '/product-1.jpg',
        name: 'CNF+ Tablets (120mg)',
        price: 50,
        rating: 5,
        desc: 'This is a very nice ointment cream. Which provides instant relief from stuff',
        type: 'pill',
    },
    {
        src: '/product-2.jpg',
        name: 'Amoxicillin',
        price: 10,
        rating: 2,
        desc: 'It can treat strep throat as well as childhood pneumonia, ear infections, and sinus infections, especially when used at high-dose levels',
        type: 'pill',
    },
    {
        src: '/product-3.jpg',
        name: 'Azithromycin',
        price: 5,
        rating: 5,
        desc: 'It is often prescribed for ear infections.',
        type: 'pill',
    },
    {
        src: '/product-4.jpg',
        name: 'Albuterol',
        price: 15,
        rating: 5,
        desc: 'The syrup form of albuterol is very rarely used by most pediatricians.',
        type: 'pill',
    },
    {
        src: '/product-5.jpg',
        name: 'Cefdinir',
        price: 16,
        rating: 5,
        desc: 'Omnicef (cefdinir) is a broad spectrum third-generation cephalosporin that is commonly used to treat sinus infections, ear infections, and pneumonia. Cefdinir is not usually considered to be a first-line treatment.',
        type: 'pill',
    },
    {
        src: '/product-6.jpg',
        name: 'Cephalexin',
        price: 7,
        rating: 3,
        desc: 'Keflex (cephalexin) is an antibiotic used to treat a range of bacterial infections, including strep throat, pneumonia, skin infections (cellulitis and impetigo), and bone and joint infections.',
        type: 'pill',
    },
    {
        src: '/product-7.jpg',
        name: 'Fluticasone',
        price: 15,
        rating: 4,
        desc: 'Fluticasone is a steroid that is the main ingredient in many different medications, including Flonase nasal spray (generic), Flovent MDI, Cutivate cream and ointment (generic), and Veramyst nasal spray.',
        type: 'pill',
    },
    {
        src: '/product-8.jpg',
        name: 'Prednisolone Sodium Phosphate',
        price: 30,
        rating: 5,
        desc: 'Available in both a 25 milligram/5 milliliter and 15 milligram/5 milliliter syrup, prednisolone is a liquid steroid that is commonly used to treat asthma flare-ups, poison ivy reactions, croup, and other corticosteroid-responsive disorders.',
        type: 'pill',
    },
    {
        src: '/product-9.jpg',
        name: 'Ibuprofen',
        price: 3,
        rating: 5,
        desc: 'Ibuprofen is a nonsteroidal anti-inflammatory drug (NSAID) that is commonly used to treat fever, pain, and inflammation in children.',
        type: 'pill',
    },
    {
        src: '/product-10.jpg',
        name: 'Singulair ',
        price: 13,
        rating: 5,
        desc: 'Singulair (montelukast sodium) is a leukotriene receptor antagonist and is approved to prevent and treat asthma, prevent exercise-induced asthma, and relieve symptoms of seasonal allergic rhinitis and perennial allergic rhinitis. ',
        type: 'pill',
    },
    {
        src: '/product-11.jpg',
        name: 'Trimethoprim',
        price: 10,
        rating: 5,
        desc: 'Bactrim or Septra (trimethoprim/sulfamethoxazole) is an older antibiotic that is most commonly used to treat urinary tract infections, except when resistance might be a problem.',
        type: 'pill',
    },
    {
        src: '/product-12.jpg',
        name: 'Vicodin',
        price: 15,
        rating: 5,
        desc: 'Under the brand names of Vicodin, Lortab, and Norco, hydrocodone bitartrate/acetaminophen is a narcotic pain reliever with Tylenol (acetaminophen). It is more potent than codeine.',
        type: 'pill',
    },
];
/*Product.insertMany(products)
    .then(function() {
        console.log('Data inserted'); // Success
    })
    .catch(function(error) {
        console.log(error); // Failure
    });*/
/*Product.deleteMany({ type: 'pill' })
	.then(function () {
		console.log('Data Deleted'); // Success
	})
	.catch(function (error) {
		console.log(error); // Failure
	});*/
//Routing
app.get('/', paginatedResults(Product), (req, res) => {
    var prod = res.paginatedResults.results;
    var rando = Math.floor(Math.random() * prod.length);
    var prod1 = prod[rando];
    var rando1 = Math.floor(Math.random() * (prod.length - 2));
    var prod2 = prod.slice(rando1, rando1 + 2);
    res.render('index', { title: 'Home', prod1, prod2 });
});

app.get('/about', (req, res) => {
    res.render('about', { title: 'About' });
});

app.get('/products', paginatedResults(Product), (req, res) => {
    var prod = res.paginatedResults.results;
    var search = res.paginatedResults.search;
    res.render('product', { title: 'Products', prod, search });
});
app.get('/products/:id', (req, res) => {
    const id = req.params.id;
    Product.findById(id)
        .then((result) => {
            res.render('product-details', {
                product: result,
                title: 'Product Details',
            });
        })
        .catch((err) => {
            console.log(err);
            res.render('404', { title: 'Product not found' });
        });
});
app.get('/account', (req, res) => {
    const loggedin = req.query.loggedin ;
    res.render('account', { title: 'Account', loggedin });
});

// Admin Pages
app.get('/admin/modify', (req, res) => {
    Product.find()
        .then((result) => {
            res.render('admin/modify', { title: 'Modify', products: result });
        })
        .catch((err) => {
            console.log(err);
        });
});

app.get('/admin/add', (req, res) => {
    res.render('admin/add', { title: 'Add New Products' });
});

app.post('/admin', (req, res) => {
    const product = new Product(req.body);
    //console.log(product);
    product
        .save()
        .then((result) => {
            res.redirect('/admin/modify');
        })
        .catch((err) => {
            console.log(err);
        });
});

app.get('/admin/:id', (req, res) => {
    const id = req.params.id;
    Product.findById(id)
        .then((result) => {
            res.render('admin/edit', { title: 'Edit your Meds', product: result });
        })
        .catch((err) => {
            console.log(err);
        });
});

app.post('/admin/edit/:id', (req, res) => {
    const id = req.params.id;
    const product = req.body;

    Product.findOne({ _id: id }, (err, foundObject) => {
        if (err) {
            console.log(err);
        } else {
            if (!foundObject) {
                res.status(404).render('404', { title: '404' });
            } else {
                foundObject.name = product.name;
                foundObject.price = product.price;
                foundObject.src = product.src;
                foundObject.desc = product.desc;
                foundObject.rating = product.rating;
                foundObject.type = product.type;

                foundObject.save((err, updateObject) => {
                    if (err) {
                        console.log(err);
                    } else {
                        res.redirect('/admin/modify');
                    }
                });
            }
        }
    });
});

app.delete('/admin/:id', (req, res) => {
    const id = req.params.id;
    console.log(id);
    Product.findByIdAndDelete(id)
        .then((result) => {
            res.json({ redirect: '/admin/modify' });
        })
        .catch((err) => {
            console.log(err);
        });
});


//Cart Routes
app.post('/cart/:id', (req, res) => {
    const id = req.params.id;
    //console.log(req.body);
    req.body.username = 'abc';
    req.body._productid = id;
    const cart = new Cart(req.body);
    //console.log(cart);
    cart
        .save()
        .then((result) => {
            res.redirect('/cart');
        })
        .catch((err) => {
            console.log(err);
        });
});

app.get('/cart', (req, res) => {
    //console.log('entered requsetes');
    /*Cart.find()
           .then((result) => {
               console.log('results' + result);
               res.render('cart', { title: 'Cart', result });
           })
           .catch((err) => {
               console.log(err);
           });*/
    Cart.find({})
        .populate('_productid') // only works if we pushed refs to person.eventsAttended
        .exec(function(err, products) {
            if (err) return handleError(err);
            //console.log('P' + products);
            res.render('cart', { title: 'Cart', products });
        });
});
app.get('/cart/delete', (req, res) => {
    const id = req.query.id;
    console.log(id);
    Cart.findByIdAndDelete(id)
        .then((result) => {
            res.redirect('/cart');
        })
        .catch((err) => {
            console.log(err);
        });
});

//Login Routes
app.post('/account/register', (req,res) => {
    if(!req.body.access){
        req.body.access = 'off' ;
    }
    const user = new User(req.body) ;

    user.
        save()
        .then((result) => {
            res.redirect('/');
        })
        .catch((err) => {
            console.log(err) ;
        })
})

app.post('/account/login', (req,res) => {
    const uname = req.body.username ;
    const paswd = req.body.password ;
    User.find({ username: uname})
        .then((result) => {
            const loggedin = 0 ;
            console.log(result) ; 
            if(result[0].password == paswd){
                console.log("Success") ;
                res.redirect('/');
            }
            else{
                res.redirect(`/account?${loggedin}`) ;
            }
        })
        .catch((err) => {
            console.log(err) ;
        })
})

// 404 page
app.use((req, res) => {
    res.status(404).render('404', { title: '404' });
});

/*function paginatedResults(model) {
    return async(req, res, next) => {
        var page;
        var limit;
        if (req.query.page == undefined && req.query.limit == undefined) {
            page = 1;
            limit = 8;
        } else {
            page = parseInt(req.query.page);
            limit = parseInt(req.query.limit);
        }
        //console.log(page + ' ' + limit);

        const startIndex = (page - 1) * limit;
        const endIndex = page * limit;
        const results = {};
        if (endIndex < (await model.countDocuments().exec())) {
            results.next = {
                page: page + 1,
                limit: limit,
            };
        }
        if (startIndex > 0) {
            results.previous = {
                page: page - 1,
                limit: limit,
            };
        }
        try {
            results.results = await model.find().limit(limit).skip(startIndex).exec();
            var products = results.results;
            const prod = [];
            var chunkSize = 4;
            for (let i = 0; i < products.length; i += chunkSize) {
                const chunk = products.slice(i, i + chunkSize);
                prod.push(chunk);
            }
            res.paginatedResults = prod;
            next();
        } catch (e) {
            res.status(500).json({ message: e.message });
        }
    };
}*/
function paginatedResults(model) {
    return async(req, res, next) => {
        var page;
        var limit;
        var search;
        var sorted = req.query.sort;
        var obj = {};
        obj[sorted] = 1;
        console.log(obj);
        console.log(sorted);
        if (req.query.page == undefined) {
            page = 1;
        } else {
            page = parseInt(req.query.page);
        }
        if (req.query.limit == undefined) limit = 8;
        else {
            limit = parseInt(req.query.limit);
        }
        if (req.query.search == undefined) req.query.search = '';
        else {
            search = req.query.search;
            console.log(search);
        }
        //console.log(page + ' ' + limit);

        const startIndex = (page - 1) * limit;
        const endIndex = page * limit;
        const results = {};

        if (endIndex < (await model.countDocuments().exec())) {
            results.next = {
                page: page + 1,
                limit: limit,
            };
        }
        if (startIndex > 0) {
            results.previous = {
                page: page - 1,
                limit: limit,
            };
        }
        try {
            if (req.query.search == undefined || req.query.search == '') {
                results.results = await model
                    .find()
                    .sort(obj)
                    .limit(limit)
                    .skip(startIndex)
                    .exec();
            } else {
                results.results = await model
                    .find({ name: search })
                    .sort(obj)
                    .limit(limit)
                    .skip(startIndex)
                    .exec();
            }
            var products = results.results;

            const prod = [];
            var chunkSize = 4;
            for (let i = 0; i < products.length; i += chunkSize) {
                const chunk = products.slice(i, i + chunkSize);
                prod.push(chunk);
            }
            results.results = prod;
            results.search = search;
            res.paginatedResults = results;
            next();
        } catch (e) {
            res.status(500).json({ message: e.message });
        }
    };
}