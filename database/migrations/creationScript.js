const pool = require('../connection');
const sqlFunctions = require('../../utils/sqlFunctions');
const { Pool } = require('pg');

const queries = [
	`CREATE TYPE statut AS ENUM ('en attente', 'pris en charge', 'confirme');

	CREATE TABLE IF NOT EXISTS roles(
	id VARCHAR(5) PRIMARY KEY,
	libelle VARCHAR(50) NOT NULL
);

CREATE TABLE IF NOT EXISTS type_utilisateur(
	id SERIAL PRIMARY KEY,
	libelle VARCHAR(50) NOT NULL,
	user_roles_id VARCHAR(5) NOT NULL REFERENCES roles(id)
);

CREATE TABLE IF NOT EXISTS utilisateur(
	id VARCHAR(50) PRIMARY KEY,
	username VARCHAR(250) NOT NULL,
	mdp VARCHAR(250) NOT NULL,
	nom VARCHAR(150) NOT NULL,
	prenom VARCHAR(150) NOT NULL,
	tel VARCHAR(20) NOT NULL,
	email VARCHAR(40),
	id_type_utilisateur INT NOT NULL REFERENCES type_utilisateur(id)
);

CREATE TABLE IF NOT EXISTS user_location(
	id VARCHAR(50) PRIMARY KEY,
	longitude DECIMAL(9,6) NOT NULL,
	latitude DECIMAL(9,6) NOT NULL,
	timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	id_utilisateur VARCHAR(50) NOT NULL REFERENCES utilisateur(id)
);

CREATE TABLE IF NOT EXISTS fournisseur_info(
	id VARCHAR(50) PRIMARY KEY,
	id_utilisateur VARCHAR(50) NOT NULL REFERENCES utilisateur(id),
	nom_organisation VARCHAR(60) NOT NULL
);

CREATE TABLE IF NOT EXISTS chauffeur_info(
	id VARCHAR(50) PRIMARY KEY,
	id_utilisateur VARCHAR(50) NOT NULL REFERENCES utilisateur(id),
	nom_organisation VARCHAR(60) NOT NULL
);

CREATE TABLE IF NOT EXISTS type_produits(
	id SERIAL PRIMARY KEY,
	libelle VARCHAR(50) NOT NULL
);

CREATE TABLE IF NOT EXISTS produits(
	id SERIAL PRIMARY KEY,
	libelle VARCHAR(50) NOT NULL,
	id_type_produit INTEGER NOT NULL REFERENCES type_produits(id)
);

CREATE TABLE IF NOT EXISTS marchandises(
	id VARCHAR(50) PRIMARY KEY,
	libelle VARCHAR(80) NOT NULL,
	quantite INTEGER,
	poids DECIMAL,
	id_produits INTEGER NOT NULL REFERENCES produits(id)
);

CREATE TABLE IF NOT EXISTS request(
	id VARCHAR(50) PRIMARY KEY,
	libelle VARCHAR(200),
	re_statut statut,
	id_client VARCHAR(50) NOT NULL REFERENCES utilisateur(id),
	id_marchandise VARCHAR(50) NOT NULL REFERENCES marchandises(id),
	accepted_by VARCHAR(50) NOT NULL
);

CREATE TABLE IF NOT EXISTS vehicule(
	id SERIAL PRIMARY KEY,
	marque VARCHAR(15) NOT NULL,
	immatriculation VARCHAR(10) NOT NULL,
	capacite INTEGER NOT NULL,
	cout_location NUMERIC(20,3) NOT NULL
);

CREATE TABLE IF NOT EXISTS commande(
	id VARCHAR(50) PRIMARY KEY,
	id_request VARCHAR(50) NOT NULL REFERENCES request(id),
	id_vehicule INTEGER NOT NULL REFERENCES vehicule(id),
	id_chauffeur VARCHAR(50) NOT NULL,
	cout_livraison NUMERIC(20,3) NOT NULL
);`];

const executeQuery = async (query, pool) => {
	try {
		const results = await pool.query({
			text: query,
		});
	} catch (error) {
		console.log('error:', error)
	}

	await pool.end();
};

const runMigrations = async () => {
	try {
		/*for (let query of createTables) {
			console.log(query)
			await executeQuery(query);
		}

		console.log('All tables create successfully');*/
		await migrationFunction();
	} catch (error) {
		console.log('error:', error);
	}
};

const createDatabase = async () => {
	try {
		const databaseExist = await sqlFunctions.checkIfDatabaseExists('transport_db');
		if (!databaseExist) {
			const query = 'CREATE DATABASE transport_db';
			const result = await pool.query(query);
			//console.log(result);
			if (result) return true
		}
	} catch (error) {
		console.log(error)
	}
}

const createTablesFunction = async () => {

	const newDbPool = new Pool({
		user: 'postgres',
		password: 'root',
		host: 'localhost',
		port: 5432,
		database: 'transport_db'
	})

	for (let query of queries) {
		await executeQuery(query, newDbPool)
	}
	console.log('All tables create successfully');
}

const migrationFunction = async () => {
	try {
		await createDatabase();
		const isDatabaseCreated = await sqlFunctions.checkIfDatabaseExists('transport_db');
		if (isDatabaseCreated) await createTablesFunction();
	} catch (error) {
		console.log(error)
	}
}

runMigrations();