/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

// const {onRequest} = require("firebase-functions/v2/https");
// const logger = require("firebase-functions/logger");
const functions = require("firebase-functions");
const admin = require("firebase-admin");
const {onDocumentCreated} = require("firebase-functions/firestore");
const { getMessaging } = require("firebase-admin/messaging");


admin.initializeApp()
const db = admin.firestore()

const messaging = getMessaging();

exports.helloWorld = functions.https.onRequest((request, response) =>{
    console.log("jag är en log!")
    response.send("Hello from my very own firebase function!")
})


exports.getPersons = functions.https.onRequest( async (request,response) =>{
    try {
       const snap = await db.collection("persons").get();
       
       const persons = [];

       snap.forEach((doc) => {
        persons.push({id: doc.id, ...doc.data()});
       });

       response.status(200).json(persons);


    } catch (error) {
        console.error("Error fetching persons", error);
        response.status(500).send("Internal server error");
    }
})

exports.onNewMessage = onDocumentCreated("messages/{messageId}", async (event) =>{
    const message = event.data.data();
    console.log("nytt meddelande:", message.text);

    const userId = message.userId;
    const messageText = message.text;


    if(!userId){
        console.log("inget userId i meddelandet");
        return null;
    }

    const userDoc = await db.doc(`users/${userId}`).get()

    if(!userDoc.exists){
        console.log(`ànvändare saknas`);
        return null;
    }

    const fcmToken = userDoc.data().fcmToken;

    if(!fcmToken){
        console.log("token saknas");
        return null;
    }

    const payload = {
        notification: {
            title: "Nytt meddelande",
            body: messageText
        }, 
        token: fcmToken,
    };

    try {
        const response = await messaging.send(payload);
        console.log("Notis skickad", response)

    } catch (error){
        console.error("fel vid sen notification", error)
    }

    return null;

})

// Create and deploy your first functions
// https://firebase.google.com/docs/functions/get-started

// exports.helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });
