import { system} from "@minecraft/server";
import { CustomPortalManager } from "./CustomPortal.js";

const portalManager = new CustomPortalManager();

system.beforeEvents.startup.subscribe((initEvent) => {
  initEvent.blockComponentRegistry.registerCustomComponent(
    "custom_dim:portal_block",
    {
      onTick: (e) => {
        e.dimension.playSound("portal.portal", e.block.location);
      }
    }
  );

  initEvent.blockComponentRegistry.registerCustomComponent(
    "custom_dim:portal_frame",
    {
      onPlayerInteract: (e) => {
        const itemInHand = e.player
          .getComponent("minecraft:inventory")
          .container.getItem(e.player.selectedSlotIndex);

        if (itemInHand) {
          const itemName = itemInHand.typeId;

          portalManager.portals.forEach((portal) => {
            if (itemName === portal.lightWithItem) {
              e.block.setType(`${e.block.typeId}_activated`);
              e.dimension.playSound(portal.soundAttachItem, e.block.location);
            }
          });
        }
      },
    },
  );
});
