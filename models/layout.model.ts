import {Schema,model,Document} from "mongoose";


export interface Category extends Document{
    title:string;
}


interface Layout extends Document{
    type: string;
    categories: Category[];
}

const categorySchema = new Schema<Category> ({
    title: {type:String},
});


const layoutSchema = new Schema<Layout>({
   type:{type:String},
   categories: [categorySchema],
});

const LayoutModel = model<Layout>('Layout',layoutSchema);

export default LayoutModel;