import os
import shutil

minecraft_path_roaming = os.path.join(os.getenv("APPDATA"), "Minecraft Bedrock Preview\\Users\\Shared\\games\\com.mojang\\")

rp_path = os.path.join(minecraft_path_roaming, "development_resource_packs")
bp_path = os.path.join(minecraft_path_roaming, "development_behavior_packs")

def build_clean(source_folder, destination_path):
    if os.path.exists(destination_path):
        print(f"Starting build clean")
        shutil.rmtree(destination_path)
    
    print(f"Copying {source_folder} to {destination_path}")
    shutil.copytree(source_folder, destination_path)

build_clean("RP", rp_path)

build_clean("BP", bp_path)

print("Addon build clean successful")