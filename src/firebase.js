import firebase from 'firebase'


const config = {
    
}

firebase.initializeApp(config)

export function logout() {
    firebase.auth().signOut()

}
export default firebase