const { ObjectId } = require('mongodb');
const fs=require('fs')
const path=require('path')
const db=require('../database/database')
const bcrypt = require('bcryptjs');
const session = require('express-session');
const express=require('express')
const router=express.Router();

router.get('/products',async function(req,res){
    let user=req.session.user;
    if(!user){
        user={
            id:''
        }
    }
            const allProducts=await db.getDb().collection('products').find({}).toArray();
            const addToCartCount=await db.getDb().collection('checkAddedProduct').find({userId:user.id}).toArray();
            const userLikedCount=await db.getDb().collection('checkAddedHeart').find({userId:user.id}).toArray();   
            const checkAddedProductOrNot=await db.getDb().collection('checkAddedProduct').find({userId:user.id}).toArray();
            const checkHeartAddedOrNot=await db.getDb().collection('checkAddedHeart').find({userId:user.id}).toArray();
            if(!checkAddedProductOrNot)
                {
                    checkAddedProductOrNot={
                        addToCart:false
                    }
                }
                if(!checkHeartAddedOrNot)
                    {
                        checkHeartAddedOrNot={
                            isLiked:false
                        }
                    }
           return res.render('products',{checkHeartAddedOrNot:checkHeartAddedOrNot,checkAddedProductOrNot:checkAddedProductOrNot, allProducts : allProducts,likedCount:userLikedCount,addToCartCount:addToCartCount});
                            
})

router.post('/login',async function(req,res){
    const email=req.body.email;
    const password=req.body.createPassword;
    const dataTable=await db.getDb().collection('userLoginTable').findOne({email:email});
    console.log(dataTable)
    let hashedPassword=bcrypt.compareSync(password,dataTable.createPassword); // true
    console.log(hashedPassword)
    if(dataTable && hashedPassword)
        {
                    req.session.user={id:dataTable._id,email:dataTable.email,fullNameSignUp:dataTable.fullNameSignUp}
                    req.session.isAuthenticated=true;
                    req.session.save(function(){
                        return res.json({message:'Password matched user is authorised',icon:'success',title:'Success!'})    
                    })
                }
                 else if(!hashedPassword)
                 {
                    console.log('password does not match')
                    return res.json({message:'Password does not match',icon:'error',title:'Something went Wrong!'});
                 }        
                 else{
                   return res.json({message:'Email does not Exist : Please check the email and try again',icon:'error',title:'Something went Wrong!'});
                 }
})

router.post('/adminLogin',async function(req,res){
    const email=req.body.email;
    const password=req.body.password;
    // console.log(email,password)
    const dataTable=await db.getDb().collection('adminTable').findOne({email:email});
    const dataPassword=await db.getDb().collection('adminTable').findOne({password:password})
    console.log(dataTable)
    // let hashedPassword=bcrypt.compareSync(password,dataTable.createPassword);
    // console.log(hashedPassword)
    if(dataTable && dataPassword)
        {
                    req.session.user={id:dataTable._id,email:dataTable.email}
                    req.session.isAuthenticated=true;
                    req.session.isAdmin=true;
                    req.session.save(function(){
                        return res.json({message:'Password matched admin is authorised',icon:'success',title:'Success!'})    
                    })
                }
                 else if(!hashedPassword)
                 {
                    console.log('password does not match')
                    return res.json({message:'Password does not match',icon:'error',title:'Something went Wrong!'});
                 }        
                 else{
                   return res.json({message:'Email does not Exist : Please check the email and try again',icon:'error',title:'Something went Wrong!'});
                 }
})

router.post('/newUserSignIn',async function(req,res){
    const existingUser=await db.getDb().collection('userLoginTable').findOne({email:req.body.email});
    if(existingUser)
        {
            return res.json({message:'Email Already Exists : Please try using some other mail',icon:'error',title:'Something went Wrong!'});
        }
        console.log('new User entered')
        let password=req.body.createPassword;
        let hash = bcrypt.hashSync(password, 10);
        req.body.createPassword=hash;
        const data=req.body;
        await db.getDb().collection('userLoginTable').insertOne(data);
        const newlyAddedData=await db.getDb().collection('userLoginTable').findOne({createPassword:`${hash}`})
        // console.log(newlyAddedData)
        req.session.user={id:newlyAddedData._id,email:newlyAddedData.email,fullNameSignUp:newlyAddedData.fullNameSignUp}
        req.session.isAuthenticated=true;
        req.session.save(function(){
            return res.json({message:'User Added Succefully',icon:'success',title:'Success!'})    
        })
})


