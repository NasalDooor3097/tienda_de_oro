-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 15-05-2025 a las 21:47:03
-- Versión del servidor: 10.4.32-MariaDB
-- Versión de PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `24_kilates`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `admin`
--

CREATE TABLE `admin` (
  `id` int(11) NOT NULL,
  `user_name` varchar(50) NOT NULL,
  `email` varchar(50) NOT NULL,
  `password` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `admin`
--

INSERT INTO `admin` (`id`, `user_name`, `email`, `password`) VALUES
(1, 'Adm1n1str@d0r', 'Admin@gmail.com', 'Admin1.');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `direcciones`
--

CREATE TABLE `direcciones` (
  `id` int(11) NOT NULL,
  `id_user` int(11) NOT NULL,
  `calle` varchar(30) NOT NULL,
  `numero_exterior` varchar(30) NOT NULL,
  `colonia` varchar(30) NOT NULL,
  `ciudad` varchar(30) NOT NULL,
  `estado` varchar(30) NOT NULL,
  `codigo_postal` varchar(30) NOT NULL,
  `vivienda` varchar(30) NOT NULL,
  `numero_departamento` varchar(30) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `direcciones`
--

INSERT INTO `direcciones` (`id`, `id_user`, `calle`, `numero_exterior`, `colonia`, `ciudad`, `estado`, `codigo_postal`, `vivienda`, `numero_departamento`) VALUES
(1, 22, 'Privada Pablo Neruda', '110', 'dd', 'Tlaquepaque', 'Jal.', '45590', 'Casa', 'Nulo'),
(2, 22, 'francisco orozco numero', '66', 'ww', 'guadalajara', 'jalisco', '45590', 'Casa', 'Nulo'),
(3, 22, 'Privada Pablo Neruda', '110', 'ddasa', 'Tlaquepaque', 'Jal.', '45590', 'Casa', 'Nulo'),
(4, 23, 'Privada Pablo Neruda', '110', 'fff', 'Tlaquepaque', 'Jal.', '45590', 'Casa', 'Nulo');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `pedidos`
--

CREATE TABLE `pedidos` (
  `id_user` int(11) NOT NULL,
  `id_producto` int(11) NOT NULL,
  `tamaño` varchar(50) NOT NULL,
  `cantidad` int(11) NOT NULL,
  `direccion` varchar(100) NOT NULL,
  `tipo_pago` varchar(100) NOT NULL,
  `id` int(11) NOT NULL,
  `precio` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `pedidos`
--

INSERT INTO `pedidos` (`id_user`, `id_producto`, `tamaño`, `cantidad`, `direccion`, `tipo_pago`, `id`, `precio`) VALUES
(23, 115, '3333', 2, '333', 'tarjeta', 12, 66),
(12, 117, '', 2, '', 'tarjeta', 21, 44),
(22, 119, '', 4, '', 'tarjeta', 24, 17772),
(22, 0, '', 0, 'tfdc', 'tarjeta', 25, 0),
(22, 120, '', 1, '', 'tarjeta', 26, 222);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `productos`
--

CREATE TABLE `productos` (
  `id` int(20) UNSIGNED NOT NULL,
  `titulo` varchar(255) NOT NULL,
  `new_price` int(1) NOT NULL,
  `old_price` int(11) NOT NULL,
  `img1` longtext DEFAULT NULL,
  `Tipo` varchar(20) NOT NULL,
  `id_user` int(11) NOT NULL,
  `status` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `productos`
--

INSERT INTO `productos` (`id`, `titulo`, `new_price`, `old_price`, `img1`, `Tipo`, `id_user`, `status`) VALUES
(115, 'comida', 33, 2147483647, 'uploads/1732125980807.jpg', '', 23, 1),
(116, 'comida', 11111, 2147483647, 'uploads/1732162694322.jpg', '', 12, 1),
(120, 'comida', 222, 0, 'uploads/1747330151547.jpg', 'Zapatos', 22, 1),
(121, 'hello', 2332, 0, 'uploads/1747332715019.jpg', 'Ropa', 23, 1),
(122, 'rewr', 33, 0, 'uploads/1747334837566.jpeg', 'Zapatos', 22, 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tarjeta`
--

CREATE TABLE `tarjeta` (
  `id` int(11) NOT NULL,
  `cardnumber` int(11) NOT NULL,
  `cardname` varchar(20) NOT NULL,
  `expirydate` varchar(20) NOT NULL,
  `cvv` int(11) NOT NULL,
  `id_user` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `tarjeta`
--

INSERT INTO `tarjeta` (`id`, `cardnumber`, `cardname`, `expirydate`, `cvv`, `id_user`) VALUES
(4, 0, '', '', 0, 14),
(5, 0, '', '', 0, 14),
(8, 1234, 'hgj', '435', 345, 18),
(10, 2147483647, 'emiliano', '2027-02-12', 1221, 12),
(13, 2147483647, 'emiliano', '2029-02-22', 3323, 1),
(14, 2147483647, 'emiliao', '2009-06-15', 221, 22);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuarios`
--

CREATE TABLE `usuarios` (
  `id` int(11) NOT NULL,
  `password` varchar(50) NOT NULL,
  `user_name` varchar(50) NOT NULL,
  `email` varchar(30) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `usuarios`
--

INSERT INTO `usuarios` (`id`, `password`, `user_name`, `email`) VALUES
(12, 'Alberto', 'Alberto', 'Alberto'),
(22, 'Emi123', 'emilia', 'emiliano@gmail.com'),
(23, 'Emi123', 'emilio', 'emiliano123@gmail.com');

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `admin`
--
ALTER TABLE `admin`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `direcciones`
--
ALTER TABLE `direcciones`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `pedidos`
--
ALTER TABLE `pedidos`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_producto` (`id_producto`),
  ADD KEY `id_user` (`id_user`);

--
-- Indices de la tabla `productos`
--
ALTER TABLE `productos`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_user` (`id_user`);

--
-- Indices de la tabla `tarjeta`
--
ALTER TABLE `tarjeta`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `admin`
--
ALTER TABLE `admin`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT de la tabla `direcciones`
--
ALTER TABLE `direcciones`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT de la tabla `pedidos`
--
ALTER TABLE `pedidos`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=27;

--
-- AUTO_INCREMENT de la tabla `productos`
--
ALTER TABLE `productos`
  MODIFY `id` int(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=123;

--
-- AUTO_INCREMENT de la tabla `tarjeta`
--
ALTER TABLE `tarjeta`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- AUTO_INCREMENT de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=24;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `pedidos`
--
ALTER TABLE `pedidos`
  ADD CONSTRAINT `pedidos_ibfk_1` FOREIGN KEY (`id_user`) REFERENCES `usuarios` (`id`);

--
-- Filtros para la tabla `productos`
--
ALTER TABLE `productos`
  ADD CONSTRAINT `productos_ibfk_1` FOREIGN KEY (`id_user`) REFERENCES `usuarios` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
