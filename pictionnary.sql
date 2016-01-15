-- phpMyAdmin SQL Dump
-- version 4.2.11
-- http://www.phpmyadmin.net
--
-- Client :  localhost
-- Généré le :  Mer 13 Janvier 2016 à 09:00
-- Version du serveur :  5.6.21
-- Version de PHP :  5.6.3

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- Base de données :  `pictionnary`
--

-- --------------------------------------------------------

--
-- Structure de la table `drawings`
--

CREATE TABLE IF NOT EXISTS `drawings` (
`id` int(11) NOT NULL,
  `id_user` int(11) NOT NULL,
  `commands` blob NOT NULL,
  `dessin` blob NOT NULL,
  `nom` varchar(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Structure de la table `users`
--

CREATE TABLE IF NOT EXISTS `users` (
`id` int(11) NOT NULL,
  `email` varchar(65) NOT NULL,
  `password` varchar(65) NOT NULL,
  `nom` varchar(65) DEFAULT NULL,
  `prenom` varchar(65) DEFAULT NULL,
  `tel` varchar(16) DEFAULT NULL,
  `website` varchar(65) DEFAULT NULL,
  `sexe` char(1) DEFAULT NULL,
  `birthdate` date NOT NULL,
  `ville` varchar(65) DEFAULT NULL,
  `taille` float DEFAULT NULL,
  `couleur` char(6) DEFAULT '000000',
  `profilepic` blob
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

--
-- Index pour les tables exportées
--

--
-- Index pour la table `drawings`
--
ALTER TABLE `drawings`
 ADD PRIMARY KEY (`id`);

--
-- Index pour la table `users`
--
ALTER TABLE `users`
 ADD PRIMARY KEY (`id`), ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT pour les tables exportées
--

--
-- AUTO_INCREMENT pour la table `drawings`
--
ALTER TABLE `drawings`
MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT pour la table `users`
--
ALTER TABLE `users`
MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