router.get('/logout',async function(req,res){
    req.session.user=null;
    req.session.isAuthenticated=false;
    req.session.save(function(){
        res.redirect('products');
    })
})

router.post('/searchedItems',async function(req,res){
   let user=req.session.user;
    const incomingData=req.body.search;
    console.log(incomingData)
    if(!user){
        user={
            id:''
        }
    }

    let product = incomingData.toLowerCase();
    const response = await db.getDb().collection('products').find({}).toArray();
    const finalSearchedArray=[]
    for(let x of response){
        if(x.ProductHeading.toLowerCase().includes(product)){
            finalSearchedArray.push(x)
        }
    }
    const checkAddedProductOrNot=await db.getDb().collection('checkAddedProduct').find({userId:user.id}).toArray();
    const checkHeartAddedOrNot=await db.getDb().collection('checkAddedHeart').find({userId:user.id}).toArray();
    if(!checkAddedProductOrNot)
        {
            checkAddedProductOrNot={
                addToCart:false
            }
        }
        if(!checkHeartAddedOrNot)
            {
                checkHeartAddedOrNot={
                    isLiked:false
                }
            }
    const addToCartCount=await db.getDb().collection('checkAddedProduct').find({userId:user.id}).toArray();
    const userLikedCount=await db.getDb().collection('checkAddedHeart').find({userId:user.id}).toArray();    
    res.render('search',{checkHeartAddedOrNot:checkHeartAddedOrNot,checkAddedProductOrNot:checkAddedProductOrNot, allProducts : finalSearchedArray,likedCount:userLikedCount,addToCartCount:addToCartCount});
})

router.get('/shop',async function(req,res){
    let user=req.session.user;
    if(!user){
        user={
            id:''
        }
    }

    const allProducts=await db.getDb().collection('products').find({}).toArray();

    const checkAddedProductOrNot=await db.getDb().collection('checkAddedProduct').find({userId:user.id}).toArray();
    const checkHeartAddedOrNot=await db.getDb().collection('checkAddedHeart').find({userId:user.id}).toArray();
    if(!checkAddedProductOrNot)
        {
            checkAddedProductOrNot={
                addToCart:false
            }
        }
        if(!checkHeartAddedOrNot)
            {
                checkHeartAddedOrNot={
                    isLiked:false
                }
            }
    const addToCartCount=await db.getDb().collection('checkAddedProduct').find({userId:user.id}).toArray();
    const userLikedCount=await db.getDb().collection('checkAddedHeart').find({userId:user.id}).toArray();    
    res.render('shop',{checkHeartAddedOrNot:checkHeartAddedOrNot,checkAddedProductOrNot:checkAddedProductOrNot, allProducts : allProducts,likedCount:userLikedCount,addToCartCount:addToCartCount});


})

router.get('/categories/:incomingCategory',async function(req,res)
{
    let user=req.session.user;
    if(!user){
        user={
            id:''
        }
    }

    const incomingCategory=req.params.incomingCategory;
    const allProducts=await db.getDb().collection('products').find({ProductCategory:`${incomingCategory}`}).toArray();

    const checkAddedProductOrNot=await db.getDb().collection('checkAddedProduct').find({userId:user.id}).toArray();
    const checkHeartAddedOrNot=await db.getDb().collection('checkAddedHeart').find({userId:user.id}).toArray();
    if(!checkAddedProductOrNot)
        {
            checkAddedProductOrNot={
                addToCart:false
            }
        }
        if(!checkHeartAddedOrNot)
            {
                checkHeartAddedOrNot={
                    isLiked:false
                }
            }
    const addToCartCount=await db.getDb().collection('checkAddedProduct').find({userId:user.id}).toArray();
    const userLikedCount=await db.getDb().collection('checkAddedHeart').find({userId:user.id}).toArray();    
    res.render('categories',{checkHeartAddedOrNot:checkHeartAddedOrNot,checkAddedProductOrNot:checkAddedProductOrNot, allProducts : allProducts,likedCount:userLikedCount,addToCartCount:addToCartCount});
})
//cart table(cartTable)
router.get('/cart',async function(req,res){
    let user=req.session.user;
    console.log(user)
    if(!user){
        user={
            id:''
        }
    }
    const cartProducts=await db.getDb().collection('cartTable').find({userId:user.id}).toArray();
    const addToCartCount=await db.getDb().collection('checkAddedProduct').find({userId:user.id}).toArray();
    const userLikedCount=await db.getDb().collection('checkAddedHeart').find({userId:user.id}).toArray();   
    res.render('cart',{cartProducts:cartProducts,likedCount:userLikedCount,addToCartCount:addToCartCount});
})

