import Joi from 'joi'

export const orderSchema = Joi.object({
  items: Joi.array()
    .items(
      Joi.object({
        id: Joi.number().required(),
        name: Joi.string().required(),
        price: Joi.number().required(),
        quantity: Joi.number().integer().min(1).required(),
      })
    )
    .min(1)
    .required(),
  customerName: Joi.string().min(2).max(100).required(),
  address: Joi.string().min(5).max(200).required(),
  phone: Joi.string()
    .pattern(/^[0-9]{10}$/)
    .required(),
})

export const orderStatusSchema = Joi.object({
  status: Joi.string()
    .valid('Order Received', 'Preparing', 'Out for Delivery', 'Delivered')
    .required(),
})

export function validateData(data: unknown, schema: Joi.Schema) {
  return schema.validate(data, {
    abortEarly: false,
    stripUnknown: true,
  })
}
