import { Injectable } from '@angular/core';
import { DocumentReference, Firestore, doc, getDoc } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class GetDataFirebaseService {

  constructor(private firestore: Firestore) { }

  async getDocByPath(reference: string) {
    const userDataRef = doc(this.firestore, reference);
    return await this.getDocByReference(userDataRef);
  }

  async getDocByReference(ref: DocumentReference): Promise<any> {
    try {
      const docSnapshot = await getDoc(ref);
      if (docSnapshot.exists()) {
        return docSnapshot
      } else {
        return null
      }
    } catch (error) {
      console.error(error);
      return null;
    }
  }

}
