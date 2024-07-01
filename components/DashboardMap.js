import React, { useState, useEffect, useCallback } from 'react';
import { MapContainer, TileLayer, GeoJSON, useMap, Marker, Tooltip } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import MarkerIcon from './MarkerIcon'

export default function Map({token, groupID, user}) {


  const [selected, setSelected] = useState({});
  const [data, setData] = useState(null);
  const [_, setkenyaData] = useState(null);
  const [center, setCenter] = useState(null)
  const [zoom, setZoom] = useState(null)

  let countryBounds = [
    [
        33.907219,
        -4.669618
    ],
    [
        41.90516700000012,
        -4.669618
    ],
    [
        41.90516700000012,
        4.622499
    ],
    [
        33.907219,
        4.622499
    ],
    [
        33.907219,
        -4.669618
    ]
];

countryBounds = countryBounds.map(arr => arr.reverse())

  let mapRef;
  
  function style() {
    return {
       fillColor: '#F0754581', // getColor(feature.properties.COUNT),
      weight: 1,
      opacity: 1,
      color: "#ff5733",
      dashArray: "2",
      fillOpacity: 0.8,
    };
  }

  async function GetBoundaries(admlevel, target) {
    try {
      if (admlevel == "bigcountry") {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/gis/country_borders/?code=KEN`, {
          headers: {
            'Accept': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error(`Error: ${response.status} - Unable to fetch boundaries`);
        }

        var geodata = await response.json();
        geodata.results.features.forEach(feature => {
          feature.properties.admlevel = "country";
        });

        setData(geodata.results);
      }
      else if (admlevel == "country") {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/gis/drilldown/country/`, {
          headers: {
            'Accept': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error(`Error: ${response.status} - Unable to fetch boundaries`);
        }
        var geodata = await response.json();

        geodata.geojson.features.forEach(feature => {
          feature.properties.admlevel = "county";
        });


        setData(geodata.geojson);
      }

      else if (admlevel == "county" && target?.feature?.id) {


        if(groupID == 1) {

          const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/gis/drilldown/country/`, {
            headers: {
              'Accept': 'application/json',
              'Authorization': `Bearer ${token}`
            }
          });
  
          if (!response.ok) {
            throw new Error(`Error: ${response.status} - Unable to fetch boundaries`);
          }
          
           const counties = await response.json();


           const countyCenter = counties?.geojson?.features?.find(({id}) => id == target.feature.id)?.properties?.center?.coordinates?.reverse()


           setCenter(countyCenter)
           setZoom(11.3)

        }

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/gis/drilldown/county/${target.feature.id}/`, {
          headers: {
            'Accept': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error(`Error: ${response.status} - Unable to fetch boundaries`);
        }

        const geodata = await response.json();

        geodata.geojson.features.forEach(feature => {
          feature.properties.admlevel = "constituency";
        });

        if(groupID == 2) {
          
         const constituency = geodata?.geojson?.features?.find(({properties}) => properties?.name?.toLowerCase().trim() == user?.user_sub_counties[0]?.sub_county_name?.toLowerCase().trim())
         
         setData(constituency ?? geodata?.geojson)
         setZoom(12.3)
         setCenter(constituency?.properties?.center?.coordinates?.reverse())

        }
        else{
      
        
        setData(geodata.geojson);
      }
      }
      else if (admlevel == "constituency" && target?.feature?.id) {

        // if(groupID == 2) {

        //   const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/gis/drilldown/county/${target.feature.id}/`, {
        //     headers: {
        //       'Accept': 'application/json',
        //       'Authorization': `Bearer ${token}`
        //     }
        //   });
  
        //   if (!response.ok) {
        //     throw new Error(`Error: ${response.status} - Unable to fetch boundaries`);
        //   }

        //    const constituencies = await response.json();

        //    const constituencyCenter = constituencies?.geojson?.features?.find(({id}) => id == target.feature.id)?.properties?.center?.coordinates?.reverse()


        //    setCenter(constituencyCenter)
        //    setZoom(11.3)

        // }

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/gis/drilldown/constituency/${target.feature.id}/`, {
          headers: {
            'Accept': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error(`Error: ${response.status} - Unable to fetch boundaries`);
        }

        const geodata = await response.json();
        
        geodata.geojson.features.forEach(feature => {
          feature.properties.admlevel = "ward";
        });

        setData(geodata.geojson);
      }
      else if (admlevel == "ward" && target?.feature?.id) {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/gis/facility_coordinates/?ward=${target?.feature?.properties?.area_id}`, {
          headers: {
            'Accept': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });

        

        if (!response.ok) {
          throw new Error(`Error: ${response.status} - Unable to fetch boundaries`);
        }

        const geodata = await response.json();


        setData(
          {
            features:  geodata?.results?.map(({id, coordinates, facility}) => ({
              id,
              properties: {
                center: coordinates,
                facility
              }
            }))
         
         }
        );


      }
     
      else {
        setData({});
      }

    } catch (error) {
      console.error('Error fetching boundaries:', error);
      setData({});
      throw error;
    }
  }

//   async function getFacilityName(facilityId) {
//      return  await (await fetch(`${process.env.NEXT_PUBLIC_API_URL}/facilities/facilities/${facilityId}/`,{
//           headers: {
//             'Accept': 'application/json',
//             'Authorization': `Bearer ${token}`
//           }
//         }))?.json()
//   }


  useEffect(() => {
    
    if (groupID == 2) {
        GetBoundaries("county", {
        feature: {
          id: user?.user_counties[0]?.county_code
        }
    })
    return
    }
    else if (groupID == 1) {
      GetBoundaries("county", {
          feature: {
            id: user?.user_counties[0]?.county_code
          }
      })
      return
    } 
    else if (groupID == 7 || groupID == 5) {
      GetBoundaries("country", "");
      setCenter([0.5, 38])
      setZoom(7.3)
      return
    } 
    else {
      GetBoundaries("country", "");
      setCenter([0.5, 38])
      setZoom(7.3)
      return

    }

  }, []);


  const FeatureHandler = useCallback(() => {

    const map = useMap();
     
    mapRef=map

    const handleMouseOver = useCallback((e) => {

      const layer = e.layer;
      
      layer.setStyle({
        weight: 2,
        color: "#DF1995",
        dashArray: "3",
        fillOpacity: 1
      });
    
    });

    const resetHighlight = useCallback((e) => {
      
      setSelected({});
      e.layer.setStyle(style());
    });

    const handleClick = useCallback((e) => { 
      
      map.fitBounds(e.layer.getBounds());
      if (e.layer.feature.properties.admlevel) {
        if (e.layer.feature.properties.admlevel=="bigcountry") {
          setkenyaData(data)
        }
        GetBoundaries(e.layer.feature.properties.admlevel, e.layer)
       

        map.eachLayer((layer) => {
        if (layer instanceof L.TileLayer) {
          return; // Skip the base tile layer
        }
        map.removeLayer(layer);
      })

      // Create a new GeoJSON layer and add it to the map
      const geojsonLayer = L.geoJSON(data).addTo(map);

      // Fit the map view to the bounds of the new GeoJSON layer
      map.fitBounds(geojsonLayer.getBounds());
      }

      
    });

  
    return (
      <>
      {/* onEachFeature={onEachFeature} */}

        {data && <GeoJSON data={data} style={style} eventHandlers={{ click: handleClick ,mouseover:handleMouseOver, mouseout:resetHighlight}}  />}
        {
        data && data?.features?.map(({id, properties}) => (
          <Marker
            key={id}
            position={[properties?.center?.coordinates[1], properties?.center?.coordinates[0]]}
            icon={MarkerIcon}
          >
            
            
             <Tooltip>
               <p className='font-semibold'>{properties?.name ?? properties?.center?.coordinates.reverse().join(", ")}</p>
              </Tooltip>

              
           </Marker>
          )
        )
        }
      </>
    );
  })


  return (
    <div className="panel w-[90vw] md:w-[85vw]">
      <div className="panel__map">
        <button
          onClick={() => {
            if (mapRef) {
              GetBoundaries("country", "")
              setCenter([0.5, 38])
              setZoom(7.3)
              mapRef.flyToBounds(countryBounds);
            }
          }}
          className="full-extent"
        >
          {/* Full Extent */}
        </button>
        {!selected.province && (
          <div className="hover-info">zoom out</div>
        )}

      

       {
        center &&
             
        <MapContainer
          style={{ height: "100%", width: "100%", position: 'relative', zIndex: '1', backgroundColor: '#e7eae8', padding: '15px' }}
          zoom={zoom} // county: 11.3, country: 7.3
          zoomControl={false}
          maxZoom={14}
          center={center} // country: [0.5, 38]
          scrollWheelZoom={false}
           
        >
          <TileLayer
            attribution="Map tiles by Carto, under CC BY 3.0. Data by OpenStreetMap, under ODbL."
            url="https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png"
            // url="http://{s}.tile.osm.org/{z}/{x}/{y}.png"
          />
           
            <FeatureHandler />
        </MapContainer>
      }
      </div>
    </div>
  );
}

