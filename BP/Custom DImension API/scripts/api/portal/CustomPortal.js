export class CustomPortal {
    constructor(namespace, type, frameBlock, portalBlock, lightWithItem, destDimID, hasLightning) {
        this.namespace = namespace;
        this.type = type;
        this.frameBlock = frameBlock;
        this.portalBlock = portalBlock;
        this.lightWithItem = lightWithItem;
        this.destDimID = destDimID;
        this.hasLightning = hasLightning;
        this.soundAttachItem = 'block.end_portal_frame.fill';
        this.portalActivationSound = 'block.end_portal.spawn';
    }
}

export class CustomPortalManager {
    constructor() {
        if (CustomPortalManager.instance) {
            return CustomPortalManager.instance;
        }

        CustomPortalManager.instance = this;
        this.portals = [];
    }

    registerPortal(portal) {
        if (portal instanceof CustomPortal) {
            this.portals.push(portal);
        }
    }

    getPortal(namespace) {
        return this.portals.find(portal => portal.namespace === namespace);
    }
}

export const PortalType = {
    NETHER: 'nether',
    THE_END: 'the_end'
};