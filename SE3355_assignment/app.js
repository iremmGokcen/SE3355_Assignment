const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const { Database } = require('sqlite3');

const app = express();
const PORT = 3000;


const db = new sqlite3.Database('./data/database.db', (err) => {
    if (err) {
        console.error('SQLite connection unsuccess:', err.message);
    } else {
        console.log('SQLite connection success.');
    }
});



const calculateCategories = (products) => {
    const categories = {};
    products.forEach(product => {
        categories[product.category] = (categories[product.category] || 0) + 1;
    });
    return categories;
};


app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'ejs');


app.get('/', (req, res) => {
    const query = `SELECT * FROM Products` ;
    db.all(query, [], (err, products) => {
        if (err) {
            res.status(500).send('Veritabanı hatası.');
        } else {
            const categories = calculateCategories(products);
            res.render('home', { products, categories });
        }
    });
});


app.get('/search', (req, res) => {
    const keyword = req.query.q || '';
    const query = `
        SELECT * FROM Products 
        WHERE ad_no LIKE ? OR description LIKE ? OR city LIKE ? OR category LIKE ? OR price LIKE ?
    `;
    const params = [`%${keyword}%`, `%${keyword}%`, `%${keyword}%`, `%${keyword}%`, `%${keyword}%`];

    db.all(query, params, (err, rows) => {
        if (err) {
            console.error('Veritabanı sorgusu hatası:', err.message);
            res.status(500).send('Veritabanı hatası');
        } else {
            // Yalnızca eşleşen kategorileri hesapla
            const categories = rows.reduce((acc, product) => {
                acc[product.category] = (acc[product.category] || 0) + 1;
                return acc;
            }, {});

            res.render('search', { results: rows, keyword, categories });
        }
    });
});



app.get('/search-live', (req, res) => {
    const searchTerm = `%${req.query.q}%`; 
    const query = `
        SELECT * FROM Products 
        WHERE description LIKE ? OR city LIKE ? OR category LIKE ? 
    `;
    db.all(query, [searchTerm, searchTerm, searchTerm], (err, rows) => {
        if (err) {
            console.error('Veritabanı hatası:', err.message);
            res.status(500).json({ error: 'Veritabanı hatası' });
        } else {
            res.json(rows); 
        }
    });
});



app.get('/product/:id', (req, res) => {
    const query = 'SELECT * FROM products WHERE id = ?';
    db.get(query, [req.params.id], (err, row) => {
        if (err) {
            console.error('Veritabanı sorgusu hatası:', err.message);
            res.status(500).send('Veritabanı hatası');
        } else {
            res.render('detail', { product: row }); 
        }
    });
});

app.get('/category/:category', (req, res) => {
    const category = req.params.category; 
    const query = 'SELECT * FROM Products WHERE category = ?';

    db.all(query, [category], (err, rows) => {
        if (err) {
            console.error('Veritabanı hatası:', err.message);
            res.status(500).send('Veritabanı hatası');
        } else {
            
            const categories = calculateCategories(rows); 
            res.render('home', { products: rows, categories });
        }
    });
});



app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
