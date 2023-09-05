class Share{
    constructor(id, customerId, nickname, branchId, createdAt, sharedPhotoMap){
        this.id = id;
        this.customerId = customerId;
        this.nickname = nickname;
        this.branchId = branchId;
        this.createdAt = createdAt;
        this.sharedPhotoMap = sharedPhotoMap;
    }
}

export default Share;