'use strict';

/**
 * Module dependencies
 */

// Public node modules.
const _ = require('lodash');
const AWS = require('aws-sdk');

module.exports = {
  provider: 's3',
  name: 'Amazon Web Service S3',
  auth: {
    public: {
      label: 'Access API Token',
      type: 'text'
    },
    private: {
      label: 'Secret Access Token',
      type: 'text'
    },
    region: {
      label: 'Region',
      type: 'enum',
      values: [
        'us-east-1',
        'us-east-2',
        'us-west-1',
        'us-west-2',
        'ca-central-1',
        'ap-south-1',
        'ap-northeast-1',
        'ap-northeast-2',
        'ap-northeast-3',
        'ap-southeast-1',
        'ap-southeast-2',
        'cn-north-1',
        'cn-northwest-1',
        'eu-central-1',
        'eu-west-1',
        'eu-west-2',
        'eu-west-3',
        'sa-east-1'
      ]
    },
    bucket: {
      label: 'Bucket',
      type: 'text'
    }
  },
  init: (strapi, config) => {
    AWS.config.update({
      accessKeyId: config.auth.public,
      secretAccessKey: config.auth.private,
      region: config.auth.region
    });

    const S3 = new AWS.S3({
      apiVersion: '2006-03-01',
      params: {
        Bucket: config.auth.bucket
      }
    });

    return {
      upload: (file) => {
        return new Promise((resolve, reject) => {
          S3.upload(
            {
              Key: `${file.hash}.${file.ext}`,
              Body: new Buffer(file.buffer, 'binary'),
              ACL: 'public-read'
            },
            function(err, data) {
              if (err) {
                console.log(err);
                return reject(err);
              }

              file.url = data.Location;

              resolve();
            }
          );
        });
      },
      delete: (file) => {

      }
    };
  }
};
