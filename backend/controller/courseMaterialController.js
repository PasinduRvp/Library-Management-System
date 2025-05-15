const CourseMaterial = require("../models/courseMaterialModel");
const path = require('path');
const fs = require('fs');

async function getCourseMaterials(req, res) {
  try {
    const materials = await CourseMaterial.find().sort({ createdAt: -1 });
    
    const processedMaterials = await Promise.all(materials.map(async (material) => {
      try {
        const filePath = material.material;
        const absolutePath = path.join(__dirname, '..', filePath);
        const fileExists = fs.existsSync(absolutePath);
        
        if (!fileExists) {
          console.warn(`File not found: ${absolutePath}`);
          return {
            ...material._doc,
            fileExists: false,
            downloadUrl: null,
            originalFileName: material.originalFileName || path.basename(filePath)
          };
        }

        return {
          ...material._doc,
          fileExists: true,
          downloadUrl: `${req.protocol}://${req.get('host')}/api/download/${path.basename(filePath)}?name=${encodeURIComponent(material.originalFileName)}`,
          originalFileName: material.originalFileName || path.basename(filePath)
        };
      } catch (err) {
        console.error('Error processing material:', err);
        return {
          ...material._doc,
          fileExists: false,
          downloadUrl: null,
          originalFileName: material.originalFileName || 'Unknown'
        };
      }
    }));

    res.json({ 
      success: true, 
      data: processedMaterials
    });
  } catch (err) {
    console.error('Error in getCourseMaterials:', err);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch materials',
      error: err.message 
    });
  }
}

async function addCourseMaterial(req, res) {
  try {
    const { topic, subtopic } = req.body;
    
    if (!req.file) {
      return res.status(400).json({ success: false, message: "Material file is required" });
    }

    const allowedExtensions = ['.pdf', '.doc', '.docx', '.ppt', '.pptx', '.jpg', '.jpeg', '.png'];
    const fileExt = path.extname(req.file.originalname).toLowerCase();
    
    if (!allowedExtensions.includes(fileExt)) {
      fs.unlinkSync(req.file.path);
      return res.status(400).json({ 
        success: false, 
        message: "Invalid file type. Allowed types: PDF, DOC, DOCX, PPT, PPTX, JPG, JPEG, PNG" 
      });
    }

    const newMaterial = new CourseMaterial({ 
      topic, 
      subtopic, 
      material: req.file.path,
      originalFileName: req.file.originalname
    });

    await newMaterial.save();
    
    res.json({ 
      success: true, 
      message: "Course material added successfully!",
      data: {
        ...newMaterial._doc,
        downloadUrl: `${req.protocol}://${req.get('host')}/api/download/${path.basename(req.file.path)}?name=${encodeURIComponent(req.file.originalname)}`
      }
    });
  } catch (err) {
    if (req.file) {
      fs.unlinkSync(req.file.path);
    }
    res.status(400).json({ success: false, message: err.message });
  }
}

async function updateCourseMaterial(req, res) {
  try {
    const { topic, subtopic } = req.body;
    let materialPath = req.body.material;
    let oldFilePath = null;

    if (req.file) {
      const existingMaterial = await CourseMaterial.findById(req.params.id);
      if (existingMaterial) {
        oldFilePath = existingMaterial.material;
      }
      
      const allowedExtensions = ['.pdf', '.doc', '.docx', '.ppt', '.pptx', '.jpg', '.jpeg', '.png'];
      const fileExt = path.extname(req.file.originalname).toLowerCase();
      
      if (!allowedExtensions.includes(fileExt)) {
        fs.unlinkSync(req.file.path);
        return res.status(400).json({ 
          success: false, 
          message: "Invalid file type. Allowed types: PDF, DOC, DOCX, PPT, PPTX, JPG, JPEG, PNG" 
        });
      }
      
      materialPath = req.file.path;
    }

    const updatedMaterial = await CourseMaterial.findByIdAndUpdate(
      req.params.id,
      { 
        topic, 
        subtopic, 
        ...(materialPath && { material: materialPath }),
        ...(req.file && { originalFileName: req.file.originalname })
      },
      { new: true }
    );

    if (oldFilePath && fs.existsSync(oldFilePath)) {
      fs.unlinkSync(oldFilePath);
    }

    res.json({ 
      success: true, 
      message: "Course material updated!",
      data: {
        ...updatedMaterial._doc,
        downloadUrl: `${req.protocol}://${req.get('host')}/api/download/${path.basename(updatedMaterial.material)}?name=${encodeURIComponent(updatedMaterial.originalFileName)}`
      }
    });
  } catch (err) {
    if (req.file) {
      fs.unlinkSync(req.file.path);
    }
    res.status(400).json({ success: false, message: err.message });
  }
}

async function deleteCourseMaterial(req, res) {
  try {
    const material = await CourseMaterial.findById(req.params.id);
    
    if (!material) {
      return res.status(404).json({ success: false, message: "Course material not found" });
    }

    if (material.material && fs.existsSync(material.material)) {
      fs.unlinkSync(material.material);
    }

    await CourseMaterial.findByIdAndDelete(req.params.id);
    
    res.json({ success: true, message: "Course material deleted successfully!" });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
}

module.exports = { 
  getCourseMaterials, 
  addCourseMaterial, 
  updateCourseMaterial, 
  deleteCourseMaterial 
};