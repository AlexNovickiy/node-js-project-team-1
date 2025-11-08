import { parsePaginationParams } from '../utils/parsePaginationParams.js';

export const parsePagination = (req, res, next) => {
    try {
        const { page, perPage } = parsePaginationParams(req.query);
        req.paginationParams = { page, perPage };
        next();
    } catch (error) {
        next(error); 
    }
};