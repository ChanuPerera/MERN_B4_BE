//// import my watch model
const Watch = require("../../models/watch/watch.model");

const ALLOW_TYPES = ["analog", "digital", "semi-analog"];

//// Helper function : find index by modal
async function findIndexByModel(items, modelNumber) {
  return items.findIndex((w) => w.modelNumber === modelNumber);
}

/// get all watches.

exports.getAllWatches = async (req, res, next) => {
  try {
    const items = await Watch.find().lean();

    if (!items || items.length === 0) {
      return res.status(200).json({
        success: true,
        message: "No watches available",
        data: [],
      });
    }
    return res.status(200).json({
      success: true,
      message: "Watches fetched successfully ",
      data: items,
    });
  } catch (error) {
    next(error);
  }
};

exports.getWatchByModel = async (req, res, next) => {
  try {
    const { modelNumber } = req.params;
    const items = await readDB();
    const watch = items.find((w) => w.modelNumber === modelNumber);

    if (!watch) {
      return res.status(200).json({
        success: false,
        message: "Watch not found",
        data: [],
      });
    }
    return res.status(200).json({
      success: true,
      message: "Watch data found",
      data: watch,
    });
  } catch (error) {
    next(error);
  }
};

exports.createWatch = async (req, res, next) => {
  try {
    const { modelNumber, brand, price, type } = req.body;
    ///// basic validations
    if (!modelNumber || !brand || price === undefined || type === undefined) {
      return res.status(200).json({
        success: false,
        message: "modelNumber , brand and price and type are required",
      });
    }
    //// validation type values
    const normalizesTypes = String(type).toLowerCase();
    if (!ALLOW_TYPES.includes(normalizesTypes)) {
      return res.status(404).json({
        success: false,
        message: "Invalid type",
      });
    }
    ////// check if modelNumber already exists
    const exists = await Watch.findOne({ modelNumber });
    if (exists) {
      return res.status(400).json({
        success: false,
        message: "ModelNUmber already exists",
      });
    }
    const watch = new Watch({
      modelNumber,
      brand,
      type: normalizesTypes,
      price: Number(price),
    });
    await watch.save();
    return res.status(201).json({
      success: true,
      message: "Watch created successfully!",
    });
  } catch (error) {
    if (error.name === "MongoError" && error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "ModelNUmber already exists",
      });
    }
    next(error);
  }
};

exports.deleteWatch = async (req, res, next) => {
  try {
    const { modelNumber } = req.params;
    const deleted = await Watch.findOneAndDelete({modelNumber})
    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Watch not found",
      });
    }
    return res.status(200).json({
      success: true,
      message: "Watch deleted successfully !",
    });

  } catch (error) {
    next(error);
  }
};

//// PUT
exports.updateWatch = async (req, res, next) => {
  try {
  
    const { modelNumber } = req.params;
    const { brand, price , type } = req.body;

    const watch = await Watch.findOne({modelNumber})

    if (!watch) {
      return res.status(404).json({
        success: false,
        message: "Watch not found",
      });
    }

    //////////// check for provided fields
    if (brand === undefined && price === undefined && type === undefined) {
      return res.status(400).json({
        success: false,
        message: "Please provide at least one field values to continue",
      });
    }

    /////// Update only provided fields
    if (brand !== undefined) {
      watch.brand = brand
    }

    if (price !== undefined) {
      watch.price = Number(price)
    }


    if (type !== undefined){
      const normalizesTypes = String(type).toLowerCase();
      if (!ALLOW_TYPES.includes(normalizesTypes)) {
        return res.status(404).json({
          success: false,
          message: "Invalid type",
        });
      }
      
      watch.type = normalizesTypes
    }

    await watch.save();

    return res.status(200).json({
      success: true,
      message: "Watch Updated successfully !",
    });
  } catch (error) {
    next(error);
  }
};



///Patch 

exports.patchWatch = async (req , res , next) =>{

  try {
    const { modelNumber } = req.params;
    const { brand, price , type } = req.body;
    const watch = await Watch.findOne({modelNumber})

    if (!watch) {
      return res.status(404).json({
        success: false,
        message: "Watch not found",
      });
    }

    //////////// check for provided fields
    if (brand === undefined && price === undefined && type === undefined) {
      return res.status(400).json({
        success: false,
        message: "Please provide at least one field values to continue",
      });
    }

    /////// Update only provided fields
    if (brand !== undefined) {
      watch.brand = brand
    }

    if (price !== undefined) {
      watch.price = Number(price)
    }


    if (type !== undefined){
      const normalizesTypes = String(type).toLowerCase();
      if (!ALLOW_TYPES.includes(normalizesTypes)) {
        return res.status(404).json({
          success: false,
          message: "Invalid type",
        });
      }
      
      watch.type = normalizesTypes
    }

    await watch.save();

    return res.status(200).json({
      success: true,
      message: "Watch Updated successfully !",
    });

  } catch (error) {
    next(error);
  }

};




exports.getWatchesByType = async (req , res , next) => {
  try {
    const {type} = req.params;
    const normalizesType = String(type).toLowerCase();
      
    if (!ALLOW_TYPES.includes(normalizesType)) {
        return res.status(404).json({
          success: false,
          message: "Invalid type",
          data:[],
        });
      }
      const watches = await Watch.find({type: normalizesType}).lean();
      return res.status(200).json({
        success: true,
        message: "Watch fetched by type successfully !",
        count: watches.length,
        data: watches,
    });

  } catch (error) {
    next(error)
  }
}