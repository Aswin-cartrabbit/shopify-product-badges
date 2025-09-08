import { BillingService } from "@/services/BillingService";
import withMiddleware from "@/utils/middleware/withMiddleware";

const handler = async (req, res) => {
  const { action } = req.query;
  const { planName, subscriptionId } = req.body;

  const service = new BillingService(req.user_shop);

  try {
    let result;
    switch (action) {
      case "create":
        result = await service.createSubscription(planName);
        res.status(200).json({ confirmationUrl: result });
        break;
      case "cancel":
        result = await service.cancelSubscription(subscriptionId);
        res.status(200).json(result);
        break;
      case "upgrade":
        result = await service.upgradeSubscription(subscriptionId, planName);
        res.status(200).json({ confirmationUrl: result });
        break;
      case "downgrade":
        result = await service.downgradeSubscription(subscriptionId, planName);
        res.status(200).json({ confirmationUrl: result });
        break;
      default:
        res.status(400).json({ error: "Invalid action" });
    }
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
};

export default withMiddleware("verifyRequest")(handler);
