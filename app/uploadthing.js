import { createUploadthing } from "uploadthing/express";

const f = createUploadthing();

export const uploadRouter = {
    WorkspaceImage: f({
        image: {
            maxFileSize: "2MB",
            maxFileCount: 1,
        },
    }).onUploadComplete((data) => {
        console.log("upload completed", data);
    }),
};
