export class CustomDimension {
    constructor(namespace, topMat, midMat, bottomMat, baseMat, location) {
        this.namespace = namespace;
        this.topMaterial = topMat;
        this.midMaterial = midMat;
        this.bottomMaterial = bottomMat;
        this.baseMaterial = baseMat;
        this.location = location;
    }
}

export class CustomDimensionManager {
    constructor() {
        if (CustomDimensionManager.instance) {
            return CustomDimensionManager.instance;
        }

        CustomDimensionManager.instance = this;
        this.dimensions = [];
    }

    registerDimension(dimension) {
        if (dimension instanceof CustomDimension) {
            this.dimensions.push(dimension);
        }
    }

    getDimension(namespace) {
        return this.dimensions.find(dimension => dimension.namespace === namespace);
    }
}