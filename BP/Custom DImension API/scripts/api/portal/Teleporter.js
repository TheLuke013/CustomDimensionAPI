import { system, world } from "@minecraft/server";
import { detectBlocks } from "../utils/Utils.js";
import { CustomPortalManager, PortalType } from "./CustomPortal.js";
import { CustomDimensionManager } from "../dimension/CustomDimension.js";
import { SimpleVector3 } from "../utils/SimpleVector3.js";

const dimManager = new CustomDimensionManager();

let currentTime = 0;
const targetTime = 5;

system.afterEvents.scriptEventReceive.subscribe((e) => {
  const source = e.sourceType;
  const msg = e.message;

  if (e.id !== "custom_dim:dim_teleporter" && msg === "") return;

  const msgJson = JSON.parse(msg);
  const mob = world.getEntity(msgJson.mobId);
  const portal = msgJson.portal;

  mob.addTag('teleporting_dim');

  //aplica fade se for player
  if (mob.typeId === "minecraft:player") {
    mob.camera.fade({
      fadeTime: { fadeInTime: 0, fadeOutTime: 10, holdTime: 0.1 },
      fadeColor: { red: 1.0, green: 1.0, blue: 1.0 },
    });
  }

  //======== RETORNANDO DA DIMENSAO ==========//
  if (mob.dimension.id === portal.destDimID) {
    world.sendMessage('retornando da dimensao');
    if (mob.getDynamicProperty("return_location")) {
      const returnLoc = JSON.parse(
        mob.getDynamicProperty("return_location").toString(),
      );
      mob.tryTeleport(
        {
          x: returnLoc.x + 2,
          y: returnLoc.y,
          z: returnLoc.z + 2,
        },
        {
          dimension: world.getDimension("minecraft:overworld"),
        },
      );
      if (mob.typeId === "minecraft:player") {
        mob.setSpawnPoint({
          dimension: world.getDimension("minecraft:overworld"),
          x: returnLoc.x + 2,
          y: returnLoc.y,
          z: returnLoc.z + 2,
        });
      }
    } else {
      if (!mob.typeId === "minecraft:player") return;
      const returnLoc = getReturnLocation(mob, true);
      mob.tryTeleport(returnLoc, {
        dimension: world.getDimension("minecraft:overworld"),
      });
    }

    //remove fog
    if (portal.dimensionFog !== "") {
      mob.runCommand(`fog @s remove "${portal.dimName}"`);
    }

    mob.setDynamicProperty(`in_${portal.dimName}`, false);
  } 
  
  //======== ENTRANDO NA DIMENSAO ==========//
  else {
    world.sendMessage('entrando na diemnsao');
    //save return loc
    mob.setDynamicProperty("return_location", JSON.stringify(mob.location));

    //teleport
    if (mob.typeId !== "minecraft:player") {
      const dimLoc = portal.dimensionLocation;
      mob.runCommand(`tp ${dimLoc.x} ${dimLoc.y} ${dimLoc.z}`);
    } else {
      //mob.tryTeleport(portal.dimensionLocation);
      teleportToDimension(mob, portal);
    }

    //apply fog
    if (portal.dimensionFog !== "") {
      mob.runCommand(
        `fog @s push "${portal.dimensionFog}" "${portal.dimName}"`,
      );
    }

    system.runTimeout(() => {
      mob.setDynamicProperty(`in_${portal.dimName}`, true);

      if (mob.typeId === "minecraft:player") {
        const dimLoc = dimManager.getDimension(portal.destDimID).spawnLoc;
        const soundOffset = {
          x: mob.location.x + 3,
          y: mob.location.y,
          z: mob.location.z + 1,
        };

        mob.playSound(portal.travelSound, { location: soundOffset });

        mob.setSpawnPoint({
          dimension: world.getDimension(portal.destDimID),
          x: dimLoc.x,
          y: dimLoc.y,
          z: dimLoc.z,
        });
      }
    }, 20);

    if (!world.getDynamicProperty(`${portal.dimName}_generated`)) {
      world.setDynamicProperty(`${portal.dimName}_generated`, true);
      if (typeof portal.onGenerate === "function") {
        portal.onGenerate(mob);
      }
    }
  }

   system.runTimeout(() => {mob.removeTag('teleporting_dim');}, 40);
});

async function teleportToDimension(player, portal) {
  const dimClass = dimManager.getDimension(portal.destDimID);
  const dim = world.getDimension(dimClass.namespace);
  const tickingAreaId = `${dimClass.namespace}_teleport`;
  const spawn = dimClass.spawnLoc;

  if (!world.tickingAreaManager.hasTickingArea(tickingAreaId)) {
    await world.tickingAreaManager.createTickingArea(tickingAreaId, {
      dimension: dim,
      from: { x: spawn.x - 4, y: spawn.y - 4, z: spawn.z - 4 },
      to: { x: spawn.x + 4, y: spawn.y + 4, z: spawn.z + 4 },
    });
  }

  player.teleport(spawn, { dimension: dim });

  world.tickingAreaManager.removeTickingArea(tickingAreaId);
}

function getReturnLocation(player, onlyWorldSpawnpoint = false) {
  let location = { x: 0, y: 0, z: 0 };
  const playerSpawnpoint = player.getSpawnPoint();

  if (!playerSpawnpoint || onlyWorldSpawnpoint) {
    const worldSpawn = world.getDefaultSpawnLocation();
    location = { x: worldSpawn.x, y: 255, z: worldSpawn.z };
    player.addEffect("minecraft:slow_falling", 400, { showParticles: false });
  } else {
    location = playerSpawnpoint;
  }

  return location;
}

function teleportTimer(player, dimensionLoc) {
  currentTime++;

  if (currentTime >= targetTime) {
    teleportToDimension(player, dimensionLoc);
    currentTime = 0;
  } else if (currentTime == 1) {
    player.addEffect("minecraft:nausea", 180, {
      amplifier: 255,
      showParticles: false,
    });
    player.playSound("portal.trigger");
  }
}