router.get('/productDescription/:id',async function(req,res)
{
    let user=req.session.user;
    if(!user){
        user={
            id:''
        }
    }


    const productId=new ObjectId(req.params.id);
    const [allProducts]= await db.getDb().collection('products').find({ _id: productId }).toArray();
    console.log(allProducts)
    const filePath=path.join(__dirname,'..','public',`${allProducts.PImgUrl}`)
    const Img=await db.getDb().collection('products').find({ProductCategory:`${allProducts.ProductCategory}`}).toArray();
    const destinationFilePath=path.join(__dirname,'..','public','img','image-product-1.jpg');
    fs.copyFileSync(`${filePath}`,`${destinationFilePath}`)
    const destinationThumbNail=path.join(__dirname,'..','public','img',`image-product-1-thumbnail.jpg`);
    fs.copyFileSync(`${filePath}`,`${destinationThumbNail}`);        

    let i=2;
    for(let x of Img)
    {
        if(x._id.equals(productId)){
            continue;
        }
        else{

            const filePath=path.join(__dirname,'..','public',`${x.PImgUrl}`)

             const destinationFilePath=path.join(__dirname,'..','public','img',`image-product-${i}.jpg`);
            fs.copyFileSync(`${filePath}`,`${destinationFilePath}`);        
            const destinationThumbNail=path.join(__dirname,'..','public','img',`image-product-${i}-thumbnail.jpg`);
            fs.copyFileSync(`${filePath}`,`${destinationThumbNail}`);        
            i++;    
        }
    }
    console.log(allProducts)
    const addToCartCount=await db.getDb().collection('checkAddedProduct').find({userId:user.id}).toArray();
    const userLikedCount=await db.getDb().collection('checkAddedHeart').find({userId:user.id}).toArray();    

     res.render('productDescription',{ allProducts : allProducts,currentProductId:productId,likedCount:userLikedCount,addToCartCount:addToCartCount});
})


router.get('/wishListAddToCart/:id',async function(req,res){

    let user=req.session.user;
    if(!user){
        user={
            id:''
        }
    }

    const productId=new ObjectId(req.params.id);
    console.log(productId)
    console.log(user.id)
    const [addedProduct]=await db.getDb().collection('products').find({ _id: productId }).toArray();
    const addToCartProduct=await db.getDb().collection('checkAddedProduct').findOne({ProductId:productId,userId:user.id});
    if(!addToCartProduct){
    const cartTable=await db.getDb().collection('cartTable').insertOne({userId:user.id,ProductId:productId, ProductHeading:`${addedProduct.ProductHeading}`,PImgUrl:`${addedProduct.PImgUrl}`,ProductOriginalPrize:`${addedProduct.ProductOriginalPrize}`,ProductPrize:`${addedProduct.SalePrize}`,ProductQuantity:'1'})
    const productUpdate= await db.getDb().collection('checkAddedProduct').insertOne({ProductId:productId,userId:user.id,addToCart:true})    
    }

    const cartProducts=await db.getDb().collection('cartTable').find({userId:user.id}).toArray();
    const addToCartCount=await db.getDb().collection('checkAddedProduct').find({userId:user.id}).toArray();
    const userLikedCount=await db.getDb().collection('checkAddedHeart').find({userId:user.id}).toArray();    
    res.render('cart',{cartProducts:cartProducts,likedCount:userLikedCount,addToCartCount:addToCartCount});
})

