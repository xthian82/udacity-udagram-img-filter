import express from 'express';
import bodyParser from 'body-parser';
import {filterImageFromURL, deleteLocalFiles} from './util/util';

(async () => {

  // Init the Express application
  const app = express();

  // Set the network port
  const port = process.env.PORT || 8082;
  
  // Use the body parser middleware for post requests
  app.use(bodyParser.json());

  /**************************************************************************** */
  app.get("/filteredimage", async (req: express.Request, res: express.Response) => {
    const {image_url} = req.query;

    //    1. validate the image_url query
    if (!image_url) {
      return res.status(400)
          .send(`please specify a image_url`);
    }

    filterImageFromURL(image_url)
    .then((img) => {
        res.on('finish', () => deleteLocalFiles([img]));
        return res.status(201).sendFile(img);
    })
    .catch(err => {
        console.error(`unable to retrieve image, reason => ${err}`);
        return res.status(404).send('invalid image url');
    });
  });
  
  // Root Endpoint
  // Displays a simple message to the user
  app.get( "/", async ( req: express.Request, res: express.Response ) => {
    res.send("try GET /filteredimage?image_url={{}}")
  } );

  // Start the Server
  app.listen( port, () => {
      console.log( `server running http://localhost:${ port }` );
      console.log( `press CTRL+C to stop server` );
  } );
})();
