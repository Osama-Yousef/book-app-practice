// requierment

require('dotenv').config();

// application dependencies ( getting the libraries)

const express = require('express');
const pg = require('pg');
const superagent = require('superagent');
const cors = require('cors');
const methodOverRide = require('method-override') 

//main variables( application setup)


const PORT = process.env.PORT || 3030;
const app = express();
const client = new pg.Client(process.env.DATABASE_URL);

// uses
app.use(express.static('./public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.use(methodOverRide('_method')) 
app.use(cors());
// app.use(errorHandler);
// app.use('*',notFoundHandler);

// listen to port 

client.connect()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Listening on PORT ${PORT}`)
    })
  }) 

  //////////////////////////////////////////////
  
// // check

// app.get
// ('/',homeHandler);
// function homeHandler(req,res){
//     res.status(200).send('it works');
// }
////////////////////////////////////////////////
// route definition

app.get('/',homeHandler);

app.get('/search',searchHandler);

app.post('/addToDb',addToDbHandler);

app.get('/selectData',selectDataHandler);

app.get('/details/:book_id',detailsHandler);

app.put('/update/:update_id',updateHandler); 

app.delete('/delete/:delete_id',deleteHandler); 

// route handlers 

function homeHandler(req,res){


res.render('index');

}
  
////////////////////////////////

function searchHandler(req,res){

let title=req.query.title;
let type=req.query.radio;

let url =`https://www.googleapis.com/books/v1/volumes?q=${title}+in${type}:${title}`;

// let url=`https://www.googleapis.com/books/v1/volumes?q=${title}+${type}` ;

superagent.get(url).then(data=>{

let booksArray=data.body.items.map(val=>{

return new Books(val);

})

res.render('pages/result',{data: booksArray});
})

}

///////////////////////////////////////////////////////////

// constructor function 

function Books(val){

    this.title=val.volumeInfo.title || 'No book with this title' ;
    this.author=val.volumeInfo.authors[0] || 'No books for this author';
    this.isbn=val.volumeInfo.industryIdentifiers[0].identifier + val.volumeInfo.industryIdentifiers[0].type || '000000';
    this.description=val.volumeInfo.description || '.....' ;
    this.image=val.volumeInfo.imageLinks.smallThumbnail || 'https://www.freeiconspng.com/uploads/book-icon--icon-search-engine-6.png' ;

}
//////////////////////////////////////////////////////////////////


function addToDbHandler(req,res){

let {title,author,description,isbn,bookshelf,image}=req.body;

let sql=`INSERT INTO bookstable (title,author,description,isbn,bookshelf,image) VALUES ($1,$2,$3,$4,$5,$6) ;`;

let safeValues=[ title,author,description,isbn,bookshelf,image ];

client.query(sql,safeValues).then(()=>{

res.redirect('/selectData');


})

}

////////////////////////////////////////////////////////////////

function selectDataHandler(req,res){

let sql=`SELECT * FROM bookstable ;` ;

client.query(sql).then(result=>{

    res.render('pages/favorite',{data: result.rows});
    
    
    })

}

/////////////////////////////////////////////////////


function detailsHandler(req,res){

let param=req.params.book_id;

let sql=`SELECT * FROM bookstable WHERE id=$1 ;`;

let safeValues=[param] ;

client.query(sql,safeValues).then(result=>{

    res.render('pages/details',{data: result.rows[0]});
    
    
    })



}


///////////////////////////////////////////////////////////////


function updateHandler(req,res){

    let param=req.params.update_id;

    let {title,author,description,isbn,bookshelf,image}=req.body;


    let sql=`UPDATE bookstable SET title=$1,author=$2,description=$3,isbn=$4,bookshelf=$5,image=$6 WHERE id=$7 ;`;

let safeValues=[title,author,description,isbn,bookshelf,image,param] ;


client.query(sql,safeValues).then(()=>{

    res.redirect(`/details/${param}`);
  
    })

}

//////////////////////////////////////////////


function deleteHandler(req,res){

    let param=req.params.delete_id;



    let sql=`DELETE FROM bookstable  WHERE id=$1 ;`;

let safeValues=[param] ;


client.query(sql,safeValues).then(()=>{

    res.redirect('/selectData');
  
    })

}


////////////////////////////////////////////////







































// //========================================\\
// //error handlers


// function errorHandler(err, req, res) {
//     res.status(500).send(err);
//   }
  
//   //========================================\\
  
  
//   function notFoundHandler(req, res) {
//     res.status(404).send('page not found!!'); 
//   }
  
//   //========================================\\