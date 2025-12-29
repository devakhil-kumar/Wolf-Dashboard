import express from "express";
import middleware from "../verifyAcessToken.js";
import { getAll, getByGroupByAggregate, getBySearchQuery, getCustomer, getDataByStore, getSalesRepByStore, getTmbByQuery } from "../controller/customer.js";
import { createTarget, deleteTarget, getTarget, getTargets, updateAllTarget, updateTarget, getAvailableProducts } from "../controller/target.js";
import {createAdmin,resetAdminPassword, deleteAdmin, getAllAdmins, login} from "../controller/admin.js";
import { createNPS, deleteNPS, getAllNPS, getNPS, updateNPS } from "../controller/nps.js";
import { createCommission,updateCommission,getCommission } from "../controller/commission.js";
import { getKPIs, getKPI, createKPI, updateKPI, updateAllKPI, deleteKPI } from '../controller/KPIController.js';
import { createProrataStaff, deleteProrataStaff, getProrataStaff, getAllProrataStaff, updateProrataStaff } from '../controller/prorataStaff.js';
import { syncStaffFromExternal, getStaffByLocation, getAllStaff, addStaff, updateStaff, deleteStaff } from '../controller/staff.js';

const router= express.Router();
// authentication routes ====================>
router.post( "/login", login);






// admin routes ====================>  
router.post( "/admin", createAdmin);
// endpoint will look like ----------> post "http://localhost:5000/api/admin" -------> pass data like this {name:"", email:"", password:""}
router.delete( "/admin/:id", deleteAdmin);
router.get( "/all-admin", getAllAdmins);
router.patch("/admin/:id/reset-password", resetAdminPassword);


// customer dynamic data routes ====================>
router.get( "/get/:id", getCustomer);
router.get( "/get-all",  getAll);
router.get( "/sales-rep",  getSalesRepByStore);
router.get( "/group-customer",  getByGroupByAggregate);
// end point will look like -------> GET "http://localhost:5500/api/group-customer?groupBy=name,salelocation&aggregateFields=invoice,promotype&page=1&limit=10"
router.get( "/search-customer",  getBySearchQuery); 
// end point will look like -------> GET "http://localhost:5500/api/search-customer?movdate_range=2023-07-01,2023-07-31"
router.get( "/tmb-count",  getTmbByQuery); 
// end point will look like -------> GET "http://localhost:5500/api/tmb-count?startDate=2024-01-01&endDate=2024-12-31"
router.get( "/data-by-store",  getDataByStore); 
// end point will look like -------> GET "http://localhost:5000/api/data-by-store?salelocation=Warragul&startDate=01/02/24&endDate=16/05/24"


// target data routes ====================>

  router.get( "/target/all", getTargets);
  router.get( "/target", getTarget);    //=========> request.body should looks like this -----> {"salelocation":"WaRRagUL"} Torquay, Traralgon
  router.get( "/target/products", getAvailableProducts); // Get available products for bonus selection
  router.post( "/target", createTarget); //=========> request.body should looks like this -----> {  "salelocation":"Warragul","detr": 5,"ppn":3,"bundel":10,"tmb":12,"tyro":5,"websitebas": 5,"devicesecurity": 7}
  router.patch( "/target/:id", updateTarget);
  router.put( "/target/all", updateAllTarget); //========> don't send "salelocation" in request.body just send value need to be updated like this -----> { "detr": 5,"ppn":3,"bundel":10,"tmb":12,"tyro":5,"websitebas": 5,"devicesecurity": 7}

  router.delete( "/target/:id", deleteTarget); 
  
  
  // target data routes ====================>


  router.get( "/getcomission", getCommission);    
  router.post( "/createcommission", createCommission); 
  router.patch( "/updatecommission", updateCommission);

  // NPS data routes ====================>
  
    router.get( "/nps/all", getAllNPS); 
    router.get( "/nps", getNPS);    //=========> request url should looks like this -----> http://localhost:5000/api/nps?salelocation=Warragul&salesrep=Nick Dawols&startDate=05/05/24&endDate=05/06/24
    router.post( "/nps", createNPS); //=========> request.body should looks like this -----> {  "salelocation":"Warragul","detr": 5,"ppn":3,"bundel":10,"tmb":12,"tyro":5,"websitebas": 5,"devicesecurity": 7}
    router.patch( "/nps", updateNPS); 
    // router.put( "/target/all", updateAllNPS); //========> don't send "salelocation" in request.body just send value need to be updated like this -----> { "detr": 5,"ppn":3,"bundel":10,"tmb":12,"tyro":5,"websitebas": 5,"devicesecurity": 7}
  
    router.delete( "/nps/:id", deleteNPS); 
    
    
    //KPI data routes ====================>
    router.get("/kpi/all", getKPIs);
router.get("/kpi", getKPI);
router.post("/kpi", createKPI);
router.patch("/kpi/:id", updateKPI);
router.put("/kpi/all", updateAllKPI);
router.delete("/kpi/:id", deleteKPI);

    // Pro-Rata Staff routes ====================>
    router.get("/prorata-staff/all", getAllProrataStaff);
    router.get("/prorata-staff", getProrataStaff);
    router.post("/prorata-staff", createProrataStaff);
    router.patch("/prorata-staff/:id", updateProrataStaff);
    router.delete("/prorata-staff/:id", deleteProrataStaff);

    // Staff routes ====================>
    router.get("/staff/sync", syncStaffFromExternal);  // Sync staff from external API
    router.get("/staff/all", getAllStaff);  // Get all staff
    router.get("/staff", getStaffByLocation);  // Get staff by location
    router.post("/staff", addStaff);  // Manually add staff
    router.patch("/staff/:id", updateStaff);  // Update staff
    router.delete("/staff/:id", deleteStaff);  // Delete staff

      // router.get( "/test", fetchData); 



export default router;

