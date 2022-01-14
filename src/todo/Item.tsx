import React from 'react';
import {IonAvatar, IonButton, IonItem, IonLabel} from '@ionic/react';
import { StudentProps } from './StudentProps';

interface ItemPropsExt extends StudentProps {
  onEdit: (id?: string) => void;
  onMap: () => void;
}

const Item: React.FC<ItemPropsExt> = ({ id, name, photoUrl, onEdit, onMap }) => {
  return (
    <IonItem>
      <IonAvatar slot="start">
        <img src={photoUrl} alt="profile pic" />
      </IonAvatar>
      <IonLabel>{name}</IonLabel>
      <IonButton onClick={onMap}>
        Open Map
      </IonButton>
      <IonButton onClick={() => onEdit(id)}>
        Edit
      </IonButton>
    </IonItem>
  );
};

export default Item;
