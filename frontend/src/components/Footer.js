// src/components/Footer.js
import React from 'react';
import { FaFacebook, FaInstagram, FaTiktok } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-8">
      <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center">
        <div className="mb-4 md:mb-0">
          <h4 className="text-lg font-bold">Importadora de Calzado CL</h4>
          <p>Conferencias 166, Galeria Antunez Oficina 52, Estacion Central</p>
          <p>Tel: +56 9 8474 8840</p>
        </div>
        <div className="flex space-x-4">
          <a
            href="https://www.facebook.com/profile.php?id=61570445080900"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-blue-500"
          >
            <FaFacebook className="text-2xl" />
          </a>
          <a
            href="https://www.instagram.com/importadoradecalzados.cl/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-pink-500"
          >
            <FaInstagram className="text-2xl" />
          </a>
          <a
            href="https://www.tiktok.com/@importadoradecalzado.cl"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-pink-500"
          >
            <FaTiktok className="text-2xl" />
          </a>
        </div>
      </div>
      <div className="mt-4 text-center text-sm">
        © {new Date().getFullYear()} Importadoradecalzado.cl Todos los derechos reservados.
      </div>
    </footer>
  );
};

export default Footer;
