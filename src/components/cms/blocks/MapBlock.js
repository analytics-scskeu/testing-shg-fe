"use client";

import { GoogleMap, LoadScript } from "@react-google-maps/api";
import MarkerWithInfoWindow from "@/components/map/MarkerWithInfoWindow";

export default function MapBlock({ ...props }) {
    const locations = JSON.parse(props["data-locations"] || "[]");

    if (!locations.length) {
        return null;
    }

    return (
        <div className={"mb-8"}>
            <LoadScript googleMapsApiKey={process.env.GOOGLE_MAP_API_KEY}>
                <GoogleMap
                    mapContainerStyle={{
                        width: "100%",
                        height: "400px",
                    }}
                    center={{
                        lat: locations[0].position.latitude,
                        lng: locations[0].position.longitude,
                    }}
                    zoom={8}
                >
                    {locations.map((location, index) => (
                        <MarkerWithInfoWindow
                            key={index}
                            position={{
                                lat: location.position.latitude,
                                lng: location.position.longitude,
                            }}
                            infoWindowContent={
                                <div className={"text-md font-bold"}>
                                    {location.location_name || `Location ${index + 1}`}
                                </div>
                            }
                        />
                    ))}
                </GoogleMap>
            </LoadScript>
        </div>
    );
}
