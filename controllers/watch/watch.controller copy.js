const { readDB, writeDB } = require("../../database/db");

//// Helper function : find index by modal
async function findIndexByModel(items, modelNumber) {
  return items.findIndex((w) => w.modelNumber === modelNumber);
}

/// get all watches.

exports.getAllWatches = async (req, res, next) => {
  try {
    const items = await readDB();
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
    const { modelNumber, brand, price } = req.body;
    ///// basic validations
    if (!modelNumber || !brand || price === undefined) {
      return res.status(200).json({
        success: false,
        message: "modelNumber , brand and price are required",
      });
    }
    const items = await readDB();
    ////// check if modelNumber already exists
    if (items.some((w) => w.modelNumber === modelNumber)) {
      return res.status(409).json({
        success: false,
        message: "A watch with this modelNumber already exists",
      });
    }
    const newWatch = {
      modelNumber,
      brand,
      price: Number(price),
    };
    items.push(newWatch);
    await writeDB(items);
    return res.status(201).json({
      success: true,
      message: "Watch created successfully!",
    });
  } catch (error) {
    next(error);
  }
};

exports.deleteWatch = async (req, res, next) => {
  try {
    const { modelNumber } = req.params;
    const items = await readDB();

    const idx = await findIndexByModel(items, modelNumber);

    if (idx === -1) {
      return res.status(404).json({
        success: false,
        message: "Watch not found",
      });
    }

    //// Remove the watch
    items.splice(idx, 1);
    await writeDB(items);

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
    const { modelNumber } = req.param;
    const { brand, price } = req.body;

    const items = await readDB();
    const idx = await findIndexByModel(items, modelNumber);

    if (idx === -1) {
      return res.status(404).json({
        success: false,
        message: "Watch not found",
      });
    }

    //////////// check for provided fields
    if (brand === undefined && price === undefined) {
      return res.status(400).json({
        success: false,
        message: "Please provide at least one field values to continue",
      });
    }

    /////// Update only provided fields
    if (brand !== undefined) {
      items[idx].brand = brand;
    }

    if (price !== undefined) {
      items[idx].price = price;
    }

    await writeDB(items);

    return res.status(200).json({
      success: true,
      message: "Watch Updated successfully !",
    });
  } catch (error) {
    next(error);
  }
};
