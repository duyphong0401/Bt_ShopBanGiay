 export class ShoessAPI {
    constructor(id,name,alias,price,description,size,shortDescription,quantity,deleted,categories,relatedProducts,feature,image)
     {
        this.id = id;
        this.name = name;
        this.alias = alias;
        this.price = price;
        this.description = description;
        this.size = size;
        this.shortDescription = shortDescription;
        this.quantity = quantity;
        this.deleted = deleted;
        this.categories = categories;
        this.relatedProducts = relatedProducts;
        this.feature = feature;
        this.image = image;
        this.thanhTien = 0
    }
}