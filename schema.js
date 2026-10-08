const joi = require("joi");
const listingCategories = require("./utils/listingCategories.js");

module.exports.listingSchema = joi.object({
    listing: joi.object({
        title: joi.string().required(),
        category: joi.string().valid(...listingCategories.map(({ name }) => name)).required(),
        description:joi.string().required(),
        location :joi.string().required(),
        country: joi.string().required(),
        price:joi.number().required(),
        image: joi.object({

            url: joi.string()

                .allow("", null),

            filename: joi.string()

                .allow("", null)

        }).required(),

    }).required(),


});
module.exports.reviewSchema = joi.object({
    review: joi.object({
        rating: joi.number().required().min(1).max(5),
        comment: joi.string().required(),
    }).required(),
});