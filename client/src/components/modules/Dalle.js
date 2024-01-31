// imports
import React, { useState, useEffect } from "react";
import OpenAI from "openai";
import { get, post } from "../../utilities";

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
 * @param {string} game_id - game id
 * @param {boolean} shouldDisplay - helper variable, just makes sure we only display one image (is set to false upon image generation)
 *
 * @param {string} imageSrc - ends up storing URL of our Dalle generated image
 */

const Dalle = ({ prompt, triggerFetch, original, addNewImage, game_id, shouldDisplay = true }) => {
  //Will change "image" variable into what Dalle generates from {prompt}
  // console.log("DALLE PROMPT", prompt);
  const [imageSrc, setImageSrc] = useState("");

  useEffect(() => {
    if (triggerFetch) {
      //Only generate when "submit" has been hit
      getApiKey().then((apiKey) => {
        const openai = new OpenAI({
          apiKey: apiKey.key,
          dangerouslyAllowBrowser: true,
        });

        const fetchImage = async () => {
          try {
            const response = await openai.images.generate({
              model: "dall-e-2",
              prompt: prompt,
              n: 1,
              size: "1024x1024",
            });

            const newImageSrc = response.data[0].url;
            setImageSrc(newImageSrc);

            // Now update the server after state has been updated
            const body = { original: original, content: newImageSrc, game_id: game_id };
            post("/api/image", body).then((image) => {
              addNewImage(image);
            });
          } catch (error) {
            console.error("Error fetching image:", error);
            const body = { original: original, content: "https://i.ibb.co/0QH97dD/content-Filter.png", game_id: game_id };
            post("/api/image", body).then((image) => {
              addNewImage(image);
            });   
            setImageSrc("https://i.ibb.co/0QH97dD/content-Filter.png");
          }
        };

        fetchImage();
      });
    }
  }, [prompt, triggerFetch]); //update imageSrc on prompt and triggerFetch input

  if (shouldDisplay) {
    return imageSrc !== "" ? (
      <div
        style={{ backgroundImage: `url('${imageSrc}')` }}
        className="flex justify-center items-center rounded-3xl w-[580px] h-[580px] border-8 border-emerald-900 border-transparent border-opacity-50 shadow-md p-4 bg-emerald-200 bg-contain bg-no-repeat bg-center"
      ></div>
    ) : (
      <div className="rounded-3xl w-[580px] h-[580px] border-8 border-emerald-900 border-transparent border-opacity-75 shadow-lg p-24 flex justify-center items-center bg-emerald-200">
        <div className="text-center p-2 text-xl">Retrieving your image</div>
        <svg
          aria-hidden="true"
          className="w-8 h-8 text-slate-50 animate-spin dark:text-emerald-600 fill-emerald-900"
          viewBox="0 0 100 101"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
            fill="currentColor"
          />
          <path
            d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
            fill="currentFill"
          />
        </svg>
      </div>
    );
  } else {
    return null;
  }
};
export default Dalle;
