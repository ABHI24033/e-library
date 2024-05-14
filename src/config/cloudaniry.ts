import {v2 as cloudinary} from 'cloudinary';
import { config } from './config';
          
cloudinary.config({ 
  cloud_name: config.cloudaniry_cloud, 
  api_key: config.cloudaniry_api_key, 
  api_secret: config.cloudinary_secret, 
});

export default cloudinary;