router.get('/addToCart/:id',async function(req,res){
    const productId=new ObjectId(req.params.id);
    let user=req.session.user;
    console.log(user)
    const [addedProduct]=await db.getDb().collection('products').find({ _id: new ObjectId(productId) }).toArray();
    if(!user){
        user={
            id:''
        }
    }


    const checkAddedProductOrNot=await db.getDb().collection('checkAddedProduct').findOne({ProductId:productId,userId:user.id});
    if(checkAddedProductOrNot)
    {

        console.log(productId)
        console.log(user.id)
        // console.log(checkAddedProductOrNot.ProductId)    
        await db.getDb().collection('cartTable').deleteOne({ProductId:productId,userId:user.id})

        await db.getDb().collection('checkAddedProduct').deleteOne({ProductId:productId,userId:user.id})
        
        console.log('inside disappear')
        return res.json({message:'disAppear'}) 
    }
    else
    {
        const cartTable=await db.getDb().collection('cartTable').insertOne({userId:user.id,ProductId:productId, ProductHeading:`${addedProduct.ProductHeading}`,PImgUrl:`${addedProduct.PImgUrl}`,ProductOriginalPrize:`${addedProduct.ProductOriginalPrize}`,ProductPrize:`${addedProduct.SalePrize}`,ProductQuantity:1})
        const checkAddedProduct=await db.getDb().collection('checkAddedProduct').insertOne({userId:user.id,ProductId:productId,addToCart:true})
        console.log('inside appear')
         return res.json({message:'Appear'})         
    }
})

router.get('/deleteProductFromCart/:id',async function(req,res){
    let user=req.session.user;
    console.log(user)
    if(!user){
        user={
            id:''
        }
    }

    const productId=new ObjectId(req.params.id);
    // const cartDeleteFromProductTable=await db.getDb().collection('products').updateOne({_id:new ObjectId(productId)},{$set:{AddToCart: false,isLiked: false}})
    // const deleteProduct=await db.getDb().collection('cartTable').deleteOne({ProductId:productId});
    await db.getDb().collection('cartTable').deleteOne({ProductId:productId,userId:user.id})

    await db.getDb().collection('checkAddedProduct').deleteOne({ProductId:productId,userId:user.id})



    // const deleteProduct=await db.getDb().collection('cartTable').deleteOne({ProductId:productId,userId:user.id})
    // const deleteCheckAddedHeart=await db.getDb().collection('checkAddedProduct').deleteOne({ProductId:productId,userId:user.id});
    const cartProducts=await db.getDb().collection('cartTable').find({userId:user.id}).toArray();
    const addToCartCount=await db.getDb().collection('checkAddedProduct').find({userId:user.id}).toArray();
    const userLikedCount=await db.getDb().collection('checkAddedHeart').find({userId:user.id}).toArray();    

    res.render('cart',{cartProducts:cartProducts,likedCount:userLikedCount,addToCartCount:addToCartCount});
})

router.post('/addCartFromProductDescription/:id',async function(req,res){
    let user=req.session.user;
    console.log(user)
    if(!user){
        user={
            id:''
        }
    }
    const quantity=req.body.quantity;
    const productId=new ObjectId(req.params.id);
    const [addToCartProduct]=await db.getDb().collection('products').find({ _id: productId}).toArray();
    const [productDescription]=await db.getDb().collection('cartTable').find({ _id: productId,userId:user.id}).toArray();
  //  console.log(addToCartProduct)
    // const ProductQuantityUpdate= await db.getDb().collection('products').updateOne({_id: new ObjectId(productId)},{$set:{ProductQuantity:`${quantity}`}})
    if(productDescription==false){
            const cartTable=await db.getDb().collection('cartTable').insertOne({userId:user.id,ProductId:productId, ProductHeading:`${addToCartProduct.ProductHeading}`,PImgUrl:`${addToCartProduct.PImgUrl}`,ProductOriginalPrize:`${addToCartProduct.ProductOriginalPrize}`,ProductPrize:`${addToCartProduct.SalePrize}`,ProductQuantity:`${quantity}`})
            const productUpdate= await db.getDb().collection('checkAddedProduct').insertOne({ProductId: productId,userId:user.id,addToCart:true})    
    }
    else{
        console.log(quantity)
        const productUpdate= await db.getDb().collection('cartTable').updateOne({userId:user.id,ProductId: productId},{$set:{ProductQuantity:`${quantity}`}})
    }
    res.json({message:'added successfully'});
    // const cartProducts=await db.getDb().collection('cartTable').find({}).toArray();
    // res.render('cart',{cartProducts:cartProducts}); 
})


