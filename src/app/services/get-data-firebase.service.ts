import { Injectable } from '@angular/core';
import { DocumentData, DocumentReference, Firestore, collection, doc, getDoc, getDocs, setDoc, updateDoc } from '@angular/fire/firestore';
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
  async getCollectionDocs(collectionPath: string): Promise<any[]> {
    const collectionRef = collection(this.firestore, collectionPath);
    const querySnapshot = await getDocs(collectionRef);
    const docs: any[] = [];
    querySnapshot.forEach((doc) => {
      docs.push(doc);
    });
    return docs;
  }

  //Create or update a document
  async createUpdateDoc(ref: string, data: any) {
    try {
      const collectionRef = await collection(this.firestore, ref);
      await setDoc(doc(collectionRef), data);
      console.log('Documento creado');

    }
    catch (error) {
      console.error(error);
    }
  }

  async selectCreateDoc(ref: any, createIt: boolean) {
    try {
      const docSnapshot = await getDoc(ref);
      if (docSnapshot.exists()) {
        return true
      } else {
        if (createIt) {
          await setDoc(ref, {});
          return true;
        } else {
          return false;
        }
      }
    } catch (error) {
      console.error('Error al verificar/crear el documento:', error);
      alert(`Error al subir el archivo: ${error}`)
      return false;
    }
  }
}
