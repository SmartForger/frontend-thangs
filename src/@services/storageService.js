import axios from 'axios';

async function uploadToSignedUrl(uploadUrl, file) {
    return await axios.put(uploadUrl, file, {
        headers: {
            'Content-Type': 'application/octet-stream',
        },
    });
}

export { uploadToSignedUrl };
