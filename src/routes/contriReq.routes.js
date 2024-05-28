import { Router } from "express";
import {
  createContributionRequest,
  getContributionRequests,
  getMyContributionRequests,
  updateContributionRequestRating,
  updateContributionRequestStatus,
} from "../controllers/contriReqController.js";

const contriRoute = Router();
contriRoute.post("/createRequest", createContributionRequest);
contriRoute.put("/updateStatus", updateContributionRequestStatus);
contriRoute.get("/getRequests", getContributionRequests);
contriRoute.get("/getMyRequests", getMyContributionRequests);
contriRoute.put("/updateRating", updateContributionRequestRating);
export default contriRoute;
