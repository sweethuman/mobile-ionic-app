import React from 'react';
import {IonAvatar, IonItem, IonLabel} from '@ionic/react';
import { StudentProps } from './StudentProps';

interface ItemPropsExt extends StudentProps {
  onEdit: (id?: string) => void;
}

const Item: React.FC<ItemPropsExt> = ({ id, name, photoUrl, onEdit }) => {
  return (
    <IonItem onClick={() => onEdit(id)}>
      <IonAvatar slot="start">
        <img src={photoUrl} alt="profile pic" />
      </IonAvatar>
      <IonLabel>{name}</IonLabel>
    </IonItem>
  );
};

export default Item;
