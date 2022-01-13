import React, { useContext } from 'react';
import { RouteComponentProps } from 'react-router';
import {
  IonButtons,
  IonContent,
  IonFab,
  IonFabButton,
  IonHeader,
  IonIcon,
  IonList, IonLoading,
  IonPage,
  IonTitle,
  IonToolbar,
  IonBackButton, IonButton
} from '@ionic/react';
import { add } from 'ionicons/icons';
import Item from './Item';
import { getLogger } from '../core';
import { StudentContext } from './StudentProvider';
import {AuthContext} from "../auth";

const log = getLogger('ItemList');

const ItemList: React.FC<RouteComponentProps> = ({ history }) => {
  const { items, fetching, fetchingError } = useContext(StudentContext);
  const {logout} = useContext(AuthContext);
  log('render');
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Student List</IonTitle>
          <IonButtons slot="end">
            <IonButton onClick={() => logout?.()}>Log Out</IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonLoading isOpen={fetching} message="Fetching items" />
        {items && (
          <IonList>
            {items.map(({ id, name, email, phoneNumber, photoUrl, faculty}) =>
              <Item key={id} id={id} name={name} email={email} phoneNumber={phoneNumber} photoUrl={photoUrl} faculty={faculty} onEdit={id => history.push(`/item/${id}`)} />)}
          </IonList>
        )}
        {fetchingError && (
          <div>{fetchingError.message || 'Failed to fetch items'}</div>
        )}
        <IonFab vertical="bottom" horizontal="end" slot="fixed">
          <IonFabButton onClick={() => history.push('/item')}>
            <IonIcon icon={add} />
          </IonFabButton>
        </IonFab>
      </IonContent>
    </IonPage>
  );
};

export default ItemList;