router.post('/addToCart/:updateProductId',async function(req,res){
    let user=req.session.user;
    console.log(user)
    if(!user){
        user={
            id:''
        }
    }
    let updateProductId=new ObjectId(req.params.updateProductId);
    let quantity=req.body.quantity;
    if(quantity==0){
        // const findingProductId=await db.getDb().collection('cartTable').findOne({_id:new ObjectId(updateProductId)})
        const qUpdate=await db.getDb().collection('cartTable').deleteOne({_id: updateProductId,userId:user.id})
        const heartUpdate=await db.getDb().collection('checkAddedProduct').deleteOne({_id: updateProductId,userId:user.id});
        // const userLikedCount=await db.getDb().collection('checkAddedHeart').find({userId:user.id}).toArray();   

    }
    let productUpdate= await db.getDb().collection('cartTable').updateOne({_id: updateProductId,userId:user.id},{$set:{ProductQuantity:quantity}})
    res.json({message:'updated successfully'});

})
router.get('/heart',async function(req,res){
    const productId=req.params.id;
    let user=req.session.user;
    if(!user){
        user={
            id:''
        }
    }

    const likedItems=await db.getDb().collection('heartTable').find({userId:user.id}).toArray();
    const addToCartCount=await db.getDb().collection('checkAddedProduct').find({userId:user.id}).toArray();
    const userLikedCount=await db.getDb().collection('checkAddedHeart').find({userId:user.id}).toArray();    
    
    res.render('heart',{likedItems:likedItems,likedCount:userLikedCount,addToCartCount:addToCartCount});
})
router.get('/heart/:id',async function(req,res){
    const productId=new ObjectId(req.params.id);
    let user=req.session.user;
    if(!user){
        user={
            id:''
        }
    }
    const [addedHeart]=await db.getDb().collection('products').find({ _id: productId }).toArray();
    const [heartButton]=await db.getDb().collection('checkAddedHeart').find({ProductId: productId,userId:user.id }).toArray();
    console.log('heartButton')
    if(heartButton){
        console.log('DIS APPEAR')
       const heartUpdate=await db.getDb().collection('checkAddedHeart').deleteOne({ProductId:productId,userId:user.id})

       const cartTable=await db.getDb().collection('heartTable').deleteOne({ProductId:productId,userId:user.id})
       
       return res.json({message:'disAppear'}) 
    }
    else{
        console.log('APPEAR')
                const heartTable=await db.getDb().collection('heartTable').insertOne({userId:user.id,ProductId:productId, ProductHeading:`${addedHeart.ProductHeading}`,PImgUrl:`${addedHeart.PImgUrl}`,ProductOriginalPrize:`${addedHeart.ProductOriginalPrize}`,ProductPrize:`${addedHeart.SalePrize}`,ProductStockStatus:'In Stock'})
                const heartUpdate= await db.getDb().collection('checkAddedHeart').insertOne({ProductId: productId,userId:user.id,isLiked:true})
                return res.json({message:'Appear'})
    }
})
// /deleteProductFromLikedItems/${id}
router.get('/deleteProductFromLikedItems/:id',async function(req,res){
    const productId=new ObjectId(req.params.id);
    let user=req.session.user;
    if(!user){
        user={
            id:''
        }
    }
     const likedItemDeleteFromProductTable=await db.getDb().collection('heartTable').deleteOne({ProductId:productId,userId:user.id});
    const deleteProduct=await db.getDb().collection('checkAddedHeart').deleteOne({userId:user.id,ProductId:productId});

    const likedItems=await db.getDb().collection('heartTable').find({userId:user.id}).toArray();
    const addToCartCount=await db.getDb().collection('checkAddedProduct').find({userId:user.id}).toArray();
    const userLikedCount=await db.getDb().collection('checkAddedHeart').find({userId:user.id}).toArray();    
    res.render('heart',{likedItems:likedItems,likedCount:userLikedCount,addToCartCount:addToCartCount});    
})

router.get('/checkout',async function(req,res){
    const productId=req.params.id;
    let user=req.session.user;
    if(!user){
        user={
            id:''
        }
    }
    
    const addToCartProducts=await db.getDb().collection('cartTable').find({userId:user.id}).toArray();
    console.log(addToCartProducts);
    const likedItems=await db.getDb().collection('heartTable').find({userId:user.id}).toArray();
    const addToCartCount=await db.getDb().collection('checkAddedProduct').find({userId:user.id}).toArray();
    const userLikedCount=await db.getDb().collection('checkAddedHeart').find({userId:user.id}).toArray();    
    res.render('checkout',{addToCartProducts:addToCartProducts,likedItems:likedItems,likedCount:userLikedCount,addToCartCount:addToCartCount});    

})

module.exports=router;
