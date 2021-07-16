import { MapContainer, Marker, Popup, TileLayer, GeoJSON } from 'react-leaflet'
import MapData from '../assets/maps/counties.min.json'
import MapCenters from '../assets/maps/county-centers-coordinates'

const Map = ({ operational, lat, long, name, code }) => {
    return (
        <MapContainer center={[-0.818389, 37.477222]} zoom={6.499} maxZoom={15.70} scrollWheelZoom={false} touchZoom={false} style={{ height: 650, width: "100%" }}>
            <TileLayer attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors' url='http://{s}.tile.osm.org/{z}/{x}/{y}.png'  />
            <GeoJSON data={MapData} key={MapData} style={`color: '#006400'; weight: 5; opacity: 0.65;`} />
            <Marker position={[lat, long]}>
                <Popup>
                    <div className="flex flex-col items-center">
                        <h4 className="text-sm font-medium text-black">{name}</h4>
                        <div className="text-base flex gap-2 w-full justify-between border-t py-2 items-center">
                            <h4 className="text-base font-bold text-black flex gap-1"><small className="text-gray-400 text-sm">#</small>{code}</h4>
                            <span className={"text-sm font-medium drop-shadow-sm rounded leading-none p-1 px-3"+(operational.toString().toLowerCase() == "operational" ? "text-black bg-green-300" : "text-gray-900 bg-gray-200")}>{" "+operational.toString()+" "}</span>
                        </div>
                    </div>
                </Popup>
            </Marker>
        </MapContainer>
    )
}

export default Map