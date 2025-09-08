"use client";

import { Marker, InfoWindow } from "@react-google-maps/api";
import { useState } from "react";

export default function MarkerWithInfoWindow({ position, infoWindowContent }) {
    const [showInfo, setShowInfo] = useState(false);

    return (
        <Marker
            position={{
                lat: position.lat,
                lng: position.lng,
            }}
            onMouseOver={() => setShowInfo(true)}
            onMouseOut={() => setShowInfo(false)}
        >
            {showInfo && (
                <InfoWindow
                    position={{
                        lat: position.lat,
                        lng: position.lng,
                    }}
                    options={{
                        disableAutoPan: true,
                    }}
                    onCloseClick={() => setShowInfo(false)}
                >
                    {infoWindowContent}
                </InfoWindow>
            )}
        </Marker>
    );
}
