import { Router } from "express";
const router: Router = Router();
import * as Customer from "../Controllers/CustomerController";

 
router.get("/grossaries", Customer.get_grossaries);
router.post("/grossaries", Customer.create_grossaries);
router.get("/grossaries/:item_id", Customer.get_grossary);
router.put("/grossaries/:item_id", Customer.update_grossary);
router.delete("/grossaries/:item_id", Customer.delete_grossary);

 

export default router;
