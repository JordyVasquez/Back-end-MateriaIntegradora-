// Copyright 2017, Google, Inc.
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//    http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

'use strict';

const Storage = require('@google-cloud/storage');

const CLOUD_BUCKET = 'config-back-end';

const storage = Storage({
  projectId: 'config-back-end'
});
const bucket = storage.bucket(CLOUD_BUCKET);

// Returns the public, anonymously accessable URL to a given Cloud Storage
// object.
// The object's ACL has to be set to public read.
// [START public_url]
function getPublicUrl (filename) {
  return `https://storage.googleapis.com/${CLOUD_BUCKET}/${filename}`;
}
// [END public_url]

// Express middleware that will automatically pass uploads to Cloud Storage.
// req.file is processed and will have two new properties:
// * ``cloudStorageObject`` the object name in cloud storage.
// * ``cloudStoragePublicUrl`` the public url to the object.
// [START process]
function sendUploadToGCS (req_files) {

  if (!req_files) {
    return next();
  }
  const gcsname = Date.now() + req_files.originalname;
  const file = bucket.file(gcsname);

  const stream = file.createWriteStream({
    metadata: {
      contentType: req_files.mimetype
    }
  });
  stream.on('error', (err) => {
    req_files.cloudStorageError = err;
    console.log(err)
  });

  stream.on('finish', () => {
    req_files.cloudStorageObject = gcsname;
    file.makePublic().then(() => {
     req_files.cloudStoragePublicUrl = getPublicUrl(gcsname);
      console.log(req_files.cloudStoragePublicUrl)
    });
  });

  stream.end(req_files.buffer);
  return getPublicUrl(gcsname);
}
// [END process]

// Multer handles parsing multipart/form-data requests.
// This instance is configured to store images in memory.
// This makes it straightforward to upload to Cloud Storage.
// [START multer]

// [END multer]
const Multer = require('multer');
const multer = Multer({
  storage: Multer.MemoryStorage,
  limits: {
    fileSize: 400 * 1024 * 1024 // no larger than 5mb
  }
});

module.exports = {
  getPublicUrl,
  sendUploadToGCS,
  multer
};
