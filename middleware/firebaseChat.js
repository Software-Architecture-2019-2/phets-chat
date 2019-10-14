const response = require("../util/response");
const admin = require("firebase-admin");

var serviceAccount = require("../credentials/sa-hotdog-firebase-adminsdk-uct5k-e1245867f4.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://sa-hotdog.firebaseio.com"
});

var db = admin.firestore();

const sendMessage = async (req, res) => {
  const notificationOne = db
    .collection("notifications")
    .doc(req.receivedEmail)
    .collection(req.sentEmail);
  const getNotification = await notificationOne.get();

  if (getNotification.docs.length === 0) {
    notificationOne.doc("unread").set({
      total: 1
    });
  } else {
    const unreadData = await notificationOne.doc("unread").get();
    const total = unreadData.data().total;
    notificationOne.doc("unread").update({
      total: 1 + total
    });
  }

  const channelOne = db
    .collection("channels")
    .doc(req.sentEmail)
    .collection(req.receivedEmail);
  const getChannel = await channelOne.get();
  if (getChannel.docs.length === 0) {
    const channelTwo = db
      .collection("channels")
      .doc(req.receivedEmail)
      .collection(req.sentEmail);
    const getChannelTwo = await channelTwo.get();
    if (getChannelTwo.docs.length === 0) {
      channelOne.doc().set({
        sentEmail: req.sentEmail,
        receivedEmail: req.receivedEmail,
        message: req.body.content,
        time: new Date().getTime(),
      });
    } else {
      channelTwo.doc().set({
        sentEmail: req.sentEmail,
        receivedEmail: req.receivedEmail,
        message: req.body.content,
        time: new Date().getTime(),
      });
    }
  } else {
    channelOne.doc().set({
      sentEmail: req.sentEmail,
      receivedEmail: req.receivedEmail,
      message: req.body.content,
      time: new Date().getTime(),
    });
  }
  return response.success(res, "Message sent");
};

const createUserChannel = async email => {
  db.collection(email)
    .doc()
    .set({
      email: email
    });
};

const deleteChannel = async (req, res) => {
  const channelOne = db
    .collection("channels")
    .doc(req.sentEmail)
    .collection(req.receivedEmail);
  const getChannelOne = await channelOne.get();
  if (getChannelOne.docs.length === 0) {
    const channelTwo = db
      .collection("channels")
      .doc(req.receivedEmail)
      .collection(req.sentEmail);
    const getChannelTwo = await channelTwo.get();
    if (getChannelTwo.docs.length === 0) {
      return response.error(res, 500, "Not found");
    } else {
      //Delete notifications
      const notificationRef = db
        .collection("notifications")
        .doc(req.sentEmail)
        .collection(req.receivedEmail);
      deleteCollection(notificationRef, 1, res);

      //Delete the collection
      const collectionRef = db
        .collection("channels")
        .doc(req.receivedEmail)
        .collection(req.sentEmail);
      deleteCollection(collectionRef, getChannelTwo.docs.length);

      return response.success(res, "Collection removed");
    }
  } else {
    //Delete notifications
    const notificationRef = db
      .collection("notifications")
      .doc(req.receivedEmail)
      .collection(req.sentEmail);
    deleteCollection(notificationRef, 1);

    //Delete the collection
    const collectionRef = db
      .collection("channels")
      .doc(req.sentEmail)
      .collection(req.receivedEmail);
    deleteCollection(collectionRef, getChannelOne.docs.length);

    return response.success(res, "Collection removed");
  }
};

function deleteCollection(ref, length) {
  let query = ref.limit(length);

  return new Promise((resolve, reject) => {
    deleteQueryBatch(db, query, length, resolve, reject);
  });
}

function deleteQueryBatch(db, query, batchSize, resolve, reject) {
  query
    .get()
    .then(snapshot => {
      // When there are no documents left, we are done
      if (snapshot.size == 0) {
        return 0;
      }

      // Delete documents in a batch
      let batch = db.batch();
      snapshot.docs.forEach(doc => {
        batch.delete(doc.ref);
      });

      return batch.commit().then(() => {
        return snapshot.size;
      });
    })
    .then(numDeleted => {
      if (numDeleted === 0) {
        resolve();
        return;
      }

      // Recurse on the next process tick, to avoid
      // exploding the stack.
      process.nextTick(() => {
        deleteQueryBatch(db, query, batchSize, resolve, reject);
      });
    })
    .catch(reject);
}

const deleteNotifications = async (req, res) => {
  const notificationRef = db
  .collection("notifications")
  .doc(req.sentEmail)
  .collection(req.receivedEmail);

  deleteCollection(notificationRef, 1);
  return response.success(res, "Collection removed");
}
module.exports = {
  sendMessage,
  createUserChannel,
  deleteChannel,
  deleteNotifications
};
