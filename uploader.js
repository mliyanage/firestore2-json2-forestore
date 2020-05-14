var admin = require("firebase-admin");

var serviceAccount = require("./prod-service-key.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://yellochat-prod.firebaseio.com",
});

const firestore = admin.firestore();
const path = require("path");
const fs = require("fs");
const directoryPath = path.join(__dirname, "files");

fs.readdir(directoryPath, function (err, files) {
  if (err) {
    return console.log("Unable to scan directory: " + err);
  }
  console.log(directoryPath);
  console.log("in side");
  console.log(files);
  files.forEach(function (file) {
    var lastDotIndex = file.lastIndexOf(".");

    var menu = require("./files/" + file);

    menu.forEach(function (obj) {
      firestore
        .collection(file.substring(0, lastDotIndex))
        .doc(obj.itemID) //.doc() for auto ID and .doc(obj.itemID) id from file
        .set(obj)
        .then(function (docRef) {
          console.log("Document written");
        })
        .catch(function (error) {
          console.error("Error adding document: ", error);
        });
    });
  });
});
