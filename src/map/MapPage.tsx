import {IonPage, IonHeader, IonToolbar, IonButtons, IonButton, IonTitle, IonContent} from "@ionic/react"
import React from "react";
import {MyMap} from "./MyMap";
import {RouteComponentProps} from "react-router";
interface MapPageProps extends RouteComponentProps<{
  lat: string;
  lng: string;
}> {
}
export const MapPage: React.FC<MapPageProps> = ({match}) => {
  return <IonPage>
    <IonHeader>
      <IonToolbar>
        <IonTitle>Map Page</IonTitle>
      </IonToolbar>
    </IonHeader>
    <IonContent>
      <MyMap
        lat={parseFloat(match.params.lat)}
        lng={parseFloat(match.params.lng)}
      />
    </IonContent>
  </IonPage>
}
