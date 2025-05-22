import React, {
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import "./SellProduct.css";
import { ShopContext } from "../../context/ShopContext";
import { FormContext } from "../../context/FormContext";
import { Link } from "react-router-dom";
import {
  AiOutlinePlusCircle,
  AiOutlineCamera,
  AiOutlineTag,
  AiOutlineDollar,
} from "react-icons/ai";
import Swal from "sweetalert2";

const CATEGORIES = [
  { value: "", label: "Sin categoría" },
  { value: "Tecnologia", label: "💻 Tecnología" },
  { value: "Ropa", label: "👗 Ropa" },
  { value: "Zapatos", label: "👠 Zapatos" },
  { value: "Accesorios", label: "💎 Oro y Joyas" },
  { value: "Perfumes", label: "🧴 Perfumes" },
  { value: "Juguetes", label: "🧸 Juguetes" },
  { value: "Otros", label: "📦 Otros" },
];

const SellProduct = () => {
  const [formData, setFormData] = useState({
    titulo: "",
    new_price: "",
    tipo: "",
  });
  const [imgFile, setImgFile] = useState(null);
  const [imgPreview, setImgPreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { userlist } = useContext(FormContext);
  const { addProduct } = useContext(ShopContext);

  // Validación de formulario jijijiijij
  const isFormValid = useMemo(() => {
    return formData.titulo.trim() && formData.new_price && imgFile;
  }, [formData.titulo, formData.new_price, imgFile]);

  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }, []);

  // Limpiar URL de vista previa al desmontar el componente
  useEffect(() => {
    return () => {
      if (imgPreview) URL.revokeObjectURL(imgPreview);
    };
  }, [imgPreview]);

  const handleImageChange = useCallback(
    (event) => {
      const file = event.target.files[0];
      if (!file) return;

      // Validar tipo de archivo
      if (!file.type.startsWith("image/")) {
        Swal.fire({
          icon: "error",
          title: "Tipo de archivo no válido",
          text: "Por favor, selecciona una imagen válida (JPEG, PNG, etc.)",
          confirmButtonColor: "#007bff",
        });
        return;
      }

   
      if (file.size > 30 * 1024 * 1024) {
        Swal.fire({
          icon: "error",
          title: "Archivo demasiado grande",
          text: "La imagen no debe superar los 30MB",
          confirmButtonColor: "#007bff",
        });
        return;
      }

      // Limpiar URL anterior si existe
      if (imgPreview) URL.revokeObjectURL(imgPreview);

      setImgFile(file);
      setImgPreview(URL.createObjectURL(file));
    },
    [imgPreview]
  );

  const handleAddProduct = useCallback(async () => {
    if (!isFormValid) {
      Swal.fire({
        icon: "warning",
        title: "Campos incompletos",
        text: "Por favor, completa todos los campos requeridos",
        confirmButtonColor: "#007bff",
      });
      return;
    }

    try {
      setIsSubmitting(true);

      // Mostrar confirmación antes de agregar
      const result = await Swal.fire({
        title: "¿Agregar producto?",
        text: "¿Estás seguro de que deseas agregar este producto (el admin debe aprobar el producto)?",
        icon: "question",
        showCancelButton: true,
        confirmButtonColor: "#007bff",
        cancelButtonColor: "#6c757d",
        confirmButtonText: "Sí, agregar",
        cancelButtonText: "Cancelar",
      });

      if (!result.isConfirmed) {
        setIsSubmitting(false);
        return;
      }

      // Crear promesas para cada operación de subida
      const uploadPromises = userlist.map((user) => {
        const formDataToSend = new FormData();
        formDataToSend.append("titulo", formData.titulo);
        formDataToSend.append("new_price", formData.new_price);
        formDataToSend.append("old_price", "");
        formDataToSend.append("photo", imgFile);
        formDataToSend.append("id_user", user.id);
        formDataToSend.append("tipo", formData.tipo);

        return addProduct(formDataToSend);
      });

      // Esperar a que todas las promesas se resuelvan
      await Promise.all(uploadPromises);

      await Swal.fire({
        icon: "success",
        title: "¡Producto agregado!",
        text: "El producto se ha agregado exitosamente",
        confirmButtonColor: "#007bff",
      });

      // Resetear formulario después de una subida exitosa
      setFormData({
        titulo: "",
        new_price: "",
        tipo: "",
      });
      setImgFile(null);
      setImgPreview(null);
    } catch (error) {
      await Swal.fire({
        icon: "error",
        title: "Error",
        text: "Ocurrió un error al agregar el producto",
        confirmButtonColor: "#007bff",
      });
      console.error("Error al agregar producto:", error);
    } finally {
      setIsSubmitting(false);
    }
  }, [formData, imgFile, userlist, addProduct, isFormValid]);

  // Formatear el precio con 2 decimales
  const formattedPrice = useMemo(() => {
    if (!formData.new_price) return "$0.00";
    return `$${parseFloat(formData.new_price).toFixed(2)}`;
  }, [formData.new_price]);

  // Obtener la etiqueta de la categoría seleccionada
  const selectedCategory = useMemo(() => {
    return (
      CATEGORIES.find((c) => c.value === formData.tipo)?.label ||
      "Sin categoría"
    );
  }, [formData.tipo]);

  return (
    <div className="sell-product-container">
      <h2 className="sell-product-title">
        <AiOutlinePlusCircle className="title-icon" />
        <span>Agregar Producto</span>
      </h2>

      <div className="sell-product-layout">
        <div className="sell-product-form">
          <div className="input-group">
            <label htmlFor="titulo" className="input-label">
              <AiOutlineTag className="input-icon" />
              Título
            </label>
            <input
              id="titulo"
              className="sell-product-input"
              onChange={handleInputChange}
              type="text"
              name="titulo"
              placeholder="Ingresa un título descriptivo"
              value={formData.titulo}
              required
            />
          </div>

          <div className="input-group">
            <label htmlFor="new_price" className="input-label">
              <AiOutlineDollar className="input-icon" />
              Precio
            </label>
            <input
              id="new_price"
              className="sell-product-input"
              onChange={handleInputChange}
              type="number"
              name="new_price"
              placeholder="Precio del producto"
              value={formData.new_price}
              min="0"
              step="0.01"
              required
            />
          </div>

          <div className="input-group">
            <label htmlFor="product-image" className="input-label">
              <AiOutlineCamera className="input-icon" />
              Imagen
            </label>
            <div className="file-input-container">
              <input
                className="file-input"
                onChange={handleImageChange}
                type="file"
                accept="image/*"
                id="product-image"
                required
              />
              <label htmlFor="product-image" className="file-input-label">
                {imgFile ? imgFile.name : "Seleccionar imagen"}
              </label>
            </div>
          </div>

          <div className="input-group">
            <label htmlFor="tipo" className="input-label">
              Categoría
            </label>
            <select
              id="tipo"
              className="sell-product-input"
              onChange={handleInputChange}
              name="tipo"
              value={formData.tipo}
            >
              {CATEGORIES.map((category) => (
                <option key={category.value} value={category.value}>
                  {category.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="sell-product-preview">
          {imgPreview ? (
            <div className="product-card">
              <div className="product-image-container">
                <img
                  src={imgPreview}
                  alt="Vista previa del producto"
                  className="product-image"
                />
              </div>
              <div className="product-info">
                <h3>{formData.titulo || "Título del producto"}</h3>
                <p className="product-price">{formattedPrice}</p>
                <p className="product-category">{selectedCategory}</p>
              </div>
            </div>
          ) : (
            <div className="preview-placeholder">
              <AiOutlineCamera size={48} />
              <p>Vista previa del producto</p>
              <span className="preview-hint">
                Sube una imagen para ver cómo se verá tu producto
              </span>
            </div>
          )}
        </div>
      </div>

      <button
        className={`sell-product-button ${!isFormValid ? "disabled" : ""}`}
        onClick={handleAddProduct}
        disabled={!isFormValid || isSubmitting}
      >

        {isSubmitting ? (
          <>Procesando...</>
        ) : (
          <>
            Agregar Producto <AiOutlinePlusCircle size={20} />
          </>
        )}
      </button>

    </div>
  );
};

export default SellProduct;
