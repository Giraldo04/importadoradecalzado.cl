// src/pages/AdminProductCreatePage.js
import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const AdminProductCreatePage = () => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState(0);
  const [countInStock, setCountInStock] = useState(0);
  const [category, setCategory] = useState('men');
  const [files, setFiles] = useState([]);
  const [sizesInput, setSizesInput] = useState('');
  const [colorsInput, setColorsInput] = useState('');
  const baseURL = process.env.REACT_APP_API_URL;

  const { userInfo } = useContext(AuthContext);
  const navigate = useNavigate();

  // Al seleccionar archivos, se agregan al array existente
  const handleFileChange = (e) => {
    const newFiles = Array.from(e.target.files);
    setFiles((prevFiles) => [...prevFiles, ...newFiles]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const timestamp = Math.floor(Date.now() / 1000);
      const folder = 'products';

      // 1. Obtener la firma desde el backend
      const signRes = await fetch(`${baseURL}/uploads/sign?timestamp=${timestamp}&folder=${folder}`);
      const { signature, apiKey, cloudName } = await signRes.json();

      // 2. Subir las imágenes directamente a Cloudinary
      const uploadedImageUrls = [];

      for (let file of files) {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('api_key', apiKey);
        formData.append('timestamp', timestamp);
        formData.append('signature', signature);
        formData.append('folder', folder);

        const cloudinaryRes = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
          method: 'POST',
          body: formData,
        });

        const data = await cloudinaryRes.json();
        uploadedImageUrls.push(data.secure_url);
      }

      // 3. Crear producto con las URLs de Cloudinary
      const productData = {
        name,
        description,
        price,
        countInStock,
        category,
        availableSizes: sizesInput.split(',').map(s => s.trim()).filter(Boolean),
        availableColors: colorsInput.split(',').map(c => c.trim()).filter(Boolean),
        images: uploadedImageUrls,
      };

      const res = await fetch(`${baseURL}/products`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userInfo.token}`,
        },
        body: JSON.stringify(productData),
      });

      const result = await res.json();
      if (res.ok) {
        navigate('/admin/productlist');
      } else {
        alert(result.message || 'Error al crear el producto');
      }

    } catch (error) {
      console.error('Error al crear el producto:', error);
      alert('Error al crear el producto. Revisa la consola.');
    }
  };

  return (
    <div className="max-w-md mx-auto p-4 bg-white rounded shadow mt-10">
      <h2 className="text-2xl font-bold mb-4">Crear Producto</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block font-semibold">Nombre</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border rounded p-2 mt-1"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block font-semibold">Descripción</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full border rounded p-2 mt-1"
            required
          ></textarea>
        </div>
        <div className="mb-4">
          <label className="block font-semibold">Precio</label>
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="w-full border rounded p-2 mt-1"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block font-semibold">Stock</label>
          <input
            type="number"
            value={countInStock}
            onChange={(e) => setCountInStock(e.target.value)}
            className="w-full border rounded p-2 mt-1"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block font-semibold">Subir Imágenes</label>
          <input
            type="file"
            name="images"
            multiple
            onChange={handleFileChange}
            className="w-full border rounded p-2 mt-1"
            required
          />
          {files.length > 0 && (
            <div className="mt-2">
              <p className="font-semibold">Archivos seleccionados:</p>
              <ul>
                {files.map((file, index) => (
                  <li key={index}>{file.name}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
        <div className="mb-4">
          <label className="block font-semibold">Categoría</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full border rounded p-2 mt-1"
            required
          >
            <option value="men">Hombres</option>
            <option value="women">Mujeres</option>
          </select>
        </div>
        <div className="mb-4">
          <label className="block font-semibold">Tallas Disponibles (separadas por comas)</label>
          <input
            type="text"
            value={sizesInput}
            onChange={(e) => setSizesInput(e.target.value)}
            className="w-full border rounded p-2 mt-1"
            placeholder="Ej.: 38, 39, 40"
          />
        </div>
        <div className="mb-4">
          <label className="block font-semibold">Colores Disponibles (separados por comas)</label>
          <input
            type="text"
            value={colorsInput}
            onChange={(e) => setColorsInput(e.target.value)}
            className="w-full border rounded p-2 mt-1"
            placeholder="Ej.: negro, blanco, rojo"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
        >
          Crear Producto
        </button>
      </form>
    </div>
  );
};

export default AdminProductCreatePage;
