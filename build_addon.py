import os
import shutil

minecraft_path_roaming = os.path.join(os.getenv("APPDATA"), "Minecraft Bedrock Preview\\Users\\Shared\\games\\com.mojang\\")

rp_path = os.path.join(minecraft_path_roaming, "development_resource_packs")
bp_path = os.path.join(minecraft_path_roaming, "development_behavior_packs")

if os.path.exists(rp_path):
    shutil.copytree("RP", rp_path, dirs_exist_ok=True)
else:
    shutil.copytree("RP", rp_path)

if os.path.exists(bp_path):
    shutil.copytree("BP", bp_path, dirs_exist_ok=True)
else:
    shutil.copytree("BP", bp_path)

print("Addon build successful")