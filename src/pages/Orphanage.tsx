import React, { useEffect, useState } from "react";
import { FiClock, FiInfo } from "react-icons/fi";
import { MapContainer, Marker, TileLayer } from "react-leaflet";
import {useParams} from 'react-router-dom';

import '../styles/pages/orphanage.css';
import Sidebar from "../components/Sidebar";
import mapIcon from "../utils/mapIcon";
import api from "../services/api";

interface Orphanage {
  latitude: number;
  longitude: number;
  name: string;
  about: string;
  instructions: string;
  opening_hours: string;
  open_on_weekends: string;
  images: Array<{
    id: number;
    url: string;
  }>
}

interface OrphanageParams {
  id: string
}

export default function Orphanage() {
  const params = useParams<OrphanageParams>()
  const [orphanageData, setOrphanageData] = useState<Orphanage>();
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  useEffect(() => {
    api.get(`orphanages/${params.id}`).then(response => {
      setOrphanageData(response.data);
    });
  }, [params.id]);

  if(!orphanageData) {
    return <p>Carregando...</p>
  }

  return (
    <div id="page-orphanage">
      <Sidebar />

      <main>
        <div className="orphanage-details">
          <img src={orphanageData.images[activeImageIndex].url} alt={orphanageData.name} />

          <div className="images">
            {
              orphanageData.images.map((image, index) => {
                return (
                  <button
                  key={image.id}
                  className={activeImageIndex === index ? "active" : ""}
                  type="button"
                  onClick={() => {
                    setActiveImageIndex(index);
                  }}
                >
                  <img src={image.url} alt={orphanageData.name} />
                </button>
                )
              })
            }
          </div>

          <div className="orphanage-details-content">
            <h1>{orphanageData.name}</h1>
            <p>{orphanageData.about}</p>

            <div className="map-container">
              <MapContainer
                center={[orphanageData.latitude, orphanageData.longitude]}
                zoom={16}
                style={{ width: '100%', height: 280 }}
                dragging={false}
                touchZoom={false}
                zoomControl={false}
                scrollWheelZoom={false}
                doubleClickZoom={false}
              >
                 <TileLayer
                  url={
                    `https://api.mapbox.com/styles/v1/mapbox/light-v10/tiles/256/{z}/{x}/{y}@2x?access_token=${process.env.REACT_APP_MAPBOX_TOKEN}`
                  }
                />
                <Marker interactive={false} icon={mapIcon} position={[orphanageData.latitude, orphanageData.longitude]} />
              </MapContainer>

              <footer>
              <a target="_blank" rel="noopener noreferrer" href={`https://google.com/maps/dir/?api=1&destination=${orphanageData.latitude},${orphanageData.longitude}`}>Ver rotas no Google Maps</a>
              </footer>
            </div>

            <hr />

            <h2>Instruções para visita</h2>
            <p>{orphanageData.instructions}</p>

            <div className="open-details">
              <div className="hour">
                <FiClock size={32} color="#15B6D6" />
                Segunda à Sexta <br />
                {orphanageData.opening_hours}
              </div>
              { orphanageData.open_on_weekends ? (
                <div className="open-on-weekends">
                  <FiInfo size={32} color="#39CC83" />
                  Atendemos <br />
                  Fim de Semana
                </div>
              ) : (
                <div className="open-on-weekends dont-open">
                  <FiInfo size={32} color="#ff669d" />
                  Não atendemos <br />
                  Fim de Semana
                </div>
              )}
            </div>

            {/* <button type="button" className="contact-button">
              <FaWhatsapp size={20} color="#FFF" />
              Entrar em contato
            </button> */}
          </div>
        </div>
      </main>
    </div>
  );
}