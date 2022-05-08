// create order schema
const mongoose = require( 'mongoose' );
const Schema = mongoose.Schema;
const orderSchema = new Schema( {
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    cart: {
        totalQty: {
            type: Number,
            default: 0
        },
        totalPrice: {
            type: Number,
            default: 0
        }
    },
     items: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
        },
        qty: {
          type: Number,
          default: 0,
        },
        price: {
          type: Number,
          default: 0,
        },
        title: {
          type: String,
        },
      },
    ],
    shipping: {
        name: String,
        address: {
            street: String,
            city: String,
            state: String,
            zip: String
        },
        email: String,
        phone: String
    },
    payment: {
        name: String,
        card: String,
        cvv: String,
        exp: String
    },
    status: {
        type: String,
        default: 'pending'
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    deliveredAt: {
        type: Date,
        default: null
    },
    delivered: {
        type: Boolean,
        default: false
    },
    orderDate: {
        type: Date,
        required: true
    },
    orderStatus: {
        type: String,
        required: true
    },
    orderTotal: {
        type: Number,
        required: true
    }
} );
module.exports = mongoose.model( 'Order', orderSchema );
