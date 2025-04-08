// src/pages/HomePage.js
import React from 'react';
import { Link } from 'react-router-dom';

const HomePage = () => {
  return (
    <div className="container mx-auto px-4 py-6">
      {/* Sección Superior (Hero) */}
      <div className="relative w-full h-[500px] mb-8 overflow-hidden rounded-lg shadow-lg">
        <img
          src="/images/bannercortado.png"
          alt="Hero"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-30 flex flex-col justify-center items-center text-white">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">Bienvenido a Importadora de Calzado CL</h1>
          <p className="text-xl md:text-2xl mb-6">
            Calzado de alta calidad para tu día a día
          </p>
          <Link
            to="/productos"
            className="bg-white text-black px-6 py-3 rounded hover:bg-gray-200 text-lg font-semibold"
          >
            Ver Productos
          </Link>
        </div>
      </div>

      {/* Secciones Estilo Nike */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Imagen 1: Hombres */}
        <div className="relative w-full h-[400px] overflow-hidden rounded-lg shadow-lg group">
          <img
            src="/images/hombrecortado.png"
            alt="Hombres"
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-black bg-opacity-30 flex flex-col justify-center items-center text-white opacity-0 group-hover:opacity-100 transition-opacity">
            <h2 className="text-3xl font-bold mb-2">Hombre</h2>
            <Link
              to="/productos/hombres"
              className="bg-white text-black px-4 py-2 rounded hover:bg-gray-300"
            >
              Comprar
            </Link>
          </div>
        </div>

        {/* Imagen 2: Mujeres */}
        <div className="relative w-full h-[400px] overflow-hidden rounded-lg shadow-lg group">
          <img
            src="/images/mujercortado.png"
            alt="Mujeres"
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-black bg-opacity-30 flex flex-col justify-center items-center text-white opacity-0 group-hover:opacity-100 transition-opacity">
            <h2 className="text-3xl font-bold mb-2">Mujer</h2>
            <Link
              to="/productos/mujeres"
              className="bg-white text-black px-4 py-2 rounded hover:bg-gray-300"
            >
              Comprar
            </Link>
          </div>
        </div>
      </div>

      {/* Sección Inferior (Ofertas u otro) */}
      <div className="mt-8 relative w-full h-[300px] overflow-hidden rounded-lg shadow-lg group">
        <img
          src="/images/abajo.png"
          alt="Ofertas"
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-black bg-opacity-30 flex flex-col justify-center items-center text-white opacity-0 group-hover:opacity-100 transition-opacity">
          <h2 className="text-3xl font-bold mb-2">Ofertas</h2>
          <Link
            to="/productos?ofertas=true"
            className="bg-white text-black px-4 py-2 rounded hover:bg-gray-300"
          >
            Ver Ofertas
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
