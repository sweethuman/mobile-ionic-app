import React, {useContext, useEffect, useState} from 'react';
import {
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonInput,
  IonLoading,
  IonPage,
  IonTitle,
  IonToolbar
} from '@ionic/react';
import {getLogger} from '../core';
import {StudentContext} from './StudentProvider';
import {RouteComponentProps} from 'react-router';
import {StudentProps} from './StudentProps';

const log = getLogger('ItemEdit');

interface ItemEditProps extends RouteComponentProps<{
  id?: string;
}> {
}

const ItemEdit: React.FC<ItemEditProps> = ({history, match}) => {
  const {items, saving, savingError, saveItem} = useContext(StudentContext);
  const [name, setName] = useState('');
  const [item, setItem] = useState<StudentProps>();
  useEffect(() => {
    log('useEffect');
    const routeId = match.params.id || '';
    const item = items?.find(it => it.id === routeId);
    setItem(item);
    if (item) {
      setName(item.name);
    }
  }, [match.params.id, items]);
  const handleSave = () => {
    const editedItem = item ? {...item, name} : {
      name,
      faculty: "",
      email: "",
      phoneNumber: "",
      photoUrl: "https://robohash.org/" + name + ".png"
    };
    saveItem && saveItem(editedItem).then(() => history.goBack());
  };
  log('render');
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Edit</IonTitle>
          <IonButtons slot="end">
            <IonButton onClick={handleSave}>
              Save
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonInput value={name} onIonChange={e => setName(e.detail.value || '')}/>
        <IonLoading isOpen={saving}/>
        {savingError && (
          <div>{savingError.message || 'Failed to save item'}</div>
        )}
      </IonContent>
    </IonPage>
  );
};

export default ItemEdit;
