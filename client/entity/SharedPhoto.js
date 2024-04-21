class SharedPhoto{
    constructor(id, customerId, branchId, createdAt, photoImage){
        this.id = id;
        this.customerId = customerId;
        this.branchId = branchId;
        this.createdAt = createdAt;
        this.photoImage = photoImage;
    }
}

export default SharedPhoto;