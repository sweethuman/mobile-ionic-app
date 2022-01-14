import React, {useContext, useState} from 'react';
import {RouteComponentProps} from 'react-router';
import {
  IonButton,
  IonButtons,
  IonContent,
  IonFab,
  IonFabButton,
  IonHeader,
  IonIcon,
  IonLabel,
  IonList,
  IonLoading,
  IonPage,
  IonSearchbar,
  IonSelect,
  IonSelectOption,
  IonToolbar
} from '@ionic/react';
import {add} from 'ionicons/icons';
import Item from './Item';
import {getLogger} from '../core';
import {StudentContext} from './StudentProvider';
import {AuthContext} from "../auth";
import {useNetwork} from "../hooks/useNetwork";

const log = getLogger('ItemList');

const ItemList: React.FC<RouteComponentProps> = ({history}) => {
  const [searchText, setSearchText] = useState("");
  const {items, fetching, fetchingError, filter, setFilter, allFilters, page, setPage} = useContext(StudentContext);
  const {logout} = useContext(AuthContext);
  const {networkStatus} = useNetwork()
  log('render');
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonSearchbar value={searchText} onIonChange={e => setSearchText(e.detail.value!)} animated/>
            <IonSelect
              value={filter}
              placeholder="Select Filter"
              onIonChange={(e) => setFilter && setFilter(e.detail.value)}
            >
              {allFilters?.map((filter) => (
                <IonSelectOption key={filter} value={filter}>
                  {filter}
                </IonSelectOption>
              ))}
            </IonSelect>
            <IonButton disabled={page <= 0} onClick={() => setPage?.(page - 1)}>Previous Page</IonButton>
            <IonLabel>{page}</IonLabel>
            <IonButton  onClick={() => setPage?.(page + 1)}>Next Page</IonButton>
          </IonButtons>
          <IonButtons slot="end">
            <IonLabel>{networkStatus.connected ? "Network online" : "Network offline"}</IonLabel>
            <IonButton onClick={() => logout?.()}>Log Out</IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonLoading isOpen={fetching} message="Fetching items"/>
        {items && (
          <IonList>
            {items.filter((item) => item.name.toLowerCase().includes(searchText)).map(({
                                                                                         id,
                                                                                         name,
                                                                                         email,
                                                                                         phoneNumber,
                                                                                         photoUrl,
                                                                                         faculty,
              lat, lng
                                                                                       }) =>
              <Item key={id} id={id} name={name} email={email} phoneNumber={phoneNumber} photoUrl={photoUrl}
                    faculty={faculty} lat={lat} lng={lng} onEdit={id => history.push(`/item/${id}`)}/>)}
          </IonList>
        )}
        {fetchingError && (
          <div>{fetchingError.message || 'Failed to fetch items'}</div>
        )}
        <IonFab vertical="bottom" horizontal="end" slot="fixed">
          <IonFabButton onClick={() => history.push('/item')}>
            <IonIcon icon={add}/>
          </IonFabButton>
        </IonFab>
      </IonContent>
    </IonPage>
  );
};

export default ItemList;
