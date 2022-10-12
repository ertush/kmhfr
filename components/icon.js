import L from "leaflet";

const iconPerson = new L.Icon({
  iconUrl: "../assets/css/images/marker-icon.png",
  //   iconRetinaUrl: require("../assets/css/images/marker-icon.png"),
  iconAnchor: null,
  popupAnchor: null,
  shadowUrl: null,
  shadowSize: null,
  shadowAnchor: null,
  iconSize: new L.Point(30, 40),
  className: "leaflet-divs-icon",
});

export { iconPerson };
