import { Request, Response, NextFunction } from "express";
// import * as Customer from '../Services/Customer'
import glossaryModel from "../Models/CustomerSchema";



//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

/**
 * @api {get} /api/customers/grossaries Customer Grossaries - Listing
 * @apiGroup Customer-Grossary
 *
 * @apiHeaderExample {multipart/form-data} Header-Example
    {
        "Content-Type": "multipart/form-data"
    }
 *
 * @apiParam {String} page_no Page No.
 * @apiParam {String} limit Limit
 * @apiParam {String} keyword Search Keyword
 * @apiParam {String} start_date Start Date ( Format: YYYY-MM-DD )
 * @apiParam {String} end_date End Date ( Format: YYYY-MM-DD )
 * @apiParam {String} status Status
 *
 * @apiSuccessExample {json} Success-Example
    HTTP/1.1 200 OK
   {
    "status": true,
    "msg": "SUCCESS",
    "data": {
        "docs": [
            {
                "_id": "62a355286805d548cb02f7e6",
                "terms": "Atti2",
                "definitions": "Atti test2",
                "createdAt": "2022-06-10T14:28:56.869Z",
                "status": true
            },
            {
                "_id": "62a355226805d548cb02f7e5",
                "terms": "Atti",
                "definitions": "Atti test",
                "createdAt": "2022-06-10T14:28:50.487Z",
                "status": true
            }
        ],
        "totalDocs": 2,
        "limit": 10,
        "page": 1,
        "totalPages": 1,
        "pagingCounter": 1,
        "hasPrevPage": false,
        "hasNextPage": false,
        "prevPage": null,
        "nextPage": null
    }
}
 *
 * @apiErrorExample {json} Error-Example
    HTTP/1.1 400 Error
    {
        "message": "Error.",
        "data": {}
    }
*/
export const get_grossaries = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const page = Number(req.query.page_no) || 1;
        var limit = Number(req.query.limit) || 10;
        limit = [10, 20, 50].includes(limit) ? limit : 10;
        let matchPattern = {
            status: true
        }
        let queryPattern = []
        queryPattern.push({ $match: matchPattern })
        //  sortPattern
        const sortPattern = { _id: -1 }

        var query = glossaryModel.aggregate(queryPattern);
        //console.log("query : ", query);
        var options = {
            sort: sortPattern,
            page: page,
            limit: limit
        };
        // console.log("options : ", options);
        var paginatedData = await glossaryModel.aggregatePaginate(query, options);
        res.status(200).json({ status: true, msg: "SUCCESS", data: paginatedData });
    } catch (error) {
        res.status(200).json({ status: true, msg: error as Error, data: [] });
    }

};



//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

/**
 * @api {post} /api/customers/grossaries Customer Grossaries - Adding
 * @apiGroup Customer-Grossary
 *
 * @apiHeaderExample {multipart/form-data} Header-Example
    {
        "Content-Type": "multipart/form-data",
    }
 *
 * @apiParam {String} terms Termas: "Your Terms here"
 * @apiParam {String} definitions Definitions: "Your Definitions here"
 *
 * @apiSuccessExample {json} Success-Example
    HTTP/1.1 200 OK
    {
        "message": "Grossarry has created successfully.",
        "data": {}
    }
 *
 * @apiErrorExample {json} Error-Example
    HTTP/1.1 400 Error
    {
        "message": "Erorr message",
        "data": {}
    }
*/


export const create_grossaries = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        console.log(req.body)
        var terms = req.body.terms || "";
        var definitions = req.body.definitions || "";

        var createPattern = {
            terms: terms,
            definitions: definitions
        };
        console.log("createPattern : ",createPattern);
        
        var findPattern = { terms: terms };
        var itemData = await glossaryModel.findOne(findPattern);
        console.log(itemData);
        if (itemData) {
            console.log();
            res.status(200).json({ status: false, msg: "RECORD ALREADY EXISTS", data: [] });
        } else {
            await glossaryModel.create(createPattern);
            res.status(200).json({ status: true, msg: "RECORD CREATED SUCCESSFULLY", data: [] });
        }

    } catch (error) {
        console.log(error)
        res.status(500).json({ status: false, msg: error as Error });
    }
};




//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

