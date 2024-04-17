import { Injectable } from '@angular/core';
import { DocumentReference, Firestore, collection, doc, getDoc, getDocs } from '@angular/fire/firestore';
import Galpon from '../interfaces/galpon.interface';

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
        return docSnapshot;
      } else {
        return null;
      }
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  //Función que devuelve un array con los documentos de una coleccion
  async getCollectionDocs(collectionPath: string): Promise<Galpon[]> {
    const collectionRef = collection(this.firestore, collectionPath);
    const querySnapshot = await getDocs(collectionRef);
    const docs: any[] = [];
    querySnapshot.forEach((doc) => {
      docs.push(doc.data());
    });
    return docs;
  }
}
