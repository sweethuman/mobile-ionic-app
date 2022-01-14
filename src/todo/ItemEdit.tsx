import React, {useContext, useEffect} from 'react';
import {
  IonButton,
  IonButtons,
  IonContent,
  IonFab,
  IonFabButton,
  IonHeader,
  IonIcon,
  IonInput,
  IonItem,
  IonLabel,
  IonList,
  IonLoading,
  IonPage,
  IonTitle,
  IonToolbar
} from '@ionic/react';
import {getLogger} from '../core';
import {StudentContext} from './StudentProvider';
import {RouteComponentProps} from 'react-router';
import {EmptyStudent, StudentProps} from './StudentProps';
import {useImmer} from "use-immer";
import {camera} from "ionicons/icons";
import {usePhotoGallery} from "../hooks/usePhotoGallery";

const log = getLogger('ItemEdit');

interface ItemEditProps extends RouteComponentProps<{
  id?: string;
}> {
}

const ItemEdit: React.FC<ItemEditProps> = ({history, match}) => {
  const {items, saving, savingError, saveItem} = useContext(StudentContext);
  const [item, setItem] = useImmer<StudentProps>(EmptyStudent);
  const {takePhoto} = usePhotoGallery();
  useEffect(() => {
    log('useEffect');
    const routeId = match.params.id || '';
    const item = items?.find(it => it.id === routeId);
    if (item) {
      setItem(item);
    } else {
      setItem(EmptyStudent);
    }
  }, [match.params.id, items]);
  const handleSave = () => {
    saveItem && saveItem(item).then(() => history.goBack());
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
        <IonList>
          <IonItem>
            <IonLabel>Name</IonLabel>
            <IonInput value={item.name} onIonChange={e => setItem(draft => {
              draft.name = e.detail.value || ""
            })}/>
          </IonItem>
          <IonItem>
            <IonLabel>Faculty</IonLabel>
            <IonInput value={item.faculty} onIonChange={e => setItem(draft => {
              draft.faculty = e.detail.value || ""
            })}/>
          </IonItem>
          <IonItem>
            <IonLabel>Email</IonLabel>
            <IonInput value={item.email} onIonChange={e => setItem(draft => {
              draft.email = e.detail.value || ""
            })}/>
          </IonItem>
          <IonItem>
            <IonLabel>PhoneNumber</IonLabel>
            <IonInput value={item.phoneNumber} onIonChange={e => setItem(draft => {
              draft.phoneNumber = e.detail.value || ""
            })}/>
          </IonItem>
          <IonItem>
            <IonLabel>Photo URL</IonLabel>
            <IonInput value={item.photoUrl} onIonChange={e => setItem(draft => {
              draft.photoUrl = e.detail.value || ""
            })}/>
          </IonItem>
        </IonList>
        <IonFab vertical="bottom" horizontal="center" slot="fixed">
          <IonFabButton
            onClick={async () => {
              try {
                const image = await takePhoto();
                console.log("setting image")
                setItem(draft => {
                  draft.photoUrl = image;
                })
              } catch (e) {
              }
            }}
          >
            <IonIcon icon={camera}/>
          </IonFabButton>
        </IonFab>
        <IonLoading isOpen={saving}/>
        {savingError && (
          <div>{savingError.message || 'Failed to save item'}</div>
        )}
      </IonContent>
    </IonPage>
  );
};

export default ItemEdit;
