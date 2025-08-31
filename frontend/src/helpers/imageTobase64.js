// helpers/imageTobase64.js
const imageTobase64 = async (file) => {
    return new Promise((resolve, reject) => {
        // Check file size first (max 1MB)
        if (file.size > 1 * 1024 * 1024) {
            reject(new Error("Image size should be less than 1MB"));
            return;
        }

        if (!file.type.startsWith('image/')) {
            reject(new Error("Please select an image file"));
            return;
        }

        const reader = new FileReader();
        
        reader.readAsDataURL(file);
        reader.onload = () => {
            const img = new Image();
            img.src = reader.result;
            
            img.onload = () => {
                // Create canvas for resizing
                const canvas = document.createElement('canvas');
                const MAX_WIDTH = 400;
                const MAX_HEIGHT = 400;
                
                let width = img.width;
                let height = img.height;
                
                // Calculate new dimensions while maintaining aspect ratio
                if (width > height) {
                    if (width > MAX_WIDTH) {
                        height *= MAX_WIDTH / width;
                        width = MAX_WIDTH;
                    }
                } else {
                    if (height > MAX_HEIGHT) {
                        width *= MAX_HEIGHT / height;
                        height = MAX_HEIGHT;
                    }
                }
                
                canvas.width = width;
                canvas.height = height;
                
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0, width, height);
                
                // Convert to base64 with reduced quality
                const compressedBase64 = canvas.toDataURL('image/jpeg', 0.7);
                resolve(compressedBase64);
            };
            
            img.onerror = () => {
                reject(new Error("Failed to load image"));
            };
        };
        
        reader.onerror = () => {
            reject(new Error("Failed to read file"));
        };
    });
};

export default imageTobase64;