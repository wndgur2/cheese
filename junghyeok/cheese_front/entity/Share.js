class Share{
    constructor(id, customerId, branchId, createdAt, sharedPhotoMap){
        this.id = id;
        this.customerId = customerId;
        this.branchId = branchId;
        this.createdAt = createdAt;
        this.sharedPhotoMap = sharedPhotoMap;
    }
}

export default Share;