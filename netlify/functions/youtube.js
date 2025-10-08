exports.handler = async (event, context) => {
   
    const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;
    const YOUTUBE_CHANNEL_ID = process.env.YOUTUBE_CHANNEL_ID;

  
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Content-Type': 'application/json',
    };

    if (event.httpMethod === 'OPTIONS') {
        return {
            statusCode: 200,
            headers,
            body: ''
        };
    }

    try {
        
        const response = await fetch(
            `https://www.googleapis.com/youtube/v3/search?` +
            `part=snippet&channelId=${YOUTUBE_CHANNEL_ID}` +
            `&maxResults=12&order=date&type=video&key=${YOUTUBE_API_KEY}`
        );

        if (!response.ok) {
            throw new Error(`YouTube API error: ${response.status}`);
        }

        const data = await response.json();

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify(data)
        };
    } catch (error) {
        console.error('Error fetching YouTube videos:', error);
        
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ 
                error: 'Failed to fetch videos',
                message: error.message 
            })
        };
    }
};