/**
 * @api {get} /api/customer/grossaries/:item_id Grossary - Get Single
 * @apiGroup Customer-Grossary
 *
 * @apiHeaderExample {multipart/form-data} Header-Example
    {
        "Content-Type": "multipart/form-data"
    }
 *
 * @apiSuccessExample {json} Success-Example
    HTTP/1.1 200 OK
    {
    "status": true,
    "msg": "SUCCESS",
    "data": {
        "terms": "Glossary",
        "definitions": "Glossary definitions",
        "_id": "62a4126c10e636247c9217e5"
    }
}
 *
 * @apiErrorExample {json} Error-Example
    HTTP/1.1 400 Error
    {
        "message": "Invalid Glossary Request",
        "data": {}
    }
*/
export const get_grossary = async (req: Request,
    res: Response,
    next: NextFunction) => {

    try {

        var item_id = req.params.item_id || null;

        var findPattern = { _id: item_id };
        var selectPattern = "terms definitions";

        var itemData = await glossaryModel.findOne(findPattern, selectPattern);
        if (itemData) {
            res.status(200).json({ status: true, msg: "SUCCESS", data: itemData });
        } else {
            res.status(200).json({ status: false, msg: "NO GLOSSARY EXISTS ON ITEM ID", data: itemData });
        }
    } catch (error) {
        res.status(500).json({ status: false, msg: error as Error });

    }
};

//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

/**
 * @api {put} /api/customers/grossaries/item_id Customer Grossaries - Updating
 * @apiGroup Customer-Grossary
 *
 * @apiHeaderExample {multipart/form-data} Header-Example
    {
        "Content-Type": "multipart/form-data",
    }
 *
 * @apiParam {String} terms Termas: "Your Terms here"
 * @apiParam {String} definitions Definitions: "Your Definitions here"
 *
 * @apiSuccessExample {json} Success-Example
    HTTP/1.1 200 OK
    {
        "message": "Grossarry has updated successfully.",
        "data": {}
    }
 *
 * @apiErrorExample {json} Error-Example
    HTTP/1.1 400 Error
    {
        "message": "Erorr message",
        "data": {}
    }
*/

export const update_grossary = async (req: Request,
    res: Response,
    next: NextFunction) => {

    try {

        var item_id = req.params.item_id || null;
        var terms = req.body.terms || "";
        var definitions = req.body.definitions || "";

        var findPattern = { _id: item_id };
        var itemData = await glossaryModel.findOne(findPattern);

        if (!itemData) {
            res.status(400).json({ status: true, msg: "INVALID_GLOSSARY_REQUEST" });
        } else {
            var updatePattern = {
                terms: terms,
                definitions: definitions,
                updateAt: new Date()
            };
            await glossaryModel.findOneAndUpdate(findPattern, updatePattern);
            res.status(200).json({ status: true, msg: "GLOSSARY_UPDATED_SUCCESS" });
        }

    } catch (error) {
        res.status(500).json({ status: false, msg: error as Error });

    }
};


//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

/**
* @api {delete} /api/customers/grossaries/item_id Customer Grossaries - Deleting
 * @apiGroup Customer-Grossary
 *
 * @apiHeaderExample {multipart/form-data} Header-Example
    {
        "Content-Type": "multipart/form-data"
    }
 *
 * @apiSuccessExample {json} Success-Example
    HTTP/1.1 200 OK
    {
        "message": "Glossary has deleted successfully.",
        "data": {}
    }
 *
 * @apiErrorExample {json} Error-Example
    HTTP/1.1 400 Error
    {
        "message": "Invalid Glossary Request",
        "data": {}
    }
*/
export const delete_grossary = async (req: Request,
    res: Response,
    next: NextFunction) => {
    try {
        var item_id = req.params.item_id;
        var findPattern = { _id: item_id, status: true };
        var itemData = await glossaryModel.findOne(findPattern);
        if (!itemData) {
            res.status(400).json({ status: true, msg: "INVALID_GLOSSARY_REQUEST" });
        } else {
            glossaryModel.deleteOne(findPattern)
            res.status(200).json({ status: true, msg: "GLOSSARY_DELETE_SUCCESS" });
        }

    } catch (error) {
        res.status(500).json({ status: false, msg: error as Error });
    }
};
