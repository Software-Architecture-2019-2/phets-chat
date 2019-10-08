const response = require('../util/response')
const admin = require("firebase-admin");

var serviceAccount = require('../credentials/sa-hotdog-firebase-adminsdk-uct5k-e1245867f4.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://sa-hotdog.firebaseio.com"
});

var db = admin.firestore();

const sendMessage = async (req, res) => {
  db.collection(req.receivedEmail).doc().set({
    "email": req.sentEmail
  })
  const channelOne = db.collection('channels').doc(req.sentEmail).collection(req.receivedEmail)
  const getChannel = await channelOne.get()
  if (getChannel.docs.length === 0) {
    const channelTwo = db.collection("channels").doc(req.receivedEmail).collection(req.sentEmail)
    const getChannelTwo = await channelTwo.get()
    if (getChannelTwo.docs.length === 0){
      channelOne.doc().set({
        sentEmail: req.sentEmail,
        receivedEmail: req.receivedEmail,
        message: req.body.content,
        time: new Date().getTime(),
        read: false
      })
      
    } else {
      channelTwo.doc().set({
        sentEmail: req.sentEmail,
        receivedEmail: req.receivedEmail,
        message: req.body.content,
        time: new Date().getTime(),
        read: false
      })
    }
    
  } else {
    channelOne.doc().set({
      sentEmail: req.sentEmail,
      receivedEmail: req.receivedEmail,
      message: req.body.content,
      time: new Date().getTime(),
      read: false
    })
  }
  return response.success(res, 'Message sent')
}

const createUserChannel = async (email) => {
  db.collection(email).doc().set({
    "email": email
  })
}

module.exports = {
  sendMessage,
  createUserChannel
}