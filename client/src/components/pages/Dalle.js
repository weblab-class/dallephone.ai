// imports
import React, {useState, useEffect } from 'react'; 
import OpenAI from "openai";
import {get, post} from "../../utilities";

function getApiKey() {
  return get("/api/openaikey"); // Assuming 'get' returns a promise with the API key
}

/**
 * Generate new image
 *
 * Proptypes:
 * @param {string} prompt - we generate an image based on what this prompt is
 * @param {boolean} triggerFetch - helper variable, just makes sure we only generate one image (is set to false upon image generation)
 * @param {integer} original - id of which database of images this is a part of
 * @param {integer} addNewImage - adds image to a client-side array
 * 
 * @param {string} imageSrc - ends up storing URL of our Dalle generated image
 */

const Dalle = ({prompt, triggerFetch, original, addNewImage}) => {
    //Will change "image" variable into what Dalle generates from {prompt}
    
    const [imageSrc, setImageSrc] = useState("");

    useEffect(() => {
        if (triggerFetch) { //Only generate when "submit" has been hit
          getApiKey().then(apiKey => {
            const openai = new OpenAI({
              apiKey: apiKey.key,
              dangerouslyAllowBrowser: true
            });

            const fetchImage = async () => {
              try {
                const response = await openai.images.generate({
                  model: "dall-e-2",
                  prompt: prompt,
                  n: 1,
                  size: "1024x1024",
                });
                
                setImageSrc(response.data[0].url);
                console.log(imageSrc);
                const body = { original: original, content: imageSrc };
                post("/api/image", body).then((image) => {
                  addNewImage(prompt);
                });
              } catch (error) {
                console.error("Error fetching image:", error);
              }
            };
      
            fetchImage();

            
          });

          
        }
      }, [prompt, triggerFetch]); //update imageSrc on prompt and triggerFetch input
    
    return (
        <div>
          {imageSrc && <img src={imageSrc} alt="Generated from DALL-E" />}
        </div>
      );
};
export default Dalle;