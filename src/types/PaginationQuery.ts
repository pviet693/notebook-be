export type PaginationQuery = {
    page: number;
    limit: number;
    categories?: string[];
    username?: string;
    excludeBlogSlug?: string;
    statuses?: string[];
    title?: string;
    authors?: string[];
};
