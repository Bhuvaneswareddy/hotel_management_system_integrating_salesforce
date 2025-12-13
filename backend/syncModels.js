require('dotenv').config();
const sequelize = require('./config/db');
const jsforce = require('jsforce');

const User = require('./models/user');
const Branch = require('./models/Branch');
const Room = require('./models/Room');
const Booking = require('./models/Booking');
const Food = require('./models/FoodOrder');
const MenuItem = require('./models/MenuItem');
const OrderItem = require('./models/OrderItem');
const ServiceRequest = require('./models/service');
const FoodOrder = require('./models/FoodOrders');

async function syncModels() {
  try {
    // 1️⃣ Connect to MySQL
    await sequelize.authenticate();
    console.log('✅ Database connected successfully!');
    await sequelize.sync({ alter: true });
    console.log('✅ Sequelize models synced!');

    // 2️⃣ Connect to Salesforce
    const conn = new jsforce.Connection({ loginUrl: process.env.SALESFORCE_LOGIN_URL });
    await conn.login(
      process.env.SALESFORCE_USERNAME,
      process.env.SALESFORCE_PASSWORD + process.env.SALESFORCE_TOKEN
    );
    console.log('✅ Salesforce login successful');

    // Map to store Salesforce IDs for relationships
    const branchSFMap = {};

    // 3️⃣ Sync Branches
    const branches = await Branch.findAll();
    for (const branch of branches) {
      try {
        const branchSF = await conn.sobject('Branch__c').upsert(
          {
            Name: branch.name,
            Address__c: branch.address || '',
            City__c: branch.city || '',
            State__c: branch.state || '',
            Country__c: branch.country || '',
            Phone__c: branch.phone || ''
          },
          'Name' // upsert by Name
        );
        branchSFMap[branch.id] = branchSF.id; // store Salesforce Id
      } catch (err) {
        console.error('Error syncing Branch:', err.message);
      }
    }
    console.log('✅ Branches synced');

    // 4️⃣ Sync Rooms
    const rooms = await Room.findAll({ include: Branch });
    for (const room of rooms) {
      const branchId = room.Branch ? branchSFMap[room.Branch.id] : null;
      if (!branchId) continue;

      try {
        await conn.sobject('Room__c').upsert(
          {
            Name: room.roomNumber || `Room-${room.id}`,
            Branch__c: branchId,
            Type__c: room.type,
            Price__c: room.price,
            Status__c: room.status
          },
          'Name' // upsert by Name
        );
      } catch (err) {
        console.error('Error syncing Room:', err.message);
      }
    }
    console.log('✅ Rooms synced');

    // 5️⃣ Sync Bookings (with external ID)
    const bookings = await Booking.findAll({ include: [Branch, Room] });
    for (const booking of bookings) {
      const branchId = booking.Branch ? branchSFMap[booking.Branch.id] : null;
      const roomSF = await conn.sobject('Room__c').findOne({ Name: booking.Room.roomNumber });
      if (!branchId || !roomSF) continue;

      try {
        await conn.sobject('Booking__c').upsert({
          MySQL_Id__c: booking.id,
          Branch__c: branchId,
          Room__c: roomSF.Id,
          Customer_Name__c: booking.customerName,
          CheckIn_Date__c: booking.checkIn,
          CheckOut_Date__c: booking.checkOut,
          Total_Amount__c: booking.totalAmount,
          Status__c: booking.status
        }, 'MySQL_Id__c'); // external ID upsert
      } catch (err) {
        console.error('Error syncing Booking:', err.message);
      }
    }
    console.log('✅ Bookings synced');

    // 6️⃣ Sync Menu Items
    const menuItems = await MenuItem.findAll({ include: Branch });
    for (const item of menuItems) {
      const branchId = item.Branch ? branchSFMap[item.Branch.id] : null;
      if (!branchId) continue;

      try {
        await conn.sobject('MenuItem__c').upsert({
          Name: item.name,
          Branch__c: branchId,
          Price__c: item.price,
          Category__c: item.category,
          Availability__c: item.availability,
          MySQL_Id__c: item.id
        }, 'MySQL_Id__c'); // upsert by external ID
      } catch (err) {
        console.error(`Error syncing MenuItem ${item.name}:`, err.message);
      }
    }
    console.log('✅ MenuItems synced');

    // 7️⃣ Sync Food
    const foods = await FoodOrder.findAll({ include: Branch });
    for (const food of foods) {
      const branchId = food.Branch ? branchSFMap[food.Branch.id] : null;
      if (!branchId) continue;

      try {
        await conn.sobject('Food__c').upsert({
          Name: food.name,
          Branch__c: branchId,
          Price__c: food.price,
          Category__c: food.category,
          Availability__c: food.availability,
          MySQL_Id__c: food.id
        }, 'MySQL_Id__c'); // upsert by external ID
      } catch (err) {
        console.error(`Error syncing Food ${food.name}:`, err.message);
      }
    }
    console.log('✅ Food synced');

    // 8️⃣ Sync Order Items
    const orderItems = await OrderItem.findAll({ include: [Booking, MenuItem] });
    for (const item of orderItems) {
      const bookingSF = await conn.sobject('Booking__c').findOne({ MySQL_Id__c: item.bookingId });
      const menuSF = await conn.sobject('MenuItem__c').findOne({ MySQL_Id__c: item.menuItemId });

      if (!bookingSF || !menuSF) continue;

      try {
        await conn.sobject('OrderItem__c').upsert({
          FoodOrder__c: bookingSF.Id,
          MenuItem__c: menuSF.Id,
          Quantity__c: item.quantity,
          SubTotal__c: item.subTotal,
          MySQL_Id__c: item.id
        }, 'MySQL_Id__c'); // external ID upsert
      } catch (err) {
        console.error('Error syncing OrderItem:', err.message);
      }
    }
    console.log('✅ OrderItems synced');

    // 9️⃣ Sync Service Requests
    const serviceRequests = await ServiceRequest.findAll({ include: Booking });
    for (const sr of serviceRequests) {
      const bookingSF = await conn.sobject('Booking__c').findOne({ MySQL_Id__c: sr.bookingId });
      if (!bookingSF) continue;

      try {
        await conn.sobject('ServiceRequest__c').upsert({
          Booking__c: bookingSF.Id,
          Service_Type__c: sr.serviceType,
          Status__c: sr.status,
          MySQL_Id__c: sr.id
        }, 'MySQL_Id__c');
      } catch (err) {
        console.error('Error syncing ServiceRequest:', err.message);
      }
    }
    console.log('✅ ServiceRequests synced');

    console.log('🎉 All models synced to Salesforce!');
    process.exit();
  } catch (err) {
    console.error('❌ Error syncing models:', err);
    process.exit(1);
  }
}

syncModels();
