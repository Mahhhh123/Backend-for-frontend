const mongoose = require('mongoose');

const MassageShopSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add a name'],
        unique: true,
        trim: true
    },
    address: {
        type: String,
        required: [true, 'Please add an address']
    },
    tel: {
        type: String,
        required: [true, 'Please add a telephone number']
    },
    openTime: {
        type: String,
        required: [true, 'Please add opening time'], 
        match: [/^([01]\d|2[0-3]):([0-5]\d)$/, 'Please use HH:mm format']
    },
    closeTime: {
        type: String,
        required: [true, 'Please add closing time'], 
        match: [/^([01]\d|2[0-3]):([0-5]\d)$/, 'Please use HH:mm format']
    },
    picture: {
    type: String,
    required: false, // ตั้งเป็น false ไว้ก่อน เผื่อบางร้านไม่มีรูป
    default: 'https://res.klook.com/images/fl_lossy.progressive,q_65/c_fill,w_1295,h_863/w_80,x_15,y_15,g_south_west,l_Klook_water_br_trans_yhcmh3/activities/ztmhc3vrxyaqstujzhoa/%E0%B8%9A%E0%B8%A3%E0%B8%B4%E0%B8%81%E0%B8%B2%E0%B8%A3%E0%B8%AA%E0%B8%9B%E0%B8%B2%E0%B8%97%E0%B8%B5%E0%B9%88HaSpaMassage%E0%B9%83%E0%B8%99%E0%B9%82%E0%B8%AE%E0%B8%88%E0%B8%B4%E0%B8%A1%E0%B8%B4%E0%B8%99%E0%B8%AB%E0%B9%8C.jpg' // (Optional) ใส่รูป default ไว้ได้
  }
});

module.exports = mongoose.model('MassageShop', MassageShopSchema);