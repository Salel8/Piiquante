const Sauce = require('../models/sauces.js');

// route post

/*exports.createSauce = (req, res, next) => {
  delete req.body._id;
  const thing = new Sauce({
    ...req.body
  });
  thing.save()
    .then(() => res.status(201).json({ message: 'Objet enregistré !'}))
    .catch(error => res.status(400).json({ error }));
};*/

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
   //next();
};

// route get

exports.getAllSauce = (req, res, next) => {
  Sauce.find()
    .then(things => res.status(200).json(things))
    .catch(error => res.status(400).json({ error }));
    //next();
};

// route get spécifique

exports.getOneSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then(thing => res.status(200).json(thing))
    .catch(error => res.status(404).json({ error }));
    //next();
};

// route put

/*exports.modifySauce = (req, res, next) => {
  Thing.updateOne({ _id: req.params.id }, { ...req.body, _id: req.params.id })
    .then(() => res.status(200).json({ message: 'Objet modifié !'}))
    .catch(error => res.status(400).json({ error }));
};*/

exports.modifySauce = (req, res, next) => {
   const sauceObject = req.file ? {
       ...JSON.parse(req.body.sauce),
       /*const filename = sauce.imageUrl.split('/images/')[1];*/
       /*fs.unlink(`images/${filename}`);*/
       imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
   } : { ...req.body };

   delete sauceObject._userId;
   Sauce.findOne({_id: req.params.id})
       .then((sauce) => {
           if (sauce.userId != req.auth.userId) {
               res.status(401).json({ message : 'Not authorized'});
           } else {
               Sauce.updateOne({ _id: req.params.id}, { ...sauceObject, _id: req.params.id})
               .then(() => {
                 res.status(200).json({message : 'Objet modifié!'});

               })
               .catch(error => res.status(401).json({ error }));
           }
       })
       .catch((error) => {
           res.status(400).json({ error });
       });
       //next();
};

// route delete

/*exports.deleteSauce = (req, res, next) => {
  Sauce.deleteOne({ _id: req.params.id })
    .then(() => res.status(200).json({ message: 'Objet supprimé !'}))
    .catch(error => res.status(400).json({ error }));
    //next();
};*/

exports.deleteSauce = (req, res, next) => {
   Sauce.findOne({ _id: req.params.id})
       .then(sauce => {
           if (sauce.userId != req.auth.userId) {
               res.status(401).json({message: 'Not authorized'});
           } else {
               const filename = sauce.imageUrl.split('/images/')[1];
               fs.unlink(`images/${filename}`, () => {
                   Sauce.deleteOne({_id: req.params.id})
                       .then(() => { res.status(200).json({message: 'Objet supprimé !'})})
                       .catch(error => res.status(401).json({ error }));
               });
           }
       })
       .catch( error => {
           res.status(500).json({ error });
       });
};

exports.likeSauce = (req, res, next) => {
  /*const sauceObject = (req.params.userId==az) ? {JSON.parse(req.body.sauce)
  } : {};*/
  //const sauceObject = JSON.parse(req.body.sauce);
  allReadyUsedObjet={
    allReadyUsedLikes: 'no',
    allReadyUsedDislikes: 'no',
    numberArrayUserLikes: 0,
    numberArrayUserDislikes: 0
  };
  let a=0;
  for (const element of usersLiked) {
    if (req.auth.userId==element){
      allReadyUsedObjet.allReadyUsedLikes = 'yes';
      allReadyUsedObjet.numberArrayUserLikes = a;
    }
    a = a + 1;
  }

  let b=0;
  for (const element of usersDisliked) {
    if (req.auth.userId==element){
      allReadyUsedObjet.allReadyUsedDislikes = 'yes';
      allReadyUsedObjet.numberArrayUserDislikes = b;
    }
    b = b + 1;
  }

  if (req.body.sauce.like == 1 && allReadyUsedObjet.allReadyUsedLikes=='no'){
    const sauceObject = {...JSON.parse(req.body.sauce),
    likes: parseInt(sauce.likes + 1),
    usersLiked: push(req.body.sauce.userId)};
  }
  
  if (req.body.sauce.like == -1 && allReadyUsedObjet.allReadyUsedDislikes=='no'){
      const sauceObject = {...JSON.parse(req.body.sauce),
      dislikes: parseInt(sauce.dislikes + 1),
      usersDisliked: push(req.body.sauce.userId)};
  }

  if (req.body.sauce.like == 0 && allReadyUsedObjet.allReadyUsedLikes=='yes'){
        const sauceObject = {...JSON.parse(req.body.sauce),
        likes: parseInt(sauce.likes - 1),
        usersLiked: split(allReadyUsedObjet.numberArrayUserLikes, 1)};
  }

  if (req.body.sauce.like == 0 && allReadyUsedObjet.allReadyUsedDislikes=='yes'){
        const sauceObject = {...JSON.parse(req.body.sauce),
        dislikes: parseInt(sauce.likes - 1),
        usersDisliked: split(allReadyUsedObjet.numberArrayUserDislikes, 1)};
  }


  delete sauceObject._userId;
  Sauce.findOne({_id: req.params.id})
      .then((sauce) => {
        if (sauce.userId != req.auth.userId) {
            res.status(401).json({message: 'Not authorized'});
        } else {
          Sauce.updateOne({ _id: req.params.id}, { ...sauceObject, _id: req.params.id })
          .then(() => {
            res.status(200).json({message : 'Objet modifié!'});

          })
          .catch(error => res.status(401).json({ error }));
      })
      .catch( error => {
          res.status(500).json({ error });
        });

};
