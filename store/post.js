import { firestore, storage, auth, storageUrl } from '../plugins/firebase'
import firebase from 'firebase/app';

export const actions = {

  async fetchPost({}, {uid, slug}){
    const snapshot = await firestore.doc(`users/${uid}`).collection('posts').where('slug', '==', slug).get();

    if(snapshot.docs.length > 0){
      return snapshot.docs[0];
    }
  },
  async addPost({}, data){
    const storageRef = storage.ref();
    const postImageRef = await storageRef.child(`user-data/${data.postData.uid}/posts/${data.postId}/${data.postData.slug}.jpg`).put(data.postImageFile);
    data.postData.postImageURL = (await postImageRef.ref.getDownloadURL());

    await firestore.doc(`users/${data.postData.uid}/posts/${data.postId}`).set(data.postData);
  },
  async deletePost({}, data){
    
    await deleteCollection(`users/${data.ownerId}/posts/${data.postId}/comments`);
    await firestore.doc(`users/${data.ownerId}/posts/${data.postId}`).delete();

    const storageRef = storage.ref(`user-data/${data.ownerId}/posts/${data.postId}`);
    const files = await storageRef.listAll();

    files.items.forEach(async fileRef => {
      await storage.ref().child(fileRef.fullPath).delete();
    });
  },
  async updatePost({}, data){
    
    if(data.newPostImageFile != null){
      const storageRef = storage.ref();
      const newPostImageRef = await storageRef.child(`user-data/${data.uid}/posts/${data.slug}.jpg`).put(data.newPostImageFile);
      data.postData.postImageURL = (await newPostImageRef.ref.getDownloadURL());
    }

    await firestore.doc(`users/${data.uid}/posts/${data.postId}`).update(data.postData);
  },
  async dislikePost({}, postData){
    await firestore.doc(`users/${postData.ownerId}/posts/${postData.postId}`).update({
      likes: firebase.firestore.FieldValue.arrayRemove(postData.uid)
    });
  },
  async likePost({}, postData){
    await firestore.doc(`users/${postData.ownerId}/posts/${postData.postId}`).update({
      likes: firebase.firestore.FieldValue.arrayUnion(postData.uid)
    });
  },
  async removeBookmark({}, postData){
    await firestore.doc(`users/${postData.uid}`).update({
      bookmarks: firebase.firestore.FieldValue.arrayRemove(postData.bookmarkData)
    });
    this.commit('user/deleteBookmark', postData.bookmarkData)
  },
  async addBookmark({}, postData){
    await firestore.doc(`users/${postData.uid}`).update({
      bookmarks: firebase.firestore.FieldValue.arrayUnion(postData.bookmarkData)
    });
    this.commit('user/pushBookmark', postData.bookmarkData)
  },
  async fetchUserUnpPosts({ dispatch }, data){

    const snapshot = await firestore.doc(`users/${data.uid}`).collection('posts').where('published', '==', false).orderBy('updatedAt', 'desc').limit(data.limit).get();
    const posts = snapshot.docs.map((doc) => doc.data());
    const users = await dispatch('fetchPostOwners', { posts, cacheUsers: data.cacheUsers })
    
    return { posts, users }
    
  },
  async fetchUnpUserPostsMore({ dispatch }, data){

    const snapshot = await firestore.doc(`users/${data.uid}`).collection('posts').where('published', '==', false).orderBy('updatedAt', 'desc').startAfter(data.last).limit(data.limit).get();
    const posts = snapshot.docs.map((doc) => doc.data());
    const users = await dispatch('fetchPostOwners', { posts, cacheUsers: data.cacheUsers })
    
    return { posts, users }
    
  },
  async fetchUserPosts({ dispatch }, data){

    const snapshot = await firestore.doc(`users/${data.uid}`).collection('posts').where('published', '==', true).orderBy('updatedAt', 'desc').limit(data.limit).get();
    const posts = snapshot.docs.map((doc) => doc.data());
    const users = await dispatch('fetchPostOwners', { posts, cacheUsers: data.cacheUsers })
    
    return { posts, users }
    
  },
  async fetchUserPostsMore({ dispatch }, data){

    const snapshot = await firestore.doc(`users/${data.uid}`).collection('posts').where('published', '==', true).orderBy('updatedAt', 'desc').startAfter(data.last).limit(data.limit).get();
    const posts = snapshot.docs.map((doc) => doc.data());
    const users = await dispatch('fetchPostOwners', { posts, cacheUsers: data.cacheUsers })
    
    return { posts, users }
    
  },
  async fetchAllPosts({ dispatch }, data){

    const snapshot = await firestore.collectionGroup('posts').where('published', '==', true).orderBy('createdAt', 'desc').limit(data.limit).get();
    const posts = snapshot.docs.map((doc) => doc.data());
    const users = await dispatch('fetchPostOwners', { posts, cacheUsers: data.cacheUsers })
    
    return { posts, users }

  },
  async fetchAllPostsMore({ dispatch }, data){

    const snapshot = await firestore.collectionGroup('posts').where('published', '==', true).orderBy('createdAt', 'desc').startAfter(data.last).limit(data.limit).get();
    const posts = snapshot.docs.map((doc) => doc.data());
    const users = await dispatch('fetchPostOwners', { posts, cacheUsers: data.cacheUsers })
    
    return { posts, users }

  },
  async fetchPostsWithTag({ dispatch }, data){

    const snapshot = await firestore.collectionGroup('posts').where('published', '==', true).where('tagSlugs', 'array-contains', data.tag).orderBy('createdAt', 'desc').limit(data.limit).get();
    const posts = snapshot.docs.map((doc) => doc.data());
    const users = await dispatch('fetchPostOwners', { posts, cacheUsers: data.cacheUsers })

    return { posts, users }

  },
  async fetchPostsWithTagMore({ dispatch }, data){

    const snapshot = await firestore.collectionGroup('posts').where('published', '==', true).where('tagSlugs', 'array-contains', data.tag).orderBy('createdAt', 'desc').startAfter(data.last).limit(data.limit).get();
    const posts = snapshot.docs.map((doc) => doc.data());
    const users = await dispatch('fetchPostOwners', { posts, cacheUsers: data.cacheUsers })
    
    return { posts, users }
    
  },
  async fetchFollowedUsersPosts({ dispatch }, data){

    const snapshot = await firestore.collectionGroup('posts').where('published', '==', true).where('uid', 'in', data.followedList).orderBy('createdAt', 'desc').limit(data.limit).get()
    const posts = snapshot.docs.map((doc) => doc.data());
    const users = await dispatch('fetchPostOwners', { posts, cacheUsers: data.cacheUsers })
    
    return { posts, users }

  },
  async fetchFollowedUsersPostsMore({ dispatch }, data){

    const snapshot = await firestore.collectionGroup('posts').where('published', '==', true).where('uid', 'in', data.followedList).orderBy('createdAt', 'desc').startAfter(data.last).limit(data.limit).get()
    const posts = snapshot.docs.map((doc) => doc.data());
    const users = await dispatch('fetchPostOwners', { posts, cacheUsers: data.cacheUsers })
    
    return { posts, users }

  },
  async fetchSomeBookmarkedPosts({ dispatch }, data){
    let posts = [];
    const authId = this.getters['user/getUser'].uid;

    for(let i = data.last; i < data.last + data.limit; i++){

      const bookmark = data.bookmarks[i];
      if(bookmark != undefined){
        const post = await dispatch('fetchPost', {uid: bookmark.uid, slug: bookmark.slug})

        if(post != undefined && post.exists){
          posts.push(post.data())

        }else { // If post does not exist then, we should delete the bookmark from user's bookmark list.
          
          if(auth.currentUser){
            dispatch('removeBookmark', {bookmarkData: bookmark, uid: authId})
          }

          // We should delete it from our data.bookmarks list too,
          data.bookmarks.splice(data.bookmarks.indexOf(bookmark), 1)
          // Lastly, we should go one iteration back, to fetch another post instead of the deleted one.
          i--;
        }

      }
    }
    const users = await dispatch('fetchPostOwners', { posts, cacheUsers: data.cacheUsers })
    
    return { posts, users }
    
  },
  async fetchPostOwners({}, { posts, cacheUsers }){
    const users = {}
    for(let i = 0; i < posts.length; i++){

      if(!cacheUsers.includes(posts[i].uid) && users[posts[i].uid] == undefined){
        const user = await this.dispatch('user/fetchUser', posts[i].uid);
        users[posts[i].uid] = user.data();
      }
    }
    return users
  },

}

const deleteCollection = async (path) => {
  firestore.collection(path).get().then(async query => {
    query.forEach(async (snapshot) => {
      await snapshot.ref.delete()
    });
  });
}