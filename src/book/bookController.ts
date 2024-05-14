import { NextFunction, Request, Response } from "express";
import cloudinary from "../config/cloudaniry";
import path from "path";
import createHttpError from "http-errors";
import bookModel from "./bookModel";
import fs from "node:fs";
import { userInterface } from "../middleware/Authenticate";

export const AddBook = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const { title, genre } = req.body;
    const _req = req as userInterface;
    try {
        // upload cover image
        const files = req?.files as { [key: string]: Express.Multer.File[] };
        const coverImageMimeType = files?.coverImage[0].mimetype
            .split("/")
            .at(-1);
        const fileName = files?.coverImage[0].filename;
        const filePath = path?.resolve(
            __dirname,
            "../../public/uploads",
            fileName
        );

        const uploadResult = await cloudinary.uploader.upload(filePath, {
            filename_override: fileName,
            folder: "Book-cover",
            format: coverImageMimeType,
        });

        // upload book file
        const bookFileName = files?.file[0].filename;
        const bookFilePath = path?.resolve(
            __dirname,
            "../../public/uploads",
            bookFileName
        );
        const uploadBookFileResult = await cloudinary.uploader.upload(
            bookFilePath,
            {
                resource_type: "raw",
                filename_override: bookFileName,
                folder: "Book-pdfs",
                format: "pdf",
            }
        );
        // console.log(uploadBookFileResult);
        // create book
        const newBook = await bookModel?.create({
            title,
            genre,
            coverImage: uploadResult?.secure_url,
            file: uploadBookFileResult?.secure_url,
            author: _req?.userId,
        });

        // await fs.promise
        await fs.promises.unlink(filePath);
        await fs.promises.unlink(bookFilePath);
        res.status(201).json({ bookId: newBook?._id });
    } catch (error) {
        return next(createHttpError(500, `internal server error : ${error}`));
    }
};

export const updateBook = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const { title, genre } = req.body;
    const files = req.files as { [key: string]: Express.Multer.File[] };
    const bookId = req?.params?.bookId;

    try {
        const book = await bookModel.findOne({ _id: bookId });
        if (!book) {
            return next(createHttpError(404, "book not found"));
        }

        const _req = req as userInterface;
        if (book?.author.toString() !== _req?.userId) {
            return next(
                createHttpError(403, "you are not authorized to update")
            );
        }
        // cover Image updated
        const coverImageSplit = book?.coverImage?.split("/");
        const CoverImagepublic_id =
            coverImageSplit.at(-2) +
            "/" +
            coverImageSplit.at(-1)?.split(".").at(-2);

        if (files?.coverImage) {
            const filePath = path.resolve(
                __dirname,
                "../../public/uploads",
                files?.coverImage[0]?.filename
            );
            const uploadResult = await cloudinary.uploader.upload(
                files?.coverImage[0]?.path,
                {
                    public_id: CoverImagepublic_id,
                    resource_type: "auto",
                }
            );

            await fs.promises.unlink(filePath);

            book.coverImage = uploadResult?.secure_url;
        }
        // book files updated

        if (files?.file) {
            console.log(book?.file);

            const coverFileSplit = book?.file?.split("/");
            const Filepublic_id =
                coverFileSplit.at(-2) + "/" + coverFileSplit.at(-1);

            const filePath = path.resolve(
                __dirname,
                "../../public/uploads",
                files?.file[0]?.filename
            );
            console.log(filePath);
            console.log(Filepublic_id);

            const updateUploadResult = await cloudinary?.uploader?.upload(
                // files?.file[0]?.path,
                filePath,
                {
                    public_id: Filepublic_id,
                    resource_type: "raw",
                }
            );
            await fs.promises.unlink(filePath);
            book.file = updateUploadResult?.secure_url;
        }
        // update title and genre
        if (title) {
            book.title = title;
        }
        if (genre) {
            book.genre = genre;
        }

        await book.save();

        return res.status(200).json({ message: "updated successfully" });
    } catch (error) {
        return next(createHttpError(500, `Internal server error : ${error}`));
    }
};

export const getAllBooks = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const books = await bookModel.find().sort({ _id: -1 });
        return res.status(200).json({ books });
    } catch (error) {
        return next(createHttpError(500, `Internal server error : ${error}`));
    }
};
export const getBookById = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { id } = req?.params;
        const book = await bookModel.findById(id);
        return res.status(200).json({ book });
    } catch (error) {
        return next(createHttpError(500, `Internal server error : ${error}`));
    }
};

export const deleteBook = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { id } = req.params;
        const book = await bookModel.findById(id);
        if (!book) {
            return next(createHttpError(404, "book not found"));
        }
        const _req=req as userInterface;
        if (book.author.toString() !== _req?.userId){
            return next(createHttpError(403, "you are not the author"));
        }
        // delete book from cloudaniry
        const coverImageSplit = book?.coverImage?.split("/");
        const CoverImagepublic_id =
            coverImageSplit.at(-2) +
            "/" +
            coverImageSplit.at(-1)?.split(".").at(-2);
        if (CoverImagepublic_id) {
            try {
                await cloudinary.uploader.destroy(CoverImagepublic_id);
            } catch (error) {
                return next(
                    createHttpError(
                        500,
                        "Error when try to delete cover image from cloudaniry"
                    )
                );
            }
        }
        // delete file
        const BookFileSplit = book?.file?.split("/");
        const BookFilepublic_id =
            BookFileSplit.at(-2) + "/" + BookFileSplit.at(-1);
        if (BookFilepublic_id) {
            try {
                await cloudinary.uploader.destroy(BookFilepublic_id,{
                    resource_type:"raw"
                });
            } catch (error) {
                return next(
                    createHttpError(
                        500,
                        "Error when try to delete file from cloudaniry"
                    )
                );
            }
        }

        //delete whole documents:-
        await bookModel.findByIdAndDelete(id);

        // return res.status(200).json({ message: "deleted successfully" });
        return res.sendStatus(204)
    } catch (error) {
        return next(createHttpError(500, `Internal server error : ${error}`));
    }
};
