import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonButtons,
  IonButton,
  IonTitle,
  IonContent,
  createAnimation, IonItem
} from "@ionic/react"
import React from "react";
import {MyMap} from "./MyMap";
import {RouteComponentProps} from "react-router";
interface MapPageProps extends RouteComponentProps<{
  lat: string;
  lng: string;
}> {
}
export const MapPage: React.FC<MapPageProps> = ({match}) => {
  React.useEffect(() => {
    const el = document.querySelector(".title");
    if (el) {
      const animation = createAnimation()
        .addElement(el)
        .duration(1000)
        .direction("alternate")
        .iterations(Infinity)
        .keyframes([
          { offset: 0, transform: "scale(3)", color: "cyan" },
          {
            offset: 1,
            transform: "scale(1.5)",
            color: "red"
          },
        ]);
      animation.play();
    }
  }, []);
  return <IonPage>
    <IonHeader>
      <IonToolbar>
        <IonTitle>Map Page</IonTitle>
      </IonToolbar>
    </IonHeader>
    <IonContent>
      <IonItem>
        <div
          style={{
            display: "flex",
            width: "100%",
            height: "50px",
            justifyContent: "center",
            alignItems: "center",
            fontSize: "10px",
          }}
        >
          <div className="title">Here you can view your map!</div>
        </div>
      </IonItem>
      <MyMap
        lat={parseFloat(match.params.lat)}
        lng={parseFloat(match.params.lng)}
      />
    </IonContent>
  </IonPage>
}
