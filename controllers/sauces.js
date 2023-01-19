const Sauce = require('../models/sauces.js');
const fs = require('fs');

// route post

exports.createSauce = (req, res, next) => {
   const sauceObject = JSON.parse(req.body.sauce);
   delete sauceObject._id;
   delete sauceObject._userId;
   const sauce = new Sauce({
       ...sauceObject,
       userId: req.auth.userId,
       imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
   });

   sauce.save()
   .then(() => { res.status(201).json({message: 'Objet enregistré !'})})
   .catch(error => { res.status(400).json( { error })})
};

// route get

exports.getAllSauce = (req, res, next) => {
  Sauce.find()
    .then(things => res.status(200).json(things))
    .catch(error => res.status(400).json({ error }));
};

// route get spécifique

exports.getOneSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then(thing => res.status(200).json(thing))
    .catch(error => res.status(404).json({ error }));
};

// route put

exports.modifySauce = (req, res, next) => {
   const sauceObject = req.file ? {
       ...JSON.parse(req.body.sauce),
       imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
   } : { ...req.body };

   

   delete sauceObject._userId;
   Sauce.findOne({_id: req.params.id})
       .then((sauce) => {
           if (sauce.userId != req.auth.userId) {
               return res.status(401).json({ message : 'Not authorized'});
           }
            if (req.file){
              const filename = sauce.imageUrl.split('/images/')[1];
              fs.unlinkSync(`images/${filename}`);
            }
               Sauce.updateOne({ _id: req.params.id}, { ...sauceObject, _id: req.params.id})
               .then(() => {
                 res.status(200).json({message : 'Objet modifié!'});

               })
               .catch(error => res.status(401).json({ error }));
           
       })
       .catch((error) => {
           res.status(400).json({ error });
       });
};

// route delete

exports.deleteSauce = (req, res, next) => {
   Sauce.findOne({ _id: req.params.id})
       .then(sauce => {
           if (sauce.userId != req.auth.userId) {
               return res.status(401).json({message: 'Not authorized'});
           }  
               const filename = sauce.imageUrl.split('/images/')[1];
               fs.unlink(`images/${filename}`, () => {
                   Sauce.deleteOne({_id: req.params.id})
                       .then(() => { res.status(200).json({message: 'Objet supprimé !'})})
                       .catch(error => res.status(401).json({ error }));
               });
           
       })
       .catch( error => {
          console.log(error);
           res.status(500).json({ error: "sauce introuvable" });
       });
};


exports.likeSauce = (req, res, next) => {

   Sauce.findOne({_id: req.params.id})
       .then((sauce) => {

          if (req.body.like == 1 && sauce.usersLiked.includes(req.body.userId)==false && sauce.usersDisliked.includes(req.body.userId)==false){
            console.log(sauce.usersLiked);
            
            let card1 = sauce.usersLiked.push(req.body.userId);
            let sauceObject = {
              likes: parseInt(sauce.likes) + 1,
              usersLiked: sauce.usersLiked};
              console.log(sauce.usersLiked);
              //console.log(String(req.body.userId));
              //console.log(sauce.usersLiked.includes(req.body.userId));
              //console.log(sauce.usersLiked.includes(req.body.userId)!=true);
              //console.log(sauce.usersLiked.includes(req.body.userId)!=false);
              Sauce.updateOne({ _id: req.params.id}, { ...sauceObject, _id: req.params.id, }, )
               .then(() => {
                 res.status(200).json({message : 'Objet modifié!'});

               })
               .catch(error => {res.status(401).json({ error });console.log(error);});
               
               console.log(card1);
          }
          //console.log(sauce.usersLiked);

          if (req.body.like == -1 && sauce.usersDisliked.includes(req.body.userId)==false && sauce.usersLiked.includes(req.body.userId)==false){
            let card1 = sauce.usersDisliked.push(req.body.userId);
            sauceObject = {
              dislikes: parseInt(sauce.dislikes) + 1,
              usersDisliked: sauce.usersDisliked};
              return Sauce.updateOne({ _id: req.params.id}, { ...sauceObject, _id: req.params.id, })
               .then(() => {
                 res.status(200).json({message : 'Objet modifié!'});

               })
               .catch(error => {res.status(401).json({ error });console.log(error);});
          }

          if(req.body.like == 0 && sauce.usersLiked.includes(req.body.userId)==true){
            const indexLike = sauce.usersLiked.findIndex((like) => like==sauce.userId);
            let card1=sauce.usersLiked.splice(indexLike,1);
            sauceObject = {
              likes: parseInt(sauce.likes) - 1,
              usersLiked: sauce.usersLiked};
              return Sauce.updateOne({ _id: req.params.id}, { ...sauceObject, _id: req.params.id, })
               .then(() => {
                 res.status(200).json({message : 'Objet modifié!'});

               })
               .catch(error => {res.status(401).json({ error });console.log(error);});
          }
        
          if(req.body.like == 0 && sauce.usersDisliked.includes(req.body.userId)==true){
            const indexDislike = sauce.usersDisliked.findIndex((dislike) => dislike==sauce.userId);
            let card1 = sauce.usersDisliked.splice(indexDislike,1);
            sauceObject = {
              dislikes: parseInt(sauce.dislikes) - 1,
              usersDisliked: sauce.usersDisliked};
              return Sauce.updateOne({ _id: req.params.id}, { ...sauceObject, _id: req.params.id, })
               .then(() => {
                 res.status(200).json({message : 'Objet modifié!'});

               })
               .catch(error => {res.status(401).json({ error });console.log(error);});
          }
           
       })
       .catch((error) => {
           res.status(400).json({ error });
           console.log(error);
           //console.log(req.body.like);
       });

}
