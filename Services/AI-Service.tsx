import axios from 'axios';

// Define a type for the web entity
type WebEntity = {
  description?: string;
  score?: number;
};

export const analyzeImage = async (base64ImageData: string) => {
  try {
    if (!base64ImageData) {
      throw new Error('Please provide an image to analyze');
    }

    const apiKey = 'AIzaSyBBhze4BvdIlKKYPGaTsxjZCK9-lE69vvA'; // Replace <YOUR_API_KEY> with your actual key or use dotenv for environment management
    const apiURL = `https://vision.googleapis.com/v1/images:annotate?key=${apiKey}`;

    const reqData = {
      requests: [
        {
          image: {
            content: base64ImageData,
          },
          features: [{ type: 'WEB_DETECTION', maxResults: 5 }],
        },
      ],
    };

    const apiResponse = await axios.post(apiURL, reqData, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Checking if webDetection exist before accessing
    if (apiResponse.data.responses[0] && apiResponse.data.responses[0].webDetection) {
      const webDetection = apiResponse.data.responses[0].webDetection;
      const formattedWebDetection = {
        webEntities: webDetection.webEntities?.map((entity: WebEntity) => ({
          description: entity.description,
          score: entity.score,
        })) || [],
        fullMatchingImages: webDetection.fullMatchingImages?.map((image: { url: string }) => image.url) || [],
        partialMatchingImages: webDetection.partialMatchingImages?.map((image: { url: string }) => image.url) || [],
      };
      return formattedWebDetection;
    } else {
      throw new Error('No web-related information found in the image');
    }
  } catch (error: any) {
    console.log('Error analyzing image: ', error.response ? error.response.data : error.message);
    throw new Error(error.response ? error.response.data.error.message : error.message);
  }
};
