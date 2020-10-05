'use strict';

const cloudant = require('../../../server/datastores/cloudant');

/**
 * Create a new database, it not existing.
 * @param {string} dbName - The database name.
 * @returns {Promise} - The Promise object representing the database creation or failure.
 */
function createDb(dbName) {
  return new Promise((resolve, reject) => {
    cloudant('database')
      .db.create(dbName)
      .then(() => {
        console.info(`Database was created successfully: ${dbName}`);
        return resolve();
      })
      .catch((err) => {
        if (err.statusCode !== 412) {
          console.error(err);
          return reject();
        }
        return resolve();
      });
  });
}

/**
 * List documents of a database.
 * @param {string} dbName - The database name.
 * @returns {Promise} - The Promise object representing the database creation or failure.
 */
const list = (dbName) => {
  return new Promise(async (resolve, reject) => {
    await createDb(dbName);
    cloudant('database')
      .db.use(dbName)
      .list({ include_docs: true })
      .then((data) => {
        const docs = [];
        if (data.rows) {
          data.rows.forEach((row) => {
            if (row.doc) {
              docs.push(row.doc);
            }
          });
          resolve(docs);
        }
      })
      .catch((err) => {
        reject(err);
      });
  });
};

/**
 * Find documents in a database, based on a selector object.
 * @param {string} dbName - The database name.
 * @param {Object} selector - The selector object with the criteria to find documents.
 * @returns {Promise} - The Promise object representing an array of the documents found or failure.
 */
const find = (dbName, selector = {}) =>
  new Promise(async (resolve, reject) => {
    await createDb(dbName);
    cloudant('database')
      .db.use(dbName)
      .find(selector)
      .then((data) => {
        resolve(data);
      })
      .catch((err) => {
        reject(err);
      });
  });

/**
 * Get documents from database view.
 * @param {string} dbName - The database name.
 * @param {string} designDoc - The design doc name, which contains the view.
 * @param {string} view - The view name.
 * @param {Object} params - The object with the params to query the view.
 * @returns {Promise} - The Promise object representing an array of the documents found or failure.
 */
const view = (dbName, designDoc, viewName, params = null) =>
  new Promise(async (resolve, reject) => {
    await createDb(dbName);
    if (!params) {
      params = {};
    }
    params.include_docs = true;

    cloudant('database')
      .db.use(dbName)
      .view(designDoc, viewName, params)
      .then((data) => {
        const docs = [];
        if (data.rows) {
          data.rows.forEach((row) => {
            if (row.doc) {
              docs.push(row.doc);
            }
          });
          resolve(docs);
        }
      })
      .catch((err) => {
        reject(err);
      });
  });

/**
 * Get a document from the database, based on the document id.
 * @param {string} dbName - The database name.
 * @param {string} id - The document id.
 * @returns {Promise} - The Promise object representing the document found or failure.
 */
const get = (dbName, id) =>
  new Promise(async (resolve, reject) => {
    await createDb(dbName);
    cloudant('database')
      .db.use(dbName)
      .get(id)
      .then((data) => resolve(data))
      .catch((err) => {
        reject(err);
      });
  });

/**
 * Insert a new document into the database.
 * @param {string} dbName - The database name.
 * @param {Object} doc - The document to be inserted. If _id is provided and not existing, new document
 * is inserted with that; otherwise, 409 conflict error is generated.
 * @returns {Promise} - The Promise object representing the result of the operation or failure.
 */
function insertDoc(dbName, doc) {
  return new Promise(async (resolve, reject) => {
    await createDb(dbName);
    // Delete _rev element, if existing, as it is not used to insert new documents
    if (doc._rev) {
      delete doc._rev; // eslint-disable-line no-param-reassign
    }
    cloudant('database')
      .db.use(dbName)
      .insert(doc)
      .then((data) => {
        resolve(data);
      })
      .catch((err) => {
        reject(err);
      });
  });
}

/**
 * Insert a new document into the database.
 * @param {string} dbName - The database name.
 * @param {Object} doc - The document to be inserted. If _id is provided and not existing, new document
 * is inserted with that; otherwise, 409 conflict error is generated.
 * @returns {Promise} - The Promise object representing the result of the operation or failure.
 */
const insert = (dbName, doc) => insertDoc(dbName, doc);

/**
 * Update an existing document in the database.
 * @param {string} dbName - The database name.
 * @param {Object} doc - The document to be updated. Element _id should be provided, otherwise it is an insert.
 * Element _rev should be provided ,otherwise 409 conflict error is generated.
 * @returns {Promise} - The Promise object representing the result of the operation or failure.
 */
function updateDoc(dbName, doc) {
  return new Promise(async (resolve, reject) => {
    await createDb(dbName);
    cloudant('database')
      .db.use(dbName)
      .insert(doc)
      .then((data) => {
        resolve(data);
      })
      .catch((err) => {
        reject(err);
      });
  });
}

/**
 * Update an existing document in the database.
 * @param {string} dbName - The database name.
 * @param {Object} doc - The document to be updated. Element _id should be provided, otherwise it is an insert.
 * Element _rev should be provided ,otherwise 409 conflict error is generated.
 * @returns {Promise} - The Promise object representing the result of the operation or failure.
 */
const update = (dbName, doc) => updateDoc(dbName, doc);

/**
 * Save a document in the database.
 * If _id is not provided, insert a new document.
 * If _id is provided and does not exist, insert a new document.
 * If _id is provided and exists, update an existing document.
 * @param {string} dbName - The database name.
 * @param {Object} doc - The document to be saved.
 * @returns {Promise} - The Promise object representing the result of the operation or failure.
 */
const save = (dbName, doc) =>
  new Promise(async (resolve, reject) => {
    await createDb(dbName);
    // If the doc to be saved has _id, check if a doc with the _id exists
    if (doc._id) {
      cloudant('database')
        .db.use(dbName)
        .get(doc._id)
        // If a doc with the _id exists, update it
        .then(() => resolve(updateDoc(dbName, doc)))

        .catch((err) => {
          // If a doc with the _id does not exist, insert as a new doc
          if (err.statusCode === 404) {
            resolve(insertDoc(dbName, doc));
          } else {
            reject(err);
          }
        });
    }
    // If doc to be inserted does not have _id, insert as a new doc
    else {
      resolve(insertDoc(dbName, doc));
    }
  });

/**
 * Delete a document from the database.
 * @param {string} dbName - The database name.
 * @param {string} id - The document id.
 * @returns {Promise} - The Promise object representing the result of the operation or failure.
 */
const remove = (dbName, id) =>
  new Promise(async (resolve, reject) => {
    await createDb(dbName);
    cloudant('database')
      .db.use(dbName)
      .get(id)
      .then((doc) => {
        cloudant('database')
          .db.use(dbName)
          .destroy(id, doc._rev)
          .then((data) => {
            resolve(data);
          })
          .catch((err) => {
            reject(err);
          });
      })
      .catch((err) => {
        reject(err);
      });
  });

module.exports = {
  list,
  find,
  view,
  get,
  insert,
  update,
  save,
  remove,
};
