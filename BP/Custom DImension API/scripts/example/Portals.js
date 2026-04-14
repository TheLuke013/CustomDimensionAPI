import {
  CustomPortal,
  CustomPortalManager,
  PortalType,
} from "../api/portal/CustomPortal.js";

const portalManager = new CustomPortalManager();

const portal1 = new CustomPortal(
  "custom_dim:portal_1",
  PortalType.NETHER,
  "minecraft:mossy_cobblestone",
  "custom_dim:portal_block_1",
  "minecraft:flint_and_steel",
  "custom_dim:dimension_1",
  false,
);

portalManager.registerPortal(portal1);

const portal2 = new CustomPortal(
  "custom_dim:portal_2",
  PortalType.THE_END,
  "custom_dim:custom_endframe_activated",
  "custom_dim:portal_block_2",
  "custom_dim:custom_ender_eye",
  "custom_dim:dimension_2",
  false,
);

portalManager.registerPortal(portal2);
