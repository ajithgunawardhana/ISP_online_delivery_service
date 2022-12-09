const Payments = require('../models/paymentModel')
const Users = require('../models/userModel')
const Products = require('../models/productModel')
const crypto = require('crypto');
//Create admin
const admin = crypto.createECDH('secp256k1');
//Generate public key and private key use admin
admin.generateKeys();
//Create user
const user = crypto.createECDH('secp256k1');
//user public and private
user.generateKeys();


//get admin public key
const adminPublicKeyBase64 = admin.getPublicKey().toString('base64');
//get user public key
const userPublicKeyBase64 = user.getPublicKey().toString('base64');
// create shared key using user public key
const adminSharedKey = admin.computeSecret(userPublicKeyBase64, 'base64', 'hex');
//print the admin shared key
console.log(adminSharedKey);
// create shared key using admin public key
const userSharedKey = user.computeSecret(adminPublicKeyBase64, 'base64', 'hex');
//Check the equality of two shared keys
console.log(adminSharedKey === userSharedKey)

console.log("Admin shared key : ", adminSharedKey)
console.log("User shared key : ", userSharedKey)




const paymentCtrl = {
    getPayments: async(req, res) =>{
        try {
            const payments = await Payments.find()
            res.json(payments)
        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },
    createPayment: async(req, res) => {
        try {           
            const {userid, address, phonenumber, cardnumber} = req.body;

            const IV = crypto.randomBytes(16);
            const cipher = crypto.createCipheriv(
              'aes-256-gcm',
              Buffer.from(userSharedKey, 'hex'),
              IV
            );
            //encrypt the card number using cipher 
            let encrypted = cipher.update(cardnumber, 'utf8', 'hex');
            encrypted += cipher.final('hex');
            
            const auth_tag = cipher.getAuthTag().toString('hex');
            
            console.table({
              IV: IV.toString('hex'),
              encrypted: encrypted,
              auth_tag: auth_tag
            });
            
            const payload = IV.toString('hex') + encrypted + auth_tag;
            
            const upayload64 = Buffer.from(payload, 'hex').toString('base64');
            console.log(upayload64);

            //get encrypted msg from databse
            const admin_payload = Buffer.from(upayload64, 'base64').toString('hex');

            const admin_iv = admin_payload.substr(0, 32);
            const admin_encrypted = admin_payload.substr(32, admin_payload.length - 32 - 32);
            const admin_auth_tag = admin_payload.substr(admin_payload.length - 32, 32);
            //Display iv , admin encrypted, admin auth tag
            console.table({ admin_iv, admin_encrypted, admin_auth_tag });

            try {
              const decipher = crypto.createDecipheriv(
                'aes-256-gcm',
                Buffer.from(adminSharedKey, 'hex'),
                Buffer.from(admin_iv, 'hex')
              );

              decipher.setAuthTag(Buffer.from(admin_auth_tag, 'hex'));

              let decrypted = decipher.update(admin_encrypted, 'hex', 'utf8');
              decrypted += decipher.final('utf8');
                //Display decrypted message
              console.table({ DecyptedMessage: decrypted });
            } catch (error) {
              console.log(error.message);
            }
            const newPayment = new Payments({
                userid, address, phonenumber, cardnumber: upayload64            
            })
            
            await newPayment.save()
            res.json({msg: "Payment Succes!"})
            
        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    }
}

const sold = async (id, quantity, oldSold) =>{
    await Products.findOneAndUpdate({_id: id}, {
        sold: quantity + oldSold
    })
}

module.exports = paymentCtrl
