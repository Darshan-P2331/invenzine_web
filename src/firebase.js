import * as firebase from 'firebase'


const config = {
    apiKey: "AIzaSyDgiX4cqSjQm2uNivye5j8O29ATDurlfrI",
    authDomain: "techmag-77e4a.firebaseapp.com",
    databaseURL: "https://techmag-77e4a.firebaseio.com",
    projectId: "techmag-77e4a",
    storageBucket: "techmag-77e4a.appspot.com",
    messagingSenderId: "763598038318",
    appId: "1:763598038318:web:501571eac19fb6916606bf",
    measurementId: "G-6N0W9JP19Y"
}

firebase.initializeApp(config)

export function logout() {
    firebase.auth().signOut().then(() => {
        console.log('Logedout')
    })

}
export default firebase