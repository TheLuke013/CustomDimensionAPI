import { Portal, PortalManager, PortalType } from '../api/portal/Portal.js';

const portalManager = new PortalManager();

const portal1 = new Portal(
    '013:portal_1',
    PortalType.NETHER,
    'minecraft:mossy_cobblestone',
    '013:portal_block_1',
    'minecraft:flint_and_steel',
    '013:dimension_1',
    false
);

portalManager.registerPortal(portal1);

const portal2 = new Portal(
    '013:portal_2',
    PortalType.THE_END,
    'minecraft:water',
    '013:portal_block_2',
    'minecraft:emerald',
    '013:dimension_2',
    true
);

portalManager.registerPortal(portal2);
