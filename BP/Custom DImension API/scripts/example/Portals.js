import { CustomPortal, CustomPortalManager, PortalType } from '../api/portal/CustomPortal.js';

const portalManager = new CustomPortalManager();

const portal1 = new CustomPortal(
    '013:portal_1',
    PortalType.NETHER,
    'minecraft:mossy_cobblestone',
    '013:portal_block_1',
    'minecraft:flint_and_steel',
    '013:dimension_1',
    false
);

portalManager.registerPortal(portal1);

const portal2 = new CustomPortal(
    '013:portal_2',
    PortalType.THE_END,
    '013:custom_endframe_activated',
    '013:portal_block_2',
    '013:custom_ender_eye',
    '013:dimension_2',
    false
);

portalManager.registerPortal(portal2);
