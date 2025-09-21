// Image Upload API Service
// Handles image uploads to free hosting services

export interface UploadResult {
  success: boolean;
  url?: string;
  error?: string;
}

class ImageUploadAPI {
  private readonly IMGUR_API = 'https://api.imgur.com/3/image';
  private readonly IMGBB_API = 'https://api.imgbb.com/1/upload';
  
  /**
   * Upload image to free hosting service
   */
  async uploadImage(file: File): Promise<UploadResult> {
    try {
      // Try ImgBB first (free tier)
      const imgbbResult = await this.uploadToImgBB(file);
      if (imgbbResult.success) {
        return imgbbResult;
      }
      
      // Fallback to Imgur
      const imgurResult = await this.uploadToImgur(file);
      if (imgurResult.success) {
        return imgurResult;
      }
      
      // Final fallback - create a data URL for local preview
      return await this.createDataURL(file);
      
    } catch (error) {
      return {
        success: false,
        error: 'Failed to upload image'
      };
    }
  }

  /**
   * Upload to ImgBB (free tier)
   */
  private async uploadToImgBB(file: File): Promise<UploadResult> {
    try {
      const formData = new FormData();
      formData.append('image', file);
      formData.append('key', 'demo'); // Free demo key
      
      const response = await fetch(this.IMGBB_API, {
        method: 'POST',
        body: formData
      });
      
      if (response.ok) {
        const data = await response.json();
        return {
          success: true,
          url: data.data?.url
        };
      }
      
      return { success: false };
    } catch (error) {
      return { success: false };
    }
  }

  /**
   * Upload to Imgur (fallback)
   */
  private async uploadToImgur(file: File): Promise<UploadResult> {
    try {
      const formData = new FormData();
      formData.append('image', file);
      
      const response = await fetch(this.IMGUR_API, {
        method: 'POST',
        headers: {
          'Authorization': 'Client-ID demo' // Demo client ID
        },
        body: formData
      });
      
      if (response.ok) {
        const data = await response.json();
        return {
          success: true,
          url: data.data?.link
        };
      }
      
      return { success: false };
    } catch (error) {
      return { success: false };
    }
  }

  /**
   * Create data URL for local preview (final fallback)
   */
  private async createDataURL(file: File): Promise<UploadResult> {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        resolve({
          success: true,
          url: e.target?.result as string
        });
      };
      reader.onerror = () => {
        resolve({
          success: false,
          error: 'Failed to read file'
        });
      };
      reader.readAsDataURL(file);
    });
  }

  /**
   * Validate image file
   */
  validateImage(file: File): { valid: boolean; error?: string } {
    // Check file type
    if (!file.type.startsWith('image/')) {
      return {
        valid: false,
        error: 'Please select an image file'
      };
    }
    
    // Check file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      return {
        valid: false,
        error: 'Image size must be less than 10MB'
      };
    }
    
    // Check dimensions (optional)
    return { valid: true };
  }

  /**
   * Compress image before upload
   */
  async compressImage(file: File, maxWidth: number = 1200, quality: number = 0.8): Promise<File> {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      
      img.onload = () => {
        // Calculate new dimensions
        let { width, height } = img;
        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }
        
        canvas.width = width;
        canvas.height = height;
        
        // Draw and compress
        ctx?.drawImage(img, 0, 0, width, height);
        
        canvas.toBlob(
          (blob) => {
            if (blob) {
              const compressedFile = new File([blob], file.name, {
                type: 'image/jpeg',
                lastModified: Date.now()
              });
              resolve(compressedFile);
            } else {
              resolve(file);
            }
          },
          'image/jpeg',
          quality
        );
      };
      
      img.onerror = () => resolve(file);
      img.src = URL.createObjectURL(file);
    });
  }
}

export const imageUploadAPI = new ImageUploadAPI();