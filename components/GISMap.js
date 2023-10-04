// import Link from "next/link";
import React, { useState, useEffect, useRef, useMemo } from "react";
import { MapContainer, Marker, Popup, TileLayer, GeoJSON, useMapEvents, useMap } from "react-leaflet";
import MapData from "../assets/maps/counties.min.json";
//import iconGreen from "../assets/css/images/marker-icon.png";
//import iconBlue from "../assets/css/images/marker-icon-blue.png";
// import MapCenters from "../assets/maps/county-centers-coordinates";
import Box from "@mui/material/Box";
//import { useRouter } from "next/router";
import L, { Layer, Map,bounds,map } from "leaflet";
import { center } from "@turf/turf";
// import { iconPerson } from "./icon";

const GISMap = ({ data,iconColor,kephLevel,geoJSON}) => {

  const [geoJSON, setGeoJSON] = useState(MapData);
  const [markerColor, setMarkerColor] = useState([]); //instantiate color state
  const [selectedFeature, setSelectedFeature]=useState('');
  const mapRef = useRef(kephLevel);
  //const markerMemo = useMemo(newMemo,memo);
  
  let customIcon;
  // const zoomLayer= document.querySelector(geoJSON);
  // Zlayer=[zoomLayer];

  const iconSet = (iconUrl) =>{
    return new L.Icon({
      iconUrl: iconUrl,
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
    });
  }
  const iconGreen = "assets/css/images/marker-icon.png";
  const iconBlue = "assets/css/images/marker-icon-blue.png";

  const greenIcon = iconSet(iconGreen);
  const blueIcon = iconSet(iconBlue);

  console.log("selected keph:", kephLevel);

  switch (kephLevel) {
    case "Level 2":
      customIcon = greenIcon;
      break;
    case "Level 3":
      customIcon = greenIcon;
      break;
    case "Level 4":
      customIcon = greenIcon;
      break;
    case "Level 5":
      customIcon = blueIcon;
      break;
    case "Level 6":
      customIcon = blueIcon;
      break;
    default:
      customIcon = blueIcon;
      break;
  }
  
  useEffect(() => {

    setMarkerColor(customIcon);
    if(iconColor !==null){
      console.log("marker properties is:", iconColor,"path", customIcon ,"&", markerColor);
    }
    localStorage.setItem('customIcon',JSON.stringify({customIcon}));

  }, [kephLevel]);

  const handleMarkerClick = () =>{
    console.log("selected marker is:", markerColor);
  };

  const geoJsonStyles = {
    color: "#000",
    weight: 1,
    fillColor: "#46f",
    fillOpacity: 0.3,
  };
  useEffect(() => {
    let mtd = true;
    if (mtd) {
      setGeoJSON(MapData);
    }
    return () => {
      mtd = false;
    };
  }, []);
  const onEachFeature = (feature, layer) => {
    const map =useMap();
    //map.setView((facility.lat_long[0], facility.lat_long[1]), 9 );
    layer.bindPopup(
      `<div className="p-3 w-20 flex flex-col items-start justify-center"><h3>${feature.properties["AREA_CODE"]}. ${feature.properties["AREA_NAME"]} COUNTY</h3></div>`
    );
    layer.setStyle({ opacity: Math.random() });
    layer.options.opacity = Math.random();
    layer.options.fillColor = feature.properties.fill;
    // layer.options.fillOpacity = feature.properties.fill_opacity
    layer.options.name= feature.properties["AREA_NAME"];
    layer.on({
      dblclick: (e) => {
        // layer.setStyle({
        //     color: '#000'
        // })
        const bounds = layer.getBounds();
        const center = bounds.getCenter();
        map.flyTo(center,15.7);

        setSelectedFeature(layer.options.name);
        console.log("mouse_coordinates:",center,"mouse_Area:", selectedFeature);
      },

      click: (e) => {
        map.flyTo([0.500089, 37.477222],6.899);
      },

      // mouseover: (e)=>{
        
      //   // const areaName = bounds.feature.properties["AREA_NAME"];
      // },
      // mouseout:(e)=>{

      // }
    });
    layer.properties = feature.properties;
  };

  if (data && data.length > 0) {
    return (
      <>
<<<<<<< HEAD
        <MapContainer
          center={[-0.818389, 37.477222]}
          zoom={5.899}
          maxZoom={9.7886}
=======
        <MapContainer 
          className="map"
          center={[0.500089, 37.477222]}
          zoom={6.899}
          maxZoom={15.7}
>>>>>>> 64401171 (GIS updates)
          scrollWheelZoom={false}
          touchZoom={false}
          style={{
            height: "100%",
            width: "100%",
            position: "relative",
            zIndex: "1",
            backgroundColor: "#e7eae8",
            padding: "15px",
          }}
          // eventHandlers={{mouseover : hoverHandler}}
        >
          <TileLayer
            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            url="http://{s}.tile.osm.org/{z}/{x}/{y}.png"
          />
          <GeoJSON
            data={geoJSON}
            key={geoJSON}
            stylez={geoJsonStyles}
            onEachFeature={onEachFeature}
          />
          {console.log({data})}
          {data.map((facility, i) => {
            if (
              facility &&
              facility?.lat_long &&
              facility?.lat_long.length > 0
            ) {
              facility.op_stat =
                facility?.operation_status_name || facility?.status_name;
              return (
                <Marker
                  position={[facility.lat_long[0], facility.lat_long[1]]}
                  key={facility.id}
                  icon={customIcon}
                  // icon={markerColor}
                  eventHandlers={{ click: handleMarkerClick}}
                >
          
                  <Popup>
                    <div className="flex flex-col items-center">
                      <a
                        href={`/${
                          facility?.facility != undefined &&
                          facility?.name.includes("unit") &&
                          facility?.facility_name != null
                            ? "community-units"
                            : "facilities"
                        }/${facility.id}`}
                        className="text-base uppercase font-semibold text-blue-700 hover:text-black focus:text-black active:text-black"
                      >
                        <span>{facility.official_name || facility.name}</span>
                      </a>

                      <Box sx={{ pt: 2 }} />
                      <div className="text-base flex gap-2 w-full justify-between border-t py-2 items-center">
                        <h4 className="text-gray-400 text-sm">Code</h4>
                        <h4 className="text-gray-400 text-sm">Owner</h4>
                        <h4 className="text-gray-400 text-sm">Facility Type</h4>
                      </div>

                      <div className="text-base flex gap-2 w-full justify-between  items-center">
                        <h4 className="text-base font-bold text-black flex gap-1">
                          <small className="text-gray-400 text-sm">#</small>
                          {facility?.code || "No code"}
                        </h4>
                        <h4 className="text-base font-bold text-black flex gap-1">
                          <small className="text-gray-400 text-sm">#</small>
                          {facility?.owner_name || "Owner"}
                        </h4>
                        <h4 className="text-base font-bold text-black flex gap-1">
                          <small className="text-gray-400 text-sm">#</small>
                          {facility?.facility_type_name || "Type"}
                        </h4>
                      </div>
                      <Box sx={{ pt: 1 }} />

                      <div className="text-base flex gap-2 w-full justify-between border-t py-2 items-center">
                        {/* <h4 className="text-gray-400 text-sm">Owner</h4> */}
                        {/* <h4 className="text-gray-400 text-sm">Facility Type</h4> */}
                        <h4 className="text-gray-400 text-sm">longitude</h4>
                        <h4 className="text-gray-400 text-sm">latitude</h4>
                        <h4 className="text-gray-400 text-sm" />
                        {/* <h4 className="text-base font-bold text-black flex gap-1">
                          <small className="text-gray-400 text-sm">#</small>
                          {facility?.ward || "No Ward"}
                        </h4> */}
                      </div>
                      <div className="text-base flex gap-2 w-full justify-between border-t py-2 items-center">
                        {/*< h4 className="text-base font-bold text-black flex gap-1">
                          <small className="text-gray-400 text-sm">#</small>
                          {facility?.owner_name || "Owner"}
                      </h4> */}
                        {/*<h4 className="text-base font-bold text-black flex gap-1">
                          <small className="text-gray-400 text-sm">#</small>
                          {facility?.facility_type_name || "Type"}
                    </h4> */}
                        <h4 className="text-base font-bold text-black flex justify-start space-x-4 w-full gap-3">
                          <small className="text-gray-400 text-sm"></small>
                          <span>{facility?.lat_long[0] || "longitude"}</span>
                          <span>{facility?.lat_long[1] || "latitude"}</span>
                        </h4>
                      </div>
                    </div>
                  </Popup>
                </Marker>
              );
            }
          })}
        </MapContainer>
      </>
    );
  } else {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <h1 className="text-2xl font-bold text-gray-600">
          No facilities found
        </h1>
      </div>
    );
  }
};

export default GISMap;