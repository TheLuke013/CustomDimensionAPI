import { system, world } from "@minecraft/server";
import { CustomDimensionManager } from "./CustomDimension.js";
import { generatePortal } from "./PortalGenerator.js";
import { CustomPortalManager, PortalType } from "../portal/CustomPortal.js";

const dimManager = new CustomDimensionManager();

world.afterEvents.playerDimensionChange.subscribe((e) => {
  const to = e.toDimension;
  const toLoc = e.toLocation;

  if (dimManager.getDimension(to.id)) {
    const dimClass = dimManager.getDimension(to.id);

    to.placeFeatureRule("custom_dim:stone_column", toLoc);
    to.placeFeatureRule("custom_dim:bedrock_features", toLoc);
    to.placeFeatureRule("custom_dim:deepslate_features", toLoc);
    to.placeFeatureRule("custom_dim:dirt_features", toLoc);
    to.placeFeatureRule("custom_dim:grass_features", toLoc);

    //gera o portal
    if (dimClass.canGeneratePortal) {
      generatePortal(dimClass.namespace, toLoc, to);
    }

    if (!world.getDynamicProperty(`${dimClass.namespace}_generated`)) {
      world.sendMessage("dimensao sendo gerada pela primeia vez");
      world.setDynamicProperty(`${dimClass.namespace}_generated`, true);

      //chama a funcao da primeia geração da dimensao
      if (typeof dimClass.onFirstGeneration === "function") {
        dimClass.onFirstGeneration(to);
      }
    }
  }
});

function generateDimChunk(overworldDim, dimension) {